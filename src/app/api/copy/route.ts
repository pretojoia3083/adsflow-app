import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { aiGenerateJSON } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

interface CopyResult {
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
}

function mockCopy(body: { productName: string; funnelStage?: string }): CopyResult {
  const stage = body.funnelStage || "meio";
  const p = body.productName;
  const headlines: Record<string, string[]> = {
    topo: [`${p} — A solucao que voce estava procurando`, `Descubra como ${p} pode transformar seus resultados`, `Chega de complicacao. Conheca ${p}`],
    meio: [`Por que milhares de pessoas estao escolhendo ${p}?`, `${p}: veja os resultados que ninguem te conta`, `A diferenca entre ${p} e as alternativas`],
    fundo: [`Ultima chance — ${p} com condicao especial`, `Garanta ja seu acesso ao ${p}`, `${p}: comece hoje e veja resultados em 7 dias`],
  };
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  return {
    headline: pick(headlines[stage] ?? headlines.meio),
    primaryText: `${p} foi criado para entregar resultados reais. Metodo comprovado que ja ajudou milhares de pessoas a alcancar seus objetivos.`,
    description: `${p}: a forma mais eficiente de alcancar seus objetivos. Simples, poderosa e feita para voce.`,
    cta: "Saiba Mais",
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { openaiApiKey: true },
  });
  const userKey = user?.openaiApiKey || null;

  const body = await req.json();
  const { productName, audience, country, funnelStage, tone } = body;

  if (!productName) {
    return NextResponse.json({ error: "productName is required" }, { status: 400 });
  }

  const stageLabel = funnelStage === "topo" ? "topo de funil (consciencia)" : funnelStage === "fundo" ? "fundo de funil (conversao)" : "meio de funil (consideracao)";

  const result = await aiGenerateJSON<CopyResult>(
    `Gere um copy para anuncio do Meta Ads para o produto "${productName}".
Pais alvo: ${country || "Brasil"}.
Publico-alvo: ${audience || "geral"}.
Estagio do funil: ${stageLabel}.
Tom de voz: ${tone || "profissional e persuasivo"}.

Retorne um JSON com exatamente esses campos:
- headline: titulo chamativo (max 40 caracteres)
- primaryText: texto principal do anuncio (150-300 caracteres, persuasivo)
- description: descricao curta do anuncio (max 90 caracteres)
- cta: call to action em portugues (ex: Saiba Mais, Comprar Agora, Quero Testar, Assinar Agora)`,

    `Voce e um especialista em copywriting para Meta Ads. Gere textos persuasivos, com gatilhos mentais, em portugues do Brasil. Nao use aspas no headline. O texto principal deve gerar curiosidade e urgencia.`,
    userKey
  );

  if (result && result.headline) {
    return NextResponse.json(result);
  }

  return NextResponse.json(mockCopy(body));
}
