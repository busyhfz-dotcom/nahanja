import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);
const sessionAge = 60 * 60 * 24 * 30;
const sessionCookie = "nahanja_member";
const origin = () => {
  const value = process.env.AUTH_PUBLIC_ORIGIN;
  if (!value) throw new Error("AUTH_PUBLIC_ORIGIN is required");
  return value.replace(/\/$/, "");
};
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const cookie = (maxAge = sessionAge) => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge });
const oauthCookie = (maxAge = 600) => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/member-api/google", maxAge });
const member = (user: { id:string; email:string|null; name:string|null; username:string|null; avatarUrl:string|null; emailVerified:boolean }) => ({ id:user.id, email:user.email, name:user.name, username:user.username, avatarUrl:user.avatarUrl, emailVerified:user.emailVerified });
const error = (message:string,status=400) => NextResponse.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
const emailOf = (value:unknown) => typeof value === "string" ? value.trim().toLowerCase() : "";
const usernameOf = (value:unknown) => {
  const username = typeof value === "string" ? value.trim().toLowerCase() : "";
  return /^[a-z0-9_\-\u0600-\u06ff]{3,32}$/u.test(username) ? username : "";
};
async function passwordHash(password:string) {
  const salt=randomBytes(16).toString("hex");
  const derived=(await scrypt(password,salt,64)) as Buffer;
  return "scrypt$"+salt+"$"+derived.toString("hex");
}
async function passwordMatches(password:string,stored:string) {
  const [algorithm,salt,expected]=stored.split("$");
  if(algorithm!=="scrypt"||!salt||!expected) return false;
  const actual=(await scrypt(password,salt,64)) as Buffer;
  const target=Buffer.from(expected,"hex");
  return actual.length===target.length&&timingSafeEqual(actual,target);
}
async function createSession(userId:string,response:NextResponse) {
  const token=randomBytes(32).toString("base64url");
  await prisma.authSession.deleteMany({where:{userId,expiresAt:{lt:new Date()}}});
  await prisma.authSession.create({data:{userId,tokenHash:hash(token),expiresAt:new Date(Date.now()+sessionAge*1000)}});
  response.cookies.set(sessionCookie,token,cookie());
}
async function sessionUser(request:NextRequest) {
  const token=request.cookies.get(sessionCookie)?.value;
  if(!token) return null;
  const session=await prisma.authSession.findUnique({where:{tokenHash:hash(token)},include:{user:true}});
  return session&&session.expiresAt>new Date()?member(session.user):null;
}
function finishOAuth(response:NextResponse) {
  response.cookies.set("nahanja_oauth_state","",oauthCookie(0));
  response.cookies.set("nahanja_oauth_verifier","",oauthCookie(0));
}
export async function GET(request:NextRequest,context:{params:Promise<{action:string[]}>}) {
  const action=(await context.params).action.join("/");
  if(action==="session") return NextResponse.json({user:await sessionUser(request)},{headers:{"Cache-Control":"no-store"}});
  if(action==="google") {
    const clientId=process.env.GOOGLE_CLIENT_ID;
    if(!clientId) return error("ورود گوگل هنوز پیکربندی نشده است.",503);
    const state=randomBytes(24).toString("base64url"),verifier=randomBytes(48).toString("base64url");
    const challenge=createHash("sha256").update(verifier).digest("base64url");
    const url=new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id",clientId);url.searchParams.set("redirect_uri",origin()+"/member-api/google/callback");
    url.searchParams.set("response_type","code");url.searchParams.set("scope","openid email profile");
    url.searchParams.set("state",state);url.searchParams.set("code_challenge",challenge);url.searchParams.set("code_challenge_method","S256");
    const response=NextResponse.redirect(url);response.cookies.set("nahanja_oauth_state",state,oauthCookie());response.cookies.set("nahanja_oauth_verifier",verifier,oauthCookie());return response;
  }
  if(action==="google/callback") {
    const fail=(message:string)=>{const response=NextResponse.redirect(origin()+"/nahanja-preview.html?auth_error="+encodeURIComponent(message));finishOAuth(response);return response;};
    const code=request.nextUrl.searchParams.get("code"),state=request.nextUrl.searchParams.get("state");
    const saved=request.cookies.get("nahanja_oauth_state")?.value,verifier=request.cookies.get("nahanja_oauth_verifier")?.value;
    if(!code||!state||!saved||state!==saved||!verifier) return fail("ورود گوگل تأیید نشد. دوباره تلاش کن.");
    const clientId=process.env.GOOGLE_CLIENT_ID,clientSecret=process.env.GOOGLE_CLIENT_SECRET;
    if(!clientId||!clientSecret) return fail("ورود گوگل هنوز آماده نیست.");
    const tokens=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code,client_id:clientId,client_secret:clientSecret,redirect_uri:origin()+"/member-api/google/callback",grant_type:"authorization_code",code_verifier:verifier})});
    if(!tokens.ok) return fail("تأیید گوگل ناموفق بود.");
    const tokenData=await tokens.json() as {access_token?:string};if(!tokenData.access_token) return fail("تأیید گوگل ناموفق بود.");
    const profileResponse=await fetch("https://openidconnect.googleapis.com/v1/userinfo",{headers:{Authorization:"Bearer "+tokenData.access_token}});
    if(!profileResponse.ok) return fail("دریافت اطلاعات حساب گوگل ناموفق بود.");
    const profile=await profileResponse.json() as {sub?:string;email?:string;email_verified?:boolean;name?:string;picture?:string};
    if(!profile.sub||!profile.email||profile.email_verified!==true) return fail("یک ایمیل تأییدشدهٔ گوگل لازم است.");
    let account=await prisma.oAuthAccount.findUnique({where:{provider_providerAccountId:{provider:"google",providerAccountId:profile.sub}},include:{user:true}});
    if(!account) {let user=await prisma.user.findUnique({where:{email:profile.email}});if(!user) user=await prisma.user.create({data:{email:profile.email,name:profile.name?.slice(0,80)||null,avatarUrl:profile.picture||null,emailVerified:true}});account=await prisma.oAuthAccount.create({data:{userId:user.id,provider:"google",providerAccountId:profile.sub},include:{user:true}});}
    const response=NextResponse.redirect(origin()+"/nahanja-preview.html?auth=google");finishOAuth(response);await createSession(account.user.id,response);return response;
  }
  return error("مسیر پیدا نشد.",404);
}
export async function POST(request:NextRequest,context:{params:Promise<{action:string[]}>}) {
  const action=(await context.params).action.join("/");
  if(action==="signout") {const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});const token=request.cookies.get(sessionCookie)?.value;if(token) await prisma.authSession.deleteMany({where:{tokenHash:hash(token)}});response.cookies.set(sessionCookie,"",cookie(0));return response;}
  let body:Record<string,unknown>;try{body=await request.json();}catch{return error("درخواست نامعتبر است.");}
  if(action==="register") {
    const email=emailOf(body.email),username=usernameOf(body.username),password=typeof body.password==="string"?body.password:"",name=typeof body.name==="string"?body.name.trim().slice(0,80):null;
    if(!/^\S+@\S+\.\S+$/.test(email)) return error("یک ایمیل معتبر وارد کن.");
    if(!username) return error("نام کاربری باید ۳ تا ۳۲ کاراکتر باشد.");
    if(password.length<10||password.length>128||!/[A-Za-z\u0600-\u06ff]/u.test(password)||!/\d/.test(password)) return error("رمز باید دست‌کم ۱۰ کاراکتر و شامل حرف و عدد باشد.");
    const existing=await prisma.user.findFirst({where:{OR:[{email},{username}]},select:{email:true,username:true}});
    if(existing?.email===email) return error("این ایمیل قبلاً ثبت شده است.",409);
    if(existing?.username===username) return error("این نام کاربری قبلاً انتخاب شده است.",409);
    const user=await prisma.user.create({data:{email,username,name,passwordHash:await passwordHash(password)}});
    const response=NextResponse.json({user:member(user),emailVerificationRequired:true},{status:201,headers:{"Cache-Control":"no-store"}});await createSession(user.id,response);return response;
  }
  if(action==="signin") {
    const identity=emailOf(body.identity)||(typeof body.identity==="string"?body.identity.trim().toLowerCase():""),password=typeof body.password==="string"?body.password:"";
    const user=await prisma.user.findFirst({where:{OR:[{email:identity},{username:identity}]}});
    if(!user?.passwordHash||!(await passwordMatches(password,user.passwordHash))) return error("مشخصات ورود درست نیست.",401);
    const response=NextResponse.json({user:member(user)},{headers:{"Cache-Control":"no-store"}});await createSession(user.id,response);return response;
  }
  return error("مسیر پیدا نشد.",404);
}
