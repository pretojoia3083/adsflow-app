import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCampaignData } from "@/lib/anthropic";

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
      country,
      language,
      funnelStage,
      networkName,
    } = await request.json();

    if (!product || !country || !networkName) {
      return NextResponse.json(
        { error: "Campos obrigatorios faltando" },
        { status: 400 }
      );
    }

    const result = await generateCampaignData({
      product,
      description,
      audience,
      country,
      language,
      funnelStage,
      networkName,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Campaign generation error:", error);
    return NextResponse.json(
      { error: "Erro ao gerar dados da campanha" },
      { status: 500 }
    );
  }
}
