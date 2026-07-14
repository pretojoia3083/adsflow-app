import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { productName, audience, country, funnelStage } = await req.json();

  if (!productName) {
    return NextResponse.json({ error: "productName is required" }, { status: 400 });
  }

  const keywordBank: Record<string, string[]> = {
    topo: [
      `${productName}`,
      `como ${productName}`,
      `${productName} funciona`,
      `melhor ${productName}`,
      `${productName} 2026`,
      `${productName} resultado`,
      `opiniao ${productName}`,
      `${productName} vale a pena`,
      `onde comprar ${productName}`,
      `${productName} original`,
    ],
    meio: [
      `${productName} review`,
      `${productName} experiencia`,
      `${productName} antes e depois`,
      `${productName} depoimento`,
      `${productName} comparacao`,
      `${productName} alternativa`,
      `${productName} funciona mesmo`,
      `quanto custa ${productName}`,
      `${productName} promocao`,
      `${productName} melhor preco`,
    ],
    fundo: [
      `${productName} comprar`,
      `${productName} desconto`,
      `${productName} cupom`,
      `${productName} oferta`,
      `${productName} frete gratis`,
      `${productName} garantia`,
      `${productName} pagamento`,
      `${productName} parcelado`,
      `${productName} entrega`,
      `${productName} site oficial`,
    ],
  };

  const interestBank: Record<string, string[]> = {
    topo: [
      "Marketing digital",
      "Empreendedorismo",
      "Negocios online",
      "Vendas online",
      "Growth hacking",
      "Produtividade",
      "Automacao",
      "Tecnologia",
      "Inovacao",
      "Criatividade",
    ],
    meio: [
      "Comportamento do consumidor",
      "E-commerce",
      "Dropshipping",
      "Infoprodutos",
      "Trafego pago",
      "Facebook Ads",
      "Google Ads",
      "Copywriting",
      "Funil de vendas",
      "Email marketing",
    ],
    fundo: [
      "Compras online",
      "Ofertas do dia",
      "Cupons de desconto",
      "Promocoes online",
      "Melhores precos",
      "Frete gratis",
      "Cashback",
      "Loja online",
      "Checkout",
      "Compra segura",
    ],
  };

  const placementByFunnel: Record<string, string[]> = {
    topo: [
      "Feed do Facebook",
      "Stories do Facebook",
      "Reels do Facebook",
      "Feed do Instagram",
      "Stories do Instagram",
      "Reels do Instagram",
    ],
    meio: [
      "Feed do Facebook",
      "Feed do Instagram",
      "Stories do Instagram",
      "Audience Network",
      "Messenger",
    ],
    fundo: [
      "Feed do Facebook",
      "Feed do Instagram",
      "Audience Network",
      "Messenger",
    ],
  };

  const stage = (funnelStage as string) || "meio";
  const keywords = keywordBank[stage] ?? keywordBank.meio;
  const interests = interestBank[stage] ?? interestBank.meio;
  const placements = placementByFunnel[stage] ?? placementByFunnel.meio;

  return NextResponse.json({
    keywords: keywords.join(", "),
    interests: interests.join(", "),
    placements,
    funnelStage: stage,
  });
}
