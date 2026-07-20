import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { aiGenerateJSON, getOpenAI } from "@/lib/ai";

interface PresellResult {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  niche: string;
  mood: string;
  affiliateLink: string;
}

const NICHE_COLORS: Record<string, { bg: string; accent: string; text: string; mood: string }> = {
  saude: { bg: "#0A1628", accent: "#00B4D8", text: "#F0F4F8", mood: "conforto e confianca" },
  emagrecimento: { bg: "#0B1A12", accent: "#22C55E", text: "#F0FFF4", mood: "energia e vitalidade" },
  fitness: { bg: "#1A0A0A", accent: "#EF4444", text: "#FFF5F5", mood: "forca e determinacao" },
  beleza: { bg: "#1A0F1E", accent: "#D946EF", text: "#FDF4FF", mood: "elegancia e sofisticacao" },
  financeiro: { bg: "#0F172A", accent: "#FBBF24", text: "#FFFBEB", mood: "sucesso e prosperidade" },
  marketing: { bg: "#0C0F1A", accent: "#6366F1", text: "#EEF2FF", mood: "inovacao e resultado" },
  tecnologia: { bg: "#0A0E1A", accent: "#3B82F6", text: "#EFF6FF", mood: "modernidade e eficiencia" },
  educacao: { bg: "#0F172A", accent: "#8B5CF6", text: "#F5F3FF", mood: "conhecimento e evolucao" },
 default: { bg: "#080B14", accent: "#8B5CF6", text: "#F3F5FF", mood: "confianca e resultado" },
};

function detectNiche(productName: string, description: string): string {
  const text = `${productName} ${description}`.toLowerCase();

  if (/emagrec|perd[ae]r?\s+peso|dieta|gord|barriga|lipo|suple.*peso|capsul|chá\s+digest|detox|queim/i.test(text)) return "emagrecimento";
  if (/sa[úu]de|rem[eé]d|medic|hospital|cl[ií]nic|doen[çc]|tratamento|vacina|exame/i.test(text)) return "saude";
  if (/academia|treino|muscula|personal|workout|crossfit|protein|shape|pilates|yoga/i.test(text)) return "fitness";
  if (/beleza|cabelo|pele|maquiag|skin|cuidado.*pele|botox|estetic|unha|sobrancelha/i.test(text)) return "beleza";
  if (/invest|renda|dinheiro|finan|bolsa|cripto|trader|forex|milh|lucro|cash|money/i.test(text)) return "financeiro";
  if (/marketing|traf[eé]g|an[uú]nci|facebook\s+ads|google\s+ads|conversion|funil|leads|copy/i.test(text)) return "marketing";
  if (/softwar|sistema|app|program|c[oó]dig|tech|ia|automatiz|chatgpt|digital/i.test(text)) return "tecnologia";
  if (/curs|coaching|mentoria|aula|aprend|certifica|diplom|formac|escola|ensino/i.test(text)) return "educacao";

  return "default";
}

function generateHeadline(productName: string, mood: string): string {
  const templates = [
    `${productName} — Descubra como funciona`,
    `Conheca ${productName} e transforme seus resultados`,
    `${productName}: a solucao que voce estava procurando`,
    `Como ${productName} pode mudar sua vida`,
    `Veja como ${productName} funciona na pratica`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateSubheadline(productName: string): string {
  const templates = [
    `Metodo comprovado para quem busca resultados reais`,
    `Milhares de pessoas ja estao usando e aprovando`,
    `Solucao completa com garantia de satisfacao`,
    `Descubra o passo a passo para alcanar seus objetivos`,
    `Acelere seus resultados com ${productName}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateBodyText(productName: string, audience: string): string {
  return `Voce sabia que a maioria das pessoas perde tempo com solucoes que nao funcionam? O ${productName} foi criado justamente para mudar isso. Uma abordagem simples, direta e comprovada que vai te ajudar a alcancar seus objetivos sem complicacao. ${audience ? `Ideal para ${audience}.` : ""} Veja como funciona e comece hoje mesmo.`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productName, description, audience, affiliateLink } = await req.json();

  if (!productName) {
    return NextResponse.json({ error: "productName is required" }, { status: 400 });
  }

  const niche = detectNiche(productName, description || "");
  const colors = NICHE_COLORS[niche] || NICHE_COLORS.default;

  const baseSlug = productName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const slug = baseSlug + "-" + Date.now().toString(36);

  const openai = getOpenAI();

  if (!openai) {
    return NextResponse.json({
      slug,
      title: productName,
      headline: generateHeadline(productName, colors.mood),
      subheadline: generateSubheadline(productName),
      ctaText: "Saiba Mais",
      bgColor: colors.bg,
      accentColor: colors.accent,
      textColor: colors.text,
      niche,
      mood: colors.mood,
      affiliateLink: affiliateLink || "",
    });
  }

  const aiResult = await aiGenerateJSON<{ headline: string; subheadline: string; ctaText: string }>(
    `Gere textos para uma pagina de presell (pre-venda) de afiliado.
Produto: "${productName}"
Descricao: ${description || "N/A"}
Publico-alvo: ${audience || "geral"}
Nicho: ${niche}
Mood das cores: ${colors.mood}

Retorne um JSON com:
- headline: titulo chamativo da pagina (max 60 caracteres, persuasivo)
- subheadline: subtitulo que complementa e gera curiosidade (max 120 caracteres)
- ctaText: texto do botao de call to action em portugues (max 25 caracteres)`,

    `Voce e um copywriter especializado em presell e paginas de captura para afiliados. O objetivo e maximizar a taxa de clique no botao CTA. Use gatilhos de curiosidade, prova social e urgencia. Idioma: portugues do Brasil.`
  );

  return NextResponse.json({
    slug,
    title: productName,
    headline: aiResult?.headline || generateHeadline(productName, colors.mood),
    subheadline: aiResult?.subheadline || generateSubheadline(productName),
    ctaText: aiResult?.ctaText || "Saiba Mais",
    bgColor: colors.bg,
    accentColor: colors.accent,
    textColor: colors.text,
    niche,
    mood: colors.mood,
    affiliateLink: affiliateLink || "",
  });
}
