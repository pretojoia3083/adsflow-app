import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAdCopy } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const {
      product,
      description,
      audience,
      tone,
      country,
      countryCode,
      language,
      template,
      funnelStage,
    } = await request.json();

    if (!product || !country || !template) {
      return NextResponse.json(
        { error: "Campos obrigatorios faltando" },
        { status: 400 }
      );
    }

    const result = await generateAdCopy({
      product,
      description,
      audience,
      tone,
      country,
      countryCode,
      language,
      template,
      funnelStage,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Copy generation error:", error);
    return NextResponse.json(
      { error: "Erro ao gerar anuncios" },
      { status: 500 }
    );
  }
}
