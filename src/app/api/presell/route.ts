import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const presells = await prisma.presell.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(presells);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  if (!data.slug || !data.title) {
    return NextResponse.json(
      { error: "slug and title are required" },
      { status: 400 }
    );
  }

  const presell = await prisma.presell.create({
    data: {
      userId: session.user.id,
      slug: data.slug,
      title: data.title,
      headline: data.headline ?? null,
      subheadline: data.subheadline ?? null,
      bodyText: data.bodyText ?? null,
      ctaText: data.ctaText ?? null,
      ctaLink: data.ctaLink ?? null,
      bgColor: data.bgColor ?? null,
      accentColor: data.accentColor ?? null,
      textColor: data.textColor ?? null,
      customHtml: data.customHtml ?? null,
      template: data.template ?? "advertorial",
      language: data.language ?? "pt",
      network: data.network ?? null,
      affLink: data.affLink ?? null,
    },
  });

  return NextResponse.json(presell);
}
