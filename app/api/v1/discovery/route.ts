import { NextRequest, NextResponse } from "next/server";

const paths = {
  آرامش: ["sleepless-nights", "lights-off"],
  دلتنگی: ["a-letter-at-home", "homes-that-speak"],
  شروع: ["between-fear-and-beginning", "start-again"],
};

export async function GET(request: NextRequest) {
  const feeling = request.nextUrl.searchParams.get("feeling")?.trim() || "آرامش";
  return NextResponse.json({
    data: { feeling, experienceSlugs: paths[feeling as keyof typeof paths] ?? paths.آرامش },
    meta: { version: "v1", personalised: false },
  });
}
