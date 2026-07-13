import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeMarkets } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { product, description, audience, budget, funnelStage } =
      await request.json();

    if (!product) {
      return NextResponse.json(
        { error: "Produto e obrigatorio" },
        { status: 400 }
      );
    }

    const result = await analyzeMarkets({
      product,
      description,
      audience,
      budget,
      funnelStage,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Market analysis error:", error);
    return NextResponse.json(
      { error: "Erro ao analisar mercados" },
      { status: 500 }
    );
  }
}
