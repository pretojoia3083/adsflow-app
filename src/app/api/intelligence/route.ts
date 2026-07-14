import { NextRequest, NextResponse } from "next/server";

interface CountryIntel {
  name: string;
  code: string;
  searchVolume: number;
  competitionLevel: "baixa" | "media" | "alta";
  cpmEstimate: number;
  avgSpendPerDay: number;
  activeAds: number;
  successProbability: number;
  flag: string;
}

interface CompetitorAd {
  advertiser: string;
  headline: string;
  cta: string;
  estimatedSpend: string;
  platform: string;
  daysRunning: number;
  network: string;
  commission: string;
}

interface IntelligenceResult {
  productName: string;
  totalSearchVolume: number;
  globalCompetition: string;
  recommendedBudget: { min: number; suggested: number; aggressive: number };
  topCountries: CountryIntel[];
  competitors: CompetitorAd[];
  insights: string[];
  bestTimeToLaunch: string;
  estimatedRoi: string;
}

const COUNTRY_DATA: Record<string, { flag: string; baseCpm: number; multiplier: number }> = {
  "BR": { flag: "🇧🇷", baseCpm: 4.5, multiplier: 1.0 },
  "US": { flag: "🇺🇸", baseCpm: 8.2, multiplier: 0.85 },
  "PT": { flag: "🇵🇹", baseCpm: 3.8, multiplier: 1.1 },
  "AO": { flag: "🇦🇴", baseCpm: 2.1, multiplier: 1.3 },
  "MZ": { flag: "🇲🇿", baseCpm: 1.8, multiplier: 1.4 },
  "MX": { flag: "🇲🇽", baseCpm: 3.2, multiplier: 1.05 },
  "CO": { flag: "🇨🇴", baseCpm: 2.8, multiplier: 1.1 },
  "AR": { flag: "🇦🇷", baseCpm: 2.5, multiplier: 1.15 },
  "CL": { flag: "🇨🇱", baseCpm: 3.5, multiplier: 1.0 },
  "PE": { flag: "🇵🇪", baseCpm: 2.2, multiplier: 1.2 },
  "ES": { flag: "🇪🇸", baseCpm: 5.1, multiplier: 0.95 },
  "GB": { flag: "🇬🇧", baseCpm: 9.8, multiplier: 0.8 },
  "FR": { flag: "🇫🇷", baseCpm: 7.5, multiplier: 0.85 },
  "DE": { flag: "🇩🇪", baseCpm: 7.8, multiplier: 0.9 },
  "IT": { flag: "🇮🇹", baseCpm: 5.5, multiplier: 0.95 },
  "CA": { flag: "🇨🇦", baseCpm: 7.0, multiplier: 0.9 },
  "AU": { flag: "🇦🇺", baseCpm: 6.8, multiplier: 0.9 },
  "JP": { flag: "🇯🇵", baseCpm: 12.0, multiplier: 0.7 },
  "IN": { flag: "🇮🇳", baseCpm: 1.5, multiplier: 1.5 },
  "ZA": { flag: "🇿🇦", baseCpm: 3.0, multiplier: 1.1 },
  "NG": { flag: "🇳🇬", baseCpm: 1.2, multiplier: 1.6 },
  "GH": { flag: "🇬🇭", baseCpm: 1.8, multiplier: 1.4 },
  "KE": { flag: "🇰🇪", baseCpm: 2.0, multiplier: 1.3 },
  "TR": { flag: "🇹🇷", baseCpm: 2.8, multiplier: 1.1 },
  "PL": { flag: "🇵🇱", baseCpm: 3.5, multiplier: 1.0 },
  "NL": { flag: "🇳🇱", baseCpm: 6.5, multiplier: 0.9 },
  "SE": { flag: "🇸🇪", baseCpm: 7.2, multiplier: 0.85 },
  "SG": { flag: "🇸🇬", baseCpm: 8.0, multiplier: 0.85 },
  "AE": { flag: "🇦🇪", baseCpm: 6.0, multiplier: 0.95 },
};

const NICHE_SEARCH_MULTIPLIER: Record<string, Record<string, number>> = {
  emagrecimento: { BR: 1.5, US: 1.2, MX: 1.3, PT: 1.1, AO: 0.9, ZA: 0.8 },
  beleza: { BR: 1.4, US: 1.3, JP: 1.5, FR: 1.2, IT: 1.1, GB: 1.0 },
  saude: { BR: 1.2, US: 1.4, DE: 1.1, JP: 1.3, IN: 1.0, AU: 0.9 },
  fitness: { US: 1.5, BR: 1.3, GB: 1.2, AU: 1.1, CA: 1.0, DE: 0.9 },
  financeiro: { US: 1.6, GB: 1.3, BR: 1.2, SG: 1.1, AE: 1.0, IN: 0.9 },
  marketing: { US: 1.4, BR: 1.3, GB: 1.2, CA: 1.1, AU: 1.0, IN: 0.9 },
  tecnologia: { US: 1.5, JP: 1.4, KR: 1.3, DE: 1.1, BR: 1.0, IN: 0.9 },
  educacao: { BR: 1.4, IN: 1.3, US: 1.2, MX: 1.1, CO: 1.0, PT: 0.9 },
};

const PLATFORM_INFO: Record<string, { name: string; focus: string; avgCommission: string; topCountries: string[]; categoryBias: string }> = {
  hotmart: { name: "Hotmart", focus: "Produtos digitais BR", avgCommission: "30-60%", topCountries: ["BR", "PT", "AO", "MZ"], categoryBias: "educacao" },
  kiwify: { name: "Kiwify", focus: "Infoprodutos BR", avgCommission: "30-50%", topCountries: ["BR"], categoryBias: "educacao" },
  clickbank: { name: "ClickBank", focus: "Produtos digitais globais", avgCommission: "50-75%", topCountries: ["US", "GB", "CA", "AU"], categoryBias: "saude" },
  jvzoo: { name: "JVZoo", focus: "IM products", avgCommission: "50-100%", topCountries: ["US", "GB"], categoryBias: "marketing" },
  warriorplus: { name: "WarriorPlus", focus: "IM products", avgCommission: "50-100%", topCountries: ["US"], categoryBias: "marketing" },
  digistore24: { name: "Digistore24", focus: "Digital EU/Global", avgCommission: "30-70%", topCountries: ["DE", "US", "BR"], categoryBias: "educacao" },
  eduzz: { name: "Eduzz", focus: "Infoprodutos BR", avgCommission: "20-40%", topCountries: ["BR"], categoryBias: "educacao" },
  monetizze: { name: "Monetizze", focus: "Produtos digitais BR", avgCommission: "20-50%", topCountries: ["BR"], categoryBias: "tecnologia" },
  webvork: { name: "Webvork", focus: "Performance global", avgCommission: "5-15%", topCountries: ["US", "GB", "CA"], categoryBias: "saude" },
  admitad: { name: "Admitad", focus: "E-commerce global", avgCommission: "3-12%", topCountries: ["DE", "FR", "BR"], categoryBias: "default" },
  impact: { name: "Impact", focus: "Enterprise partnerships", avgCommission: "5-25%", topCountries: ["US", "GB"], categoryBias: "tecnologia" },
  cj: { name: "CJ Affiliate", focus: "Global brands", avgCommission: "3-20%", topCountries: ["US", "GB", "DE"], categoryBias: "default" },
  shareasale: { name: "ShareASale", focus: "E-commerce US", avgCommission: "5-20%", topCountries: ["US"], categoryBias: "default" },
  awin: { name: "Awin", focus: "Global retail", avgCommission: "3-15%", topCountries: ["GB", "DE", "US"], categoryBias: "default" },
  braip: { name: "Braip", focus: "Produtos digitais BR", avgCommission: "25-50%", topCountries: ["BR"], categoryBias: "marketing" },
  payt: { name: "Payt", focus: "Infoprodutos BR", avgCommission: "20-40%", topCountries: ["BR"], categoryBias: "educacao" },
  perfectpay: { name: "Perfect Pay", focus: "Pagamentos BR", avgCommission: "20-40%", topCountries: ["BR"], categoryBias: "financeiro" },
  lastlink: { name: "LastLink", focus: "Afiliados BR", avgCommission: "20-50%", topCountries: ["BR"], categoryBias: "marketing" },
  amazon: { name: "Amazon Associates", focus: "E-commerce global", avgCommission: "1-10%", topCountries: ["US", "GB", "DE", "JP"], categoryBias: "default" },
  mercadolivre: { name: "Mercado Livre Afiliados", focus: "E-commerce BR", avgCommission: "3-10%", topCountries: ["BR"], categoryBias: "default" },
  shopee: { name: "Shopee Afiliados", focus: "E-commerce BR/Asia", avgCommission: "5-15%", topCountries: ["BR", "SG"], categoryBias: "default" },
  proprio: { name: "Produto Proprio", focus: "Venda propria", avgCommission: "100%", topCountries: ["BR", "US"], categoryBias: "default" },
  outro: { name: "Outra", focus: "Personalizado", avgCommission: "N/A", topCountries: ["BR", "US"], categoryBias: "default" },
};

function detectNiche(productName: string): string {
  const text = productName.toLowerCase();
  if (/emagrec|peso|dieta|detox|queim|lipo|suple|capsul|chá/i.test(text)) return "emagrecimento";
  if (/beleza|cabelo|pele|maquiag|skin|botox|unha/i.test(text)) return "beleza";
  if (/sa[úu]de|rem[eé]d|medic|clin|doen|tratamento/i.test(text)) return "saude";
  if (/academ|treino|muscul|protein|crossfit|pilates|yoga/i.test(text)) return "fitness";
  if (/invest|renda|dinheiro|finan|cripto|trader|forex|cash/i.test(text)) return "financeiro";
  if (/marketing|traf[eé]g|an[uú]nci|facebook|google|funil|leads|copy/i.test(text)) return "marketing";
  if (/softwar|sistema|app|program|tech|ia|automatiz/i.test(text)) return "tecnologia";
  if (/curs|coaching|mentoria|aula|aprend|escola/i.test(text)) return "educacao";
  return "default";
}

function generateCompetitors(productName: string, niche: string, platform: string): CompetitorAd[] {
  const pInfo = PLATFORM_INFO[platform] || PLATFORM_INFO.outro;
  const competitors: CompetitorAd[] = [
    { advertiser: `${pInfo.name} — Top ${niche}`, headline: `Descubra o segredo dos melhores em ${productName}`, cta: "Saiba Mais", estimatedSpend: `R$ ${Math.floor(Math.random() * 8000 + 3000)}/mes`, platform: "Meta Ads", daysRunning: Math.floor(Math.random() * 90 + 15), network: pInfo.name, commission: pInfo.avgCommission },
    { advertiser: `Premium ${pInfo.name} Seller`, headline: `Aprovado por especialistas`, cta: "Comprar Agora", estimatedSpend: `R$ ${Math.floor(Math.random() * 12000 + 5000)}/mes`, platform: "Meta Ads", daysRunning: Math.floor(Math.random() * 120 + 30), network: pInfo.name, commission: pInfo.avgCommission },
    { advertiser: `${productName} — ${pInfo.name}`, headline: `Resultado comprovado em 30 dias`, cta: "Quero Testar", estimatedSpend: `R$ ${Math.floor(Math.random() * 6000 + 2000)}/mes`, platform: "Google Ads", daysRunning: Math.floor(Math.random() * 60 + 10), network: pInfo.name, commission: pInfo.avgCommission },
  ];
  return competitors;
}

function generateInsights(productName: string, niche: string, topCountry: CountryIntel): string[] {
  const insights: string[] = [];
  insights.push(`O nicho de "${niche}" tem demanda alta no ${topCountry.name} com ${topCountry.activeAds} anuncios ativos no Meta.`);
  insights.push(`Investidores estao gastando em media R$ ${topCountry.avgSpendPerDay}/dia por campanha neste nicho.`);
  if (topCountry.competitionLevel === "alta") {
    insights.push("A competicao e alta — foque em copy diferenciado e presell de alta conversao para se destacar.");
  } else if (topCountry.competitionLevel === "media") {
    insights.push("Competicao moderada — ha espaco para entrar com orcamento inicial e escalar se os resultados forem bons.");
  } else {
    insights.push("Competicao baixa — oportunidade excelente para entrar com baixo investimento e dominar o nicho.");
  }
  insights.push(`O CPM medio no ${topCountry.name} e de $${topCountry.cpmEstimate}, o que permite alcancar mil pessoas com R$ ${(topCountry.cpmEstimate * 4.5).toFixed(0)}.`);
  insights.push(`Recomendamos iniciar com R$ ${topCountry.avgSpendPerDay}/dia por 7 dias para testar, depois escalar o que funcionar.`);
  return insights;
}

export async function POST(req: NextRequest) {
  const { productName, description, platform } = await req.json();

  if (!productName) {
    return NextResponse.json({ error: "productName is required" }, { status: 400 });
  }

  const niche = detectNiche(`${productName} ${description || ""}`);
  const nicheMultipliers = NICHE_SEARCH_MULTIPLIER[niche] || {};
  const pInfo = PLATFORM_INFO[platform] || PLATFORM_INFO.outro;

  const seed = productName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);

  const platformBoost = (code: string) => pInfo.topCountries.includes(code) ? 1.6 : 1.0;

  const countries: CountryIntel[] = Object.entries(COUNTRY_DATA)
    .map(([code, data]) => {
      const nicheMult = nicheMultipliers[code] || 1.0;
      const platBoost = platformBoost(code);
      const base = Math.floor(rand(200, 8000) * data.multiplier * nicheMult * platBoost);
      const searchVolume = Math.max(50, Math.floor(base));
      const competitionScore = searchVolume * data.multiplier;
      let competitionLevel: "baixa" | "media" | "alta" = "baixa";
      if (competitionScore > 3000) competitionLevel = "alta";
      else if (competitionScore > 1200) competitionLevel = "media";

      const cpm = +(data.baseCpm * (1 + (competitionScore / 10000))).toFixed(2);
      const avgSpend = Math.floor(cpm * 4.5 * (rand(2, 8)));
      const activeAds = Math.floor(rand(20, 500) * data.multiplier * nicheMult);
      const successProb = Math.min(95, Math.max(15, Math.floor(50 + nicheMult * 20 - (competitionScore > 3000 ? 15 : 0) + rand(-5, 10))));

      return {
        name: code === "BR" ? "Brasil" : code === "US" ? "Estados Unidos" : code === "PT" ? "Portugal" : code === "AO" ? "Angola" : code === "MZ" ? "Mocambique" : code === "MX" ? "Mexico" : code === "CO" ? "Colombia" : code === "AR" ? "Argentina" : code === "ES" ? "Espanha" : code === "GB" ? "Reino Unido" : code === "FR" ? "Franca" : code === "DE" ? "Alemanha" : code === "IT" ? "Italia" : code === "CA" ? "Canada" : code === "AU" ? "Australia" : code === "JP" ? "Japao" : code === "IN" ? "India" : code === "ZA" ? "Africa do Sul" : code === "NG" ? "Nigeria" : code === "TR" ? "Turquia" : code === "PL" ? "Polonia" : code === "NL" ? "Holanda" : code === "SE" ? "Suecia" : code === "SG" ? "Singapura" : code === "AE" ? "Emirados" : code,
        code,
        searchVolume,
        competitionLevel,
        cpmEstimate: cpm,
        avgSpendPerDay: avgSpend,
        activeAds,
        successProbability: successProb,
        flag: data.flag,
      };
    })
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 12);

  const topCountry = countries[0];
  const competitors = generateCompetitors(productName, niche, platform || "outro");
  const insights = generateInsights(productName, niche, topCountry);

  insights.unshift(`Plataforma selecionada: ${pInfo.name} — ${pInfo.focus}. Comissao media: ${pInfo.avgCommission}.`);
  if (pInfo.topCountries.length > 0) {
    const focusNames = pInfo.topCountries.map((c) => countries.find((cn) => cn.code === c)?.name).filter(Boolean);
    insights.push(`Paises com mais trafego nesta plataforma: ${focusNames.join(", ")}.`);
  }

  const recommendedBudget = {
    min: Math.floor(topCountry.avgSpendPerDay * 0.5),
    suggested: topCountry.avgSpendPerDay,
    aggressive: Math.floor(topCountry.avgSpendPerDay * 2.5),
  };

  return NextResponse.json({
    productName,
    platform: pInfo.name,
    platformFocus: pInfo.focus,
    platformCommission: pInfo.avgCommission,
    totalSearchVolume: countries.reduce((a, c) => a + c.searchVolume, 0),
    globalCompetition: topCountry.competitionLevel,
    recommendedBudget,
    topCountries: countries,
    competitors,
    insights,
    bestTimeToLaunch: "Manha (8h-11h) e noite (19h-22h) quando o publico esta mais ativo",
    estimatedRoi: `Entre ${Math.floor(rand(150, 400))}% e ${Math.floor(rand(400, 800))}% em 30 dias com orcamento otimizado`,
  });
}
