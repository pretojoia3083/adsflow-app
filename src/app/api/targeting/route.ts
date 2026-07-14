import { NextRequest, NextResponse } from "next/server";
import { aiGenerateJSON, getOpenAI } from "@/lib/ai";

interface TargetingResult {
  keywords: string;
  interests: string;
  placements: string[];
  funnelStage: string;
}

function mockTargeting(body: { productName: string; funnelStage?: string }): TargetingResult {
  const stage = body.funnelStage || "meio";
  const p = body.productName;
  const keywordBank: Record<string, string[]> = {
    topo: [`${p}`, `como ${p}`, `${p} funciona`, `melhor ${p}`, `${p} 2026`, `${p} resultado`, `opiniao ${p}`, `${p} vale a pena`, `onde comprar ${p}`, `${p} original`],
    meio: [`${p} review`, `${p} experiencia`, `${p} antes e depois`, `${p} depoimento`, `${p} comparacao`, `${p} alternativa`, `${p} funciona mesmo`, `quanto custa ${p}`, `${p} promocao`, `${p} melhor preco`],
    fundo: [`${p} comprar`, `${p} desconto`, `${p} cupom`, `${p} oferta`, `${p} frete gratis`, `${p} garantia`, `${p} pagamento`, `${p} parcelado`, `${p} entrega`, `${p} site oficial`],
  };
  const interestBank: Record<string, string[]> = {
    topo: ["Marketing digital", "Empreendedorismo", "Negocios online", "Vendas online", "Growth hacking", "Produtividade", "Automacao", "Tecnologia", "Inovacao"],
    meio: ["Comportamento do consumidor", "E-commerce", "Dropshipping", "Infoprodutos", "Trafego pago", "Facebook Ads", "Google Ads", "Copywriting", "Funil de vendas"],
    fundo: ["Compras online", "Ofertas do dia", "Cupons de desconto", "Promocoes online", "Melhores precos", "Frete gratis", "Cashback", "Loja online"],
  };
  return {
    keywords: keywordBank[stage]?.join(", ") || keywordBank.meio.join(", "),
    interests: interestBank[stage]?.join(", ") || interestBank.meio.join(", "),
    placements: stage === "topo" ? ["Feed do Facebook", "Stories do Facebook", "Reels do Facebook", "Feed do Instagram", "Stories do Instagram", "Reels do Instagram"] : stage === "fundo" ? ["Feed do Facebook", "Feed do Instagram", "Audience Network"] : ["Feed do Facebook", "Feed do Instagram", "Stories do Instagram", "Audience Network"],
    funnelStage: stage,
  };
}

export async function POST(req: NextRequest) {
  const { productName, audience, country, funnelStage } = await req.json();

  if (!productName) {
    return NextResponse.json({ error: "productName is required" }, { status: 400 });
  }

  const openai = getOpenAI();

  if (!openai) {
    return NextResponse.json(mockTargeting({ productName, funnelStage }));
  }

  const stageLabel = funnelStage === "topo" ? "topo de funil (consciencia/reconhecimento)" : funnelStage === "fundo" ? "fundo de funil (conversao/venda)" : "meio de funil (consideracao)";

  const result = await aiGenerateJSON<TargetingResult>(
    `Gere dados de segmentacao para uma campanha no Meta Ads.
Produto: "${productName}"
Pais: ${country || "Brasil"}
Publico-alvo: ${audience || "geral"}
Estagio do funil: ${stageLabel}

Retorne um JSON com exatamente esses campos:
- keywords: string com 8-12 palavras-chave separadas por virgula, relevantes para o produto e pais
- interests: string com 6-10 interesses do Facebook separados por virgula, que o publico-alvo tem em comum
- placements: array com os posicionamentos ideais para este estagio (Feed do Facebook, Feed do Instagram, Stories do Instagram, Reels do Instagram, Audience Network, Messenger)
- funnelStage: "${funnelStage || "meio"}"`,

    `Voce e um especialista em trafego pago e Meta Ads. Gere segmentacao precisa e relevante para o publico e produto informados. Use interesses que existam realmente no Meta Ads Manager. Palavras-chave devem ter alto potencial de busca no pais indicado.`
  );

  if (result && result.keywords) {
    return NextResponse.json(result);
  }

  return NextResponse.json(mockTargeting({ productName, funnelStage }));
}
