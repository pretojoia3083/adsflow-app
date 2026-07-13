import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePresellHtml } from "@/lib/presell";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const {
      slug,
      title,
      headline,
      subheadline,
      bodyText,
      ctaText,
      ctaLink,
      bgColor,
      accentColor,
      textColor,
      template,
      language,
      campaignId,
    } = await request.json();

    if (!slug || !title || !headline || !bodyText) {
      return NextResponse.json(
        { error: "Campos obrigatorios faltando" },
        { status: 400 }
      );
    }

    const existingPresell = await prisma.presell.findUnique({
      where: { slug },
    });

    if (existingPresell) {
      return NextResponse.json(
        { error: "Esse slug ja esta em uso" },
        { status: 400 }
      );
    }

    const html = generatePresellHtml({
      title,
      headline,
      subheadline,
      bodyText,
      ctaText: ctaText || "Saiba Mais",
      ctaLink: ctaLink || "#",
      bgColor: bgColor || "#0B0F17",
      accentColor: accentColor || "#6366F1",
      textColor: textColor || "#F1F5F9",
      template: (template || "advertorial") as "advertorial",
      language: language || "pt-BR",
    });

    const presell = await prisma.presell.create({
      data: {
        userId: session.user.id,
        slug,
        title,
        headline,
        subheadline,
        bodyText,
        ctaText: ctaText || "Saiba Mais",
        ctaLink: ctaLink || "#",
        bgColor: bgColor || "#0B0F17",
        accentColor: accentColor || "#6366F1",
        textColor: textColor || "#F1F5F9",
        template: template || "advertorial",
        language: language || "pt-BR",
        customHtml: html,
        campaignId: campaignId || null,
        published: true,
      },
    });

    return NextResponse.json({
      id: presell.id,
      slug: presell.slug,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${presell.slug}`,
    });
  } catch (error) {
    console.error("Presell creation error:", error);
    return NextResponse.json(
      { error: "Erro ao criar presell" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const presells = await prisma.presell.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(presells);
  } catch (error) {
    console.error("Presell list error:", error);
    return NextResponse.json(
      { error: "Erro ao listar presells" },
      { status: 500 }
    );
  }
}
