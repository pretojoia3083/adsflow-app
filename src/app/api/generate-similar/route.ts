import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { aiGenerateJSON } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { pageInfo, productName, productDescription } = body;

  if (!pageInfo) {
    return NextResponse.json({ error: "Page info required" }, { status: 400 });
  }

  const systemPrompt = `Voce e um especialista em criacao de presell pages para marketing de afiliados.
Analise a pagina de vendas fornecida e crie uma presell similares mas unica, otimizada para conversao.
NUNCA copie textualmente. Crie conteudo original inspirado no estilo, tom e estrutura.`;

  const userPrompt = `Analise esta pagina de vendas e crie uma presell similar:

TITULO DA PAGINA: ${pageInfo.title || "N/A"}
DESCRICAO: ${pageInfo.description || "N/A"}
HEADINGS PRINCIPAIS: ${pageInfo.headings?.h2?.join(", ") || "N/A"}
CTAS: ${pageInfo.ctas?.join(", ") || "N/A"}
TRECHO DO CONTEUDO: ${pageInfo.bodyText?.slice(0, 2000) || "N/A"}

PRODUTO DO CLIENTE: ${productName || "N/A"}
DESCRICAO DO PRODUTO: ${productDescription || "N/A"}

Retorne um JSON com:
{
  "headline": "Titular chamativo para a presell (max 80 chars)",
  "subheadline": "Subtitular que complementa o titulo (max 120 chars)",
  "bodyText": "Texto principal da presell em formato advertorial, com gatilhos mentais e prova social (minimo 300 chars)",
  "ctaText": "Texto do botao CTA (ex: Quero Comecar Agora)",
  "keyPoints": ["ponto forte 1", "ponto forte 2", "ponto forte 3"],
  "tone": "tom utilizado (ex: urgente, inspirador, informativo)",
  "style": "estilo detectado (ex: storytelling, lista, depoimento)"
}`;

  try {
    const result = await aiGenerateJSON(userPrompt, systemPrompt);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({
      headline: `Descubra como ${productName || "transformar seus resultados"}`,
      subheadline: "Metodo comprovado que ja ajudou milhares de pessoas",
      bodyText: `Voce sabia que existem estrategias comprovadas que podem transformar seus resultados?\n\nNossa pesquisa revelou que 93% das pessoas que aplicam esse metodo veem resultados na primeira semana.\n\nA diferenca entre quem consegue e quem nao consegue e simples: o metodo certo.\n\nNao importa onde voce esta hoje — o que importa e a decisao de comecar. E hoje e o dia ideal para isso.\n\nCom garantia de 30 dias, voce nao tem nada a perder e tudo a ganhar.`,
      ctaText: "Quero Comecar Agora",
      keyPoints: ["Metodo testado e aprovado", "Resultados na primeira semana", "Garantia de 30 dias"],
      tone: "urgente e motivacional",
      style: "storytelling",
    });
  }
}
