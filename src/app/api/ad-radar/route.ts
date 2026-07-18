import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function generateMockAds(query: string, country: string, minDays: number, maxDays: number) {
  const templates = [
    { pageName: "Resultados Digitais", title: `${query} - Metodo Comprovado`, body: `Voce quer ${query}? Nosso metodo ja ajudou mais de 10.000 pessoas a alcancar resultados reais. Sem promessas falsas, so ciencia. Clique e descubra como comecar hoje mesmo.`, description: "Garanta sua vaga com desconto especial", platforms: ["Facebook", "Instagram"] },
    { pageName: "Academia Online Pro", title: `${query} em 30 dias - Garantido`, body: `Transforme seu corpo com nosso programa de ${query}. Treinos personalizados, suporte 24h e garantia de 30 dias. Comece agora e veja resultados na primeira semana.`, description: "Primeira semana gratis", platforms: ["Instagram", "Facebook"] },
    { pageName: "LifeStyle Premium", title: `O segredo de quem ja conquistou ${query}`, body: `Descubra o que 1% dos mais bem-sucedidos fazem diferente. Metodo exclusivo revelado por especialistas com mais de 15 anos de experiencia em ${query}. Vagas limitadas.`, description: "Acesso imediato", platforms: ["Facebook", "Instagram", "Messenger"] },
    { pageName: "Mentoria Digital", title: `${query} - Aula Gratis`, body: `Nossa aula gratuita sobre ${query} ja foi assistida por 50.000+ pessoas. Aprenda as estrategias que funcionam de verdade. Assista agora antes que remova.`, description: "Aula gratuita por tempo limitado", platforms: ["Instagram"] },
    { pageName: "Startup Hub BR", title: `Como multiplicar seus resultados em ${query}`, body: `Se voce esta buscando ${query}, conheca nosso sistema que ja gerou mais de R$ 2M em resultados para nossos alunos. Metodos testados e aprovados.`, description: "Depoimentos reais no site", platforms: ["Facebook", "Instagram", "Audience Network"] },
    { pageName: "Health Plus", title: `${query} - Oferta Especial`, body: `Por tempo limitado, oferecemos nossa consultoria premium para quem quer resultados rapidos em ${query}. Equipe com 20+ especialistas prontos pra te ajudar. Garantia total.`, description: "Vagas limitadas", platforms: ["Facebook", "Messenger"] },
  ];

  const now = Date.now();
  const msPerDay = 86400000;
  const count = Math.min(templates.length, Math.floor(Math.random() * 4) + 3);

  return templates.slice(0, count).map((t, i) => {
    const daysAgo = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    return {
      id: `mock_${i}_${Date.now()}`,
      pageName: t.pageName,
      body: t.body,
      title: t.title,
      description: t.description,
      snapshotUrl: "",
      landingUrl: "",
      isMock: true,
      startTime: new Date(now - daysAgo * msPerDay).toISOString(),
      platforms: t.platforms,
      mediaType: i % 3 === 0 ? "video" : "image",
      mediaUrl: undefined,
    };
  });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const country = searchParams.get("country") || "BR";
  const minDays = Number(searchParams.get("minDays")) || 7;
  const maxDays = Number(searchParams.get("maxDays")) || 90;

  if (!q) {
    return NextResponse.json({ ads: [], facebookAdLibraryUrl: "" });
  }

  const facebookCountry = country === "ALL" ? "" : country;
  const facebookAdLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${facebookCountry}&q=${encodeURIComponent(q)}`;

  if (country === "TOP3") {
    const topCountries = getTop3Countries(q);
    const allAds: any[] = [];
    for (const c of topCountries) {
      const ads = generateMockAds(q, c.code, minDays, maxDays).map((ad) => ({
        ...ad,
        country: c.name,
        countryFlag: c.flag,
      }));
      allAds.push(...ads);
    }
    return NextResponse.json({
      ads: allAds,
      topCountries: topCountries.map((c) => ({ code: c.code, name: c.name, flag: c.flag })),
      facebookAdLibraryUrl: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&q=${encodeURIComponent(q)}`,
      note: "Exemplos de copy para referencia — veja anuncios reais no Facebook",
    });
  }

  const ads = generateMockAds(q, country, minDays, maxDays);
  return NextResponse.json({
    ads,
    facebookAdLibraryUrl,
    note: "Exemplos de copy para referencia — veja anuncios reais no Facebook",
  });
}

function getTop3Countries(query: string) {
  const nicheKeywords: Record<string, string[]> = {
    emagrecimento: ["BR", "US", "MX"],
    beleza: ["BR", "US", "CO"],
    fitness: ["BR", "US", "GB"],
    saude: ["BR", "US", "PT"],
    financeiro: ["US", "BR", "GB"],
    marketing: ["US", "BR", "GB"],
    tecnologia: ["US", "JP", "DE"],
    educacao: ["BR", "US", "PT"],
    skincare: ["US", "KR", "BR"],
    suplemento: ["BR", "US", "MX"],
    curso: ["BR", "US", "PT"],
    keto: ["US", "BR", "AU"],
    dieta: ["BR", "US", "GB"],
    musculacao: ["BR", "US", "DE"],
    investimento: ["US", "BR", "GB"],
    criptomoeda: ["US", "BR", "NG"],
    dropshipping: ["US", "BR", "GB"],
    affliate: ["US", "BR", "GB"],
    renda: ["BR", "US", "PT"],
    negocio: ["US", "BR", "GB"],
  };

  const q = query.toLowerCase();
  for (const [key, codes] of Object.entries(nicheKeywords)) {
    if (q.includes(key)) {
      return codes.map((code) => {
        const c = COUNTRIES_MAP[code];
        return c || { code, name: code, flag: "🏳️" };
      });
    }
  }

  return [
    COUNTRIES_MAP["BR"]!,
    COUNTRIES_MAP["US"]!,
    COUNTRIES_MAP["GB"]!,
  ];
}

const COUNTRIES_MAP: Record<string, { code: string; name: string; flag: string }> = {
  BR: { code: "BR", name: "Brasil", flag: "🇧🇷" },
  US: { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  GB: { code: "GB", name: "Reino Unido", flag: "🇬🇧" },
  MX: { code: "MX", name: "Mexico", flag: "🇲🇽" },
  PT: { code: "PT", name: "Portugal", flag: "🇵🇹" },
  JP: { code: "JP", name: "Japao", flag: "🇯🇵" },
  DE: { code: "DE", name: "Alemanha", flag: "🇩🇪" },
  CO: { code: "CO", name: "Colombia", flag: "🇨🇴" },
  AU: { code: "AU", name: "Australia", flag: "🇦🇺" },
  NG: { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  KR: { code: "KR", name: "Coreia do Sul", flag: "🇰🇷" },
  FR: { code: "FR", name: "Franca", flag: "🇫🇷" },
  ES: { code: "ES", name: "Espanha", flag: "🇪🇸" },
  AR: { code: "AR", name: "Argentina", flag: "🇦🇷" },
  CA: { code: "CA", name: "Canada", flag: "🇨🇦" },
};
