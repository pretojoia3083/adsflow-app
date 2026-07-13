import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { productName, audience, country, funnelStage, tone } = body;

  if (!productName) {
    return NextResponse.json(
      { error: "productName is required" },
      { status: 400 }
    );
  }

  const headlines: Record<string, string[]> = {
    topo: [
      `${productName} — A solução que você estava procurando`,
      `Descubra como ${productName} pode transformar seus resultados`,
      `Chega de complicação. Conheça ${productName}`,
    ],
    meio: [
      `Por que milhares de pessoas estão escolhendo ${productName}?`,
      `${productName}: veja os resultados que ninguém te conta`,
      `A diferença entre ${productName} e as alternças`,
    ],
    fundo: [
      `Última chance — ${productName} com condição especial`,
      `Garanta já seu acesso ao ${productName}`,
      `${productName}: comece hoje e veja resultados em 7 dias`,
    ],
  };

  const primaryTexts: Record<string, string[]> = {
    topo: [
      `Você sabia que a maioria das pessoas perde tempo com soluções que não funcionam? ${productName} foi criado justamente para mudar isso. Uma abordagem simples, direta e comprovada que vai te ajudar a alcançar seus objetivos sem complicação.`,
      `Imagine ter nas mãos uma ferramenta que automatiza o que hoje leva horas. O ${productName} faz exatamente isso — de forma inteligente, rápida e acessível.`,
    ],
    meio: [
      `Já pensou por que alguns resultados aparecem para poucos e não para você? O segredo está na方法. ${productName} utiliza uma方法 comprovada que já ajudou milhares de pessoas a transformar seus resultados.`,
      `Não é sorte, é método. O ${productName} foi desenhado para entregar resultados consistentes, mesmo que você esteja começando do zero.`,
    ],
    fundo: [
      `Não deixe para depois. A condição especial do ${productName} expira em breve e você não vai querer perder essa oportunidade. Clique agora e comece a transformar seus resultados hoje mesmo.`,
      `São apenas algumas vagas restantes. Garanta seu acesso ao ${productName} agora e comece a ver resultados reais a partir de hoje.`,
    ],
  };

  const descriptions: Record<string, string[]> = {
    topo: [
      `${productName}: a forma mais eficiente de alcançar seus objetivos. Simples, poderosa e feita para você.`,
      `Conheça o ${productName} — uma solução completa para quem busca resultados reais.`,
    ],
    meio: [
      `${productName} já ajudou milhares a alcançar seus objetivos. Descubra o porquê.`,
      `Veja o que torna o ${productName} diferente de tudo que você já tentou.`,
    ],
    fundo: [
      `Não espere mais. ${productName} com condição especial — garanta o seu agora.`,
      `Acesso liberado imediatamente. Comece agora com o ${productName}.`,
    ],
  };

  const stage = (funnelStage as string) || "meio";

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return NextResponse.json({
    headline: pick(headlines[stage] ?? headlines.meio),
    primaryText: pick(primaryTexts[stage] ?? primaryTexts.meio),
    description: pick(descriptions[stage] ?? descriptions.meio),
    cta: "Saiba Mais",
  });
}
