import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { productName, audience, country, language } = await req.json();

  if (!productName || !country) {
    return NextResponse.json(
      { error: "productName and country are required" },
      { status: 400 }
    );
  }

  const score = Math.floor(Math.random() * 40) + 60;

  const competitions = ["Baixa", "Média", "Alta"];
  const saturations = ["Baixa", "Moderada", "Alta"];
  const opportunities = [
    "Alto potencial — público engajado, poucos concorrentes",
    "Potencial moderado — considere diferenciar a oferta",
    "Mercado competitivo — foque em criativos de alta qualidade",
    "Oportunidade emergente —primeiro movimento pode capturar market share",
  ];

  const cpmBase: Record<string, number> = {
    BR: 4.5,
    US: 8.2,
    PT: 5.8,
    MZ: 2.1,
    AO: 2.5,
    CV: 3.0,
    GW: 1.8,
    ST: 1.9,
    TL: 2.0,
    ES: 6.1,
    AR: 3.2,
    CO: 3.8,
    MX: 4.0,
    CL: 4.5,
  };

  const base = cpmBase[country] ?? 5.0;
  const cpmVariance = (Math.random() - 0.5) * 2;
  const cpm = (base + cpmVariance).toFixed(2);

  const audienceSizes = [
    "500K - 1.2M",
    "1.2M - 3.5M",
    "3.5M - 8M",
    "8M - 15M",
    "15M - 40M",
  ];

  const recommendations: string[] = [];
  if (score >= 80) {
    recommendations.push("Excelente pontuação — teste com orçamento inicial moderado");
    recommendations.push("Use A/B testing nos primeiros 3 dias");
  } else if (score >= 65) {
    recommendations.push("Mercado aceitável — comece com orçamento conservador");
    recommendations.push("Invista em criativos variados para validar");
  } else {
    recommendations.push("Mercado competitivo — foque em nicho específico");
    recommendations.push("Considere ajustar o público-alvo");
  }
  recommendations.push(
    `Publique entre 18h-21h no horário de ${country === "BR" || country === "PT" ? "Brasília/Lisboa" : "local"}`
  );
  recommendations.push("MonitoreCPM nas primeiras 24h antes de escalar");

  return NextResponse.json({
    score,
    competition: competitions[Math.floor(Math.random() * competitions.length)],
    saturation: saturations[Math.floor(Math.random() * saturations.length)],
    opportunity:
      opportunities[Math.floor(Math.random() * opportunities.length)],
    cpmEstimate: `$${cpm} USD`,
    audienceSize:
      audienceSizes[Math.floor(Math.random() * audienceSizes.length)],
    recommendations,
  });
}
