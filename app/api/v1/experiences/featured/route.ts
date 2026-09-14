import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    data: [
      { slug: "sleepless-nights", title: "برای شب‌هایی که خواب نمی‌آید", feeling: ["بی‌خوابی", "آرامش"], audioDurationSeconds: 180 },
      { slug: "a-letter-at-home", title: "یک خانه، یک غیبت، یک نامه", feeling: ["دلتنگی", "خانه"], readingMinutes: 4 },
    ],
    meta: { version: "v1", source: "editorial" },
  });
}
