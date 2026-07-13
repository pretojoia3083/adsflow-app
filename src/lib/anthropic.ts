export interface MarketCountry {
  country: string;
  countryCode: string;
  flag: string;
  demandScore: number;
  competitionLevel: "baixa" | "media" | "alta";
  suggestedLanguage: string;
  estimatedCpm: string;
  reasoning: string;
}

export interface MarketAnalysis {
  countries: MarketCountry[];
  summary: string;
}

export interface AdVariation {
  label: string;
  headline: string;
  body: string;
  cta: string;
  imageStyle: string;
  colors: {
    background: string;
    accent: string;
    text: string;
  };
}

export interface CampaignData {
  keywords: string[];
  interests: string[];
  placements: string[];
}

async function callClaude({
  system,
  user,
  useSearch = false,
}: {
  system: string;
  user: string;
  useSearch?: boolean;
}) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: user }],
      ...(useSearch
        ? { tools: [{ type: "web_search_20250305", name: "web_search" }] }
        : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  const fullText = (data.content || [])
    .map((b: { type: string; text?: string }) =>
      b.type === "text" ? b.text : ""
    )
    .filter(Boolean)
    .join("\n");

  const cleaned = fullText.replace(/```json|```/g, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

  return JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
}

export async function analyzeMarkets(params: {
  product: string;
  description?: string;
  audience?: string;
  budget: string;
  funnelStage: string;
}): Promise<MarketAnalysis> {
  const system = `Você é um analista de mercado de performance marketing especializado em Meta Ads (Facebook/Instagram).
Dado um produto, retorne os 6 melhores países-alvo para uma campanha, considerando demanda real, poder de compra, CPM/CPC estimado, concorrência no nicho e facilidade de operação (idioma).
Use web search para embasar tendências atuais quando fizer sentido.
Responda SOMENTE em JSON válido, sem markdown, neste formato exato:
{
  "countries": [
    {
      "country": "nome em português",
      "countryCode": "ISO 2 letras maiúsculas",
      "flag": "emoji da bandeira",
      "demandScore": 0-100,
      "competitionLevel": "baixa" | "média" | "alta",
      "suggestedLanguage": "idioma do anúncio",
      "estimatedCpm": "faixa em USD ex: '$3-6'",
      "reasoning": "2-3 frases específicas pro produto"
    }
  ],
  "summary": "1-2 frases de estratégia geral"
}`;

  const user = `Produto: ${params.product}
Descrição: ${params.description || "não informado"}
Público-alvo: ${params.audience || "não informado"}
Orçamento de mídia: ${params.budget}
Estágio de funil: ${params.funnelStage}`;

  return callClaude({ system, user, useSearch: true });
}

export async function generateAdCopy(params: {
  product: string;
  description?: string;
  audience?: string;
  tone: string;
  country: string;
  countryCode: string;
  language: string;
  template: string;
  funnelStage: string;
}): Promise<{ variations: AdVariation[] }> {
  const system = `Você é um copywriter especialista em anúncios de performance para Meta Ads (Facebook/Instagram).
Gere 3 variações de anúncio culturalmente adaptadas para o país e idioma informados, alinhadas ao formato de presell escolhido. Cada variação deve ter uma paleta de cores própria que combine com o produto e a cultura local.
Responda SOMENTE em JSON válido, sem markdown, neste formato exato:
{
  "variations": [
    {
      "label": "nome curto da variação",
      "headline": "título curto e forte, no idioma alvo",
      "body": "texto do anúncio, 2-3 frases, no idioma alvo",
      "cta": "texto do botão, no idioma alvo",
      "imageStyle": "descrição curta do estilo visual sugerido",
      "colors": { "background": "#hex", "accent": "#hex", "text": "#hex" }
    }
  ]
}`;

  const user = `Produto: ${params.product}
Descrição: ${params.description || "não informado"}
Público-alvo: ${params.audience || "não informado"}
Tom desejado: ${params.tone}
País: ${params.country} (${params.countryCode})
Idioma: ${params.language}
Formato de presell: ${params.template}
Estágio de funil: ${params.funnelStage}`;

  return callClaude({ system, user, useSearch: false });
}

export async function generateCampaignData(params: {
  product: string;
  description?: string;
  audience?: string;
  country: string;
  language: string;
  funnelStage: string;
  networkName: string;
}): Promise<CampaignData> {
  const system = `Você é um especialista em mídia paga para Meta Ads.
Gere sugestões de segmentação para uma campanha, considerando produto, país, funil e idioma.
Responda SOMENTE em JSON válido, sem markdown, neste formato exato:
{
  "keywords": ["até 10 palavras-chave/termos de interesse curtos, no idioma do país alvo"],
  "interests": ["até 6 interesses do Meta Ads Manager relevantes, no idioma do país alvo"],
  "placements": ["até 5 posicionamentos recomendados, ex: Feed Instagram, Reels, Stories, Feed Facebook, Audience Network"]
}`;

  const user = `Produto: ${params.product}
Descrição: ${params.description || "não informado"}
Público-alvo: ${params.audience || "não informado"}
País: ${params.country}
Idioma: ${params.language}
Estágio de funil: ${params.funnelStage}
Rede de afiliados: ${params.networkName}`;

  return callClaude({ system, user, useSearch: false });
}
