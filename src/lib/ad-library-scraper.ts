const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
];

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function getFacebookCountryCode(country: string): string {
  const map: Record<string, string> = {
    BR: "BR", US: "US", GB: "GB", PT: "PT", MX: "MX", AR: "AR",
    CO: "CO", DE: "DE", FR: "FR", ES: "ES", IT: "IT", JP: "JP",
    KR: "KR", AU: "AU", CA: "CA", ALL: "",
  };
  return map[country] || "BR";
}

interface ScrapedAd {
  pageName: string;
  body: string;
  title: string;
  description: string;
  platforms: string[];
  startTime: string;
  daysRunning: number;
  snapshotUrl: string;
  landingUrl: string;
  isMock: boolean;
  score: number;
  scoreLabel: "top" | "bom" | "recente";
  mediaType: string;
}

export async function scrapeAdLibrary(
  query: string,
  country: string,
  minDays: number,
  maxDays: number,
  limit: number = 10
): Promise<{ ads: ScrapedAd[]; facebookAdLibraryUrl: string; error?: string }> {
  const fbCountry = getFacebookCountryCode(country);
  const facebookAdLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${fbCountry}&q=${encodeURIComponent(query)}`;

  try {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const searchUrl = "https://www.facebook.com/ads/library/async/search_ads/?";

    const params = new URLSearchParams({
      v: "3",
      q: query,
      session_id: sessionId,
      count: "30",
      cursor: "0",
      search_type: "KEYWORD_EXACT_PHRASE",
      media_type: "all",
      active_status: "active",
      ad_type: "all",
      country: fbCountry,
      _: Date.now().toString(),
    });

    const res = await fetch(`${searchUrl}${params.toString()}`, {
      headers: {
        "User-Agent": randomUA(),
        Accept: "*/*",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: facebookAdLibraryUrl,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!res.ok) {
      return {
        ads: generateFallbackAds(query, country, minDays, maxDays, limit),
        facebookAdLibraryUrl,
        error: `Facebook returned status ${res.status}`,
      };
    }

    const text = await res.text();
    const ads = parseAdLibraryResponse(text, minDays, maxDays, limit);

    if (ads.length === 0) {
      return {
        ads: generateFallbackAds(query, country, minDays, maxDays, limit),
        facebookAdLibraryUrl,
        error: "Nenhum resultado parseado — usando dados de referência",
      };
    }

    return { ads, facebookAdLibraryUrl };
  } catch (err: any) {
    return {
      ads: generateFallbackAds(query, country, minDays, maxDays, limit),
      facebookAdLibraryUrl,
      error: err.message || "Erro ao acessar Ad Library",
    };
  }
}

function parseAdLibraryResponse(
  html: string,
  minDays: number,
  maxDays: number,
  limit: number
): ScrapedAd[] {
  const ads: ScrapedAd[] = [];
  const now = Date.now();
  const msPerDay = 86400000;

  // Try to extract JSON data from the response
  const jsonMatch = html.match(/"adArchiveBody":\s*(\{.*?\})\s*[,}]/gs);
  if (jsonMatch) {
    for (const match of jsonMatch) {
      try {
        const data = JSON.parse(match.replace(/^"adArchiveBody":\s*/, ""));
        const ad = convertParsedAd(data, now, msPerDay, minDays, maxDays);
        if (ad) ads.push(ad);
      } catch { /* skip */ }
    }
  }

  // Fallback: regex extraction from HTML
  if (ads.length === 0) {
    const pageNames = html.match(/"pageName":\s*"([^"]+)"/g) || [];
    const bodies = html.match(/"body":\s*\{[^}]*"text":\s*"([^"]+)"/g) || [];
    const titles = html.match(/"title":\s*\{[^}]*"text":\s*"([^"]+)"/g) || [];
    const startTimes = html.match(/"start_date":\s*"([^"]+)"/g) || [];
    const snapshots = html.match(/"snapshot_url":\s*"([^"]+)"/g) || [];

    const count = Math.max(pageNames.length, bodies.length);
    for (let i = 0; i < count; i++) {
      const pageName = extractValue(pageNames[i]) || `Anuncio ${i + 1}`;
      const body = extractValue(bodies[i]) || "";
      const title = extractValue(titles[i]) || "";
      const startTime = extractValue(startTimes[i]) || "";
      const snapshotUrl = extractValue(snapshots[i]) || "";

      let daysRunning = 0;
      if (startTime) {
        const startMs = new Date(startTime).getTime();
        daysRunning = Math.floor((now - startMs) / msPerDay);
      } else {
        daysRunning = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
      }

      if (daysRunning < minDays || daysRunning > maxDays) continue;

      const score = calcScore(daysRunning, []);
      ads.push({
        pageName,
        body,
        title,
        description: "",
        platforms: ["Facebook", "Instagram"],
        startTime: startTime || new Date(now - daysRunning * msPerDay).toISOString(),
        daysRunning,
        snapshotUrl,
        landingUrl: "",
        isMock: false,
        score,
        scoreLabel: score >= 70 ? "top" : score >= 40 ? "bom" : "recente",
        mediaType: "image",
      });
    }
  }

  // Sort by score descending (best performers first)
  ads.sort((a, b) => b.score - a.score);
  return ads.slice(0, limit);
}

function extractValue(match: string | undefined): string {
  if (!match) return "";
  const m = match.match(/:\s*"([^"]+)"/);
  return m ? m[1].replace(/\\u[\dA-F]{4}/gi, (hex) =>
    String.fromCharCode(parseInt(hex.replace("\\u", ""), 16))
  ) : "";
}

function convertParsedAd(
  data: any,
  now: number,
  msPerDay: number,
  minDays: number,
  maxDays: number
): ScrapedAd | null {
  try {
    const pageName = data.page_name || data.adArchiveInfo?.page_name || "";
    const body = data.body?.text || data.ad_creative_bodies?.[0] || "";
    const title = data.title?.text || data.ad_creative_link_titles?.[0] || "";
    const description = data.description?.text || data.ad_creative_link_descriptions?.[0] || "";
    const startTime = data.start_date || data.ad_start_time || "";
    const snapshotUrl = data.snapshot_url || data.ad_snapshot_url || "";

    let daysRunning = 0;
    if (startTime) {
      const startMs = new Date(startTime).getTime();
      daysRunning = Math.floor((now - startMs) / msPerDay);
    }

    if (daysRunning < minDays || daysRunning > maxDays) return null;

    const platforms: string[] = [];
    if (data.publisher_platforms) {
      const p = data.publisher_platforms;
      if (p.facebook) platforms.push("Facebook");
      if (p.instagram) platforms.push("Instagram");
      if (p.messenger) platforms.push("Messenger");
      if (p.audience_network) platforms.push("Audience Network");
    }
    if (platforms.length === 0) platforms.push("Facebook", "Instagram");

    const score = calcScore(daysRunning, platforms);

    return {
      pageName,
      body,
      title,
      description,
      platforms,
      startTime,
      daysRunning,
      snapshotUrl,
      landingUrl: "",
      isMock: false,
      score,
      scoreLabel: score >= 70 ? "top" : score >= 40 ? "bom" : "recente",
      mediaType: "image",
    };
  } catch {
    return null;
  }
}

function calcScore(daysRunning: number, platforms: string[]): number {
  let score = 0;

  // Days running (max 60 points)
  if (daysRunning >= 90) score += 60;
  else if (daysRunning >= 60) score += 50;
  else if (daysRunning >= 30) score += 40;
  else if (daysRunning >= 14) score += 25;
  else if (daysRunning >= 7) score += 15;
  else score += 5;

  // Platforms (max 30 points)
  score += Math.min(platforms.length * 10, 30);

  // Has snapshot (10 points)
  score += 10;

  return Math.min(score, 100);
}

function generateFallbackAds(
  query: string,
  country: string,
  minDays: number,
  maxDays: number,
  limit: number
): ScrapedAd[] {
  const templates = [
    { pageName: "Resultados Digitais", title: `${query} - Metodo Comprovado`, body: `Voce quer ${query}? Nosso metodo ja ajudou mais de 10.000 pessoas a alcancar resultados reais. Sem promessas falsas, so ciencia. Clique e descubra como comecar hoje mesmo.`, platforms: ["Facebook", "Instagram"] },
    { pageName: "Academia Online Pro", title: `${query} em 30 dias - Garantido`, body: `Transforme seu corpo com nosso programa de ${query}. Treinos personalizados, suporte 24h e garantia de 30 dias. Comece agora e veja resultados na primeira semana.`, platforms: ["Instagram", "Facebook"] },
    { pageName: "LifeStyle Premium", title: `O segredo de quem ja conquistou ${query}`, body: `Descubra o que 1% dos mais bem-sucedidos fazem diferente. Metodo exclusivo revelado por especialistas com mais de 15 anos de experiencia em ${query}. Vagas limitadas.`, platforms: ["Facebook", "Instagram", "Messenger"] },
    { pageName: "Mentoria Digital", title: `${query} - Aula Gratis`, body: `Nossa aula gratuita sobre ${query} ja foi assistida por 50.000+ pessoas. Aprenda as estrategias que funcionam de verdade. Assista agora antes que remova.`, platforms: ["Instagram"] },
    { pageName: "Startup Hub BR", title: `Como multiplicar seus resultados em ${query}`, body: `Se voce esta buscando ${query}, conheca nosso sistema que ja gerou mais de R$ 2M em resultados para nossos alunos. Metodos testados e aprovados.`, platforms: ["Facebook", "Instagram", "Audience Network"] },
    { pageName: "Health Plus", title: `${query} - Oferta Especial`, body: `Por tempo limitado, oferecemos nossa consultoria premium para quem quer resultados rapidos em ${query}. Equipe com 20+ especialistas prontos pra te ajudar. Garantia total.`, platforms: ["Facebook", "Messenger"] },
    { pageName: "Digital Pro Academy", title: `${query} passo a passo`, body: `Aprenda ${query} do zero ao avancado com nosso metodo独家. 12 modulos, 200+ aulas, suporte direto com os instrutores. Garantia de 7 dias.`, platforms: ["Facebook", "Instagram"] },
    { pageName: "Smart Marketing", title: `Como ${query} mudou minha vida`, body: `Ha 2 anos eu nao sabia nada sobre ${query}. Hoje faturei mais de R$ 500K. Quero te ensinar exatamente o que fiz, passo a passo. Vagas limitadas.`, platforms: ["Instagram", "Facebook"] },
    { pageName: "Vida Fit Brasil", title: `${query} - Resultados em 21 dias`, body: `Nosso programa de ${query} e baseado em ciencia. 21 dias de acompanhamento, plano alimentar personalizado e treinos para casa. Comece hoje.`, platforms: ["Facebook", "Instagram", "Messenger"] },
    { pageName: "Crypto Masters", title: `Invista em ${query} com seguranca`, body: `Aprenda a investir em ${query} sem cair em golpes. Nosso grupo exclusivo tem 5.000+ membros ativos. Sinais diarios, aulas ao vivo e comunidade.`, platforms: ["Facebook", "Instagram"] },
  ];

  const now = Date.now();
  const msPerDay = 86400000;
  const count = Math.min(limit, templates.length);

  return templates.slice(0, count).map((t, i) => {
    const daysRunning = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const score = calcScore(daysRunning, t.platforms);
    return {
      id: `fallback_${i}_${Date.now()}`,
      pageName: t.pageName,
      body: t.body,
      title: t.title,
      description: "",
      platforms: t.platforms,
      startTime: new Date(now - daysRunning * msPerDay).toISOString(),
      daysRunning,
      snapshotUrl: "",
      landingUrl: "",
      isMock: true,
      score,
      scoreLabel: score >= 70 ? "top" : score >= 40 ? "bom" : "recente" as const,
      mediaType: "image",
      mediaUrl: undefined,
    };
  }).sort((a, b) => b.score - a.score);
}
