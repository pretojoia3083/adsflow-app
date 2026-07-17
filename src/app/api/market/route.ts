import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { aiGenerateJSON, getOpenAI } from "@/lib/ai";

interface MarketResult {
  score: number;
  competition: string;
  saturation: string;
  opportunity: string;
  cpmEstimate: string;
  audienceSize: string;
  recommendations: string[];
}

function mockMarket(body: { productName: string; country?: string }): MarketResult {
  const score = Math.floor(Math.random() * 40) + 60;
  const cpmBase: Record<string, number> = { BR: 4.5, US: 8.2, PT: 5.8, MZ: 2.1, AO: 2.5, ES: 6.1, AR: 3.2, CO: 3.8, MX: 4.0 };
  const base = cpmBase[body.country || "BR"] ?? 5.0;
  const cpm = (base + (Math.random() - 0.5) * 2).toFixed(2);
  return {
    score,
    competition: ["Baixa", "Media", "Alta"][Math.floor(Math.random() * 3)],
    saturation: ["Baixa", "Moderada", "Alta"][Math.floor(Math.random() * 3)],
    opportunity: "Oportunidade emergente — primeiro movimento pode capturar market share",
    cpmEstimate: `$${cpm} USD`,
    audienceSize: ["500K - 1.2M", "1.2M - 3.5M", "3.5M - 8M", "8M - 15M"][Math.floor(Math.random() * 4)],
    recommendations: [
      "Excelente pontuacao — teste com orcamento inicial moderado",
      "Use A/B testing nos primeiros 3 dias",
      "Monitore CPM nas primeiras 24h antes de escalar",
    ],
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productName, audience, country, language } = await req.json();

  if (!productName || !country) {
    return NextResponse.json({ error: "productName and country are required" }, { status: 400 });
  }

  const openai = getOpenAI();

  if (!openai) {
    return NextResponse.json(mockMarket({ productName, country }));
  }

  const result = await aiGenerateJSON<MarketResult>(
    `Analise o mercado para uma campanha no Meta Ads.
Produto: "${productName}"
Pais: ${country}
Publico-alvo: ${audience || "geral"}

Retorne um JSON com exatamente esses campos:
- score: numero de 0 a 100 representando o potencial deste produto neste pais
- competition: "Baixa", "Media" ou "Alta"
- saturation: "Baixa", "Moderada" ou "Alta"
- opportunity: frase curta descrevendo a oportunidade (max 80 caracteres)
- cpmEstimate: valor estimado do CPM em USD (ex: "$4.50 USD")
- audienceSize: estimativa do tamanho do publico no formato "X - Y"
- recommendations: array com 3-5 recomendacoes especificas para esta campanha`,

    `Voce e um consultor de marketing digital especializado em Meta Ads para o Brasil e mercados internacionais. Seja preciso nas estimativas baseado no tipo de produto e pais informado. CPM deve refletir a realidade do pais. Publico-alvo deve ser realista.`
  );

  if (result && result.score) {
    return NextResponse.json(result);
  }

  return NextResponse.json(mockMarket({ productName, country }));
}
