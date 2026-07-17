export interface TrendingTopic {
  title: string;
  traffic: string;
  source: string;
  articles: { title: string; url: string; source: string; timeAgo: string }[];
}

export interface TrendWithProduct {
  trend: TrendingTopic;
  suggestedProducts: { id: string; name: string; match: number; commission: number; gravity: number }[];
  niche: string;
}

const GEO_MAP: Record<string, string> = {
  US: "United States",
  BR: "Brazil",
  UK: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  IN: "India",
  MX: "Mexico",
  IT: "Italy",
  ES: "Spain",
  PT: "Portugal",
  NL: "Netherlands",
};

const NICHE_KEYWORDS: Record<string, string[]> = {
  health: ["weight", "diet", "supplement", "health", "fitness", "keto", "detox", "gut", "sugar", "blood", "pain", "joint", "skin", "hair", "aging", "testosterone", "prostate", "diabetes", "cholesterol", "immunity", "sleep", "anxiety", "tinnitus", "vision", "dental", "oral"],
  finance: ["money", "invest", "crypto", "bitcoin", "trading", "forex", "income", "wealth", "rich", "passive", "stock", "finance", "budget", "debt", "credit", "retire"],
  fitness: ["workout", "exercise", "muscle", "gym", "abs", "yoga", "pilates", "running", "cardio", "strength", "body", "lean", "tone"],
  education: ["learn", "course", "class", "skill", "language", "teach", "study", "training", "certification", "degree"],
  tech: ["ai", "software", "app", "tech", "gadget", "phone", "laptop", "coding", "data", "cyber"],
  home: ["home", "garden", "decor", "clean", "kitchen", "furniture", "diy", "renovate", "organize"],
  entertainment: ["game", "stream", "music", "movie", "fun", "play", "content", "viral", "social"],
};

function matchNiche(title: string): string {
  const lower = title.toLowerCase();
  for (const [niche, keywords] of Object.entries(NICHE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return niche;
  }
  return "general";
}

export function matchProductsToTrend(
  trendTitle: string,
  products: { id: string; name: string; tags: string[]; description: string; commission: number; gravity: number }[]
): { id: string; name: string; match: number; commission: number; gravity: number }[] {
  const words = trendTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const scored = products.map((p) => {
    const searchText = `${p.name} ${p.tags.join(" ")} ${p.description}`.toLowerCase();
    let score = 0;
    for (const word of words) {
      if (searchText.includes(word)) score += 20;
    }
    const niche = matchNiche(trendTitle);
    if (p.tags.includes(niche) || p.description.toLowerCase().includes(niche)) score += 15;
    const nameWords = p.name.toLowerCase().split(/\s+/);
    for (const nw of nameWords) {
      for (const word of words) {
        if (nw.includes(word) || word.includes(nw)) score += 25;
      }
    }
    return { id: p.id, name: p.name, match: Math.min(score, 100), commission: p.commission, gravity: p.gravity };
  });
  return scored.filter((s) => s.match > 0).sort((a, b) => b.match - a.match).slice(0, 3);
}

export async function fetchTrendingSearches(country: string = "US"): Promise<TrendingTopic[]> {
  try {
    const geo = GEO_MAP[country] || "United States";
    const rssUrl = `https://trends.google.com/trending/rss?geo=${country}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
    const res = await fetch(proxyUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return getFallbackTrends(country);
    const text = await res.text();
    const topics: TrendingTopic[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1];
      const title = extractTag(item, "title") || "Unknown";
      const traffic = extractTag(item, "ht:approx_traffic") || "100K+";
      const source = extractTag(item, "ht:news_item_source") || "";
      const articleTitle = extractTag(item, "ht:news_item_title") || "";
      const articleUrl = extractTag(item, "ht:news_item_url") || "";
      const articleTime = extractTag(item, "pubDate") || "";
      topics.push({
        title: title.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
        traffic: traffic.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
        source: source.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
        articles: [{
          title: articleTitle.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
          url: articleUrl.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
          source: source.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
          timeAgo: formatTimeAgo(articleTime),
        }],
      });
    }
    return topics.length > 0 ? topics.slice(0, 15) : getFallbackTrends(country);
  } catch {
    return getFallbackTrends(country);
  }
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1] : null;
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}min atras`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atras`;
    return `${Math.floor(diff / 86400)}d atras`;
  } catch {
    return "";
  }
}

function getFallbackTrends(country: string): TrendingTopic[] {
  const trendsByCountry: Record<string, TrendingTopic[]> = {
    US: [
      { title: "Weight Loss Supplement 2025", traffic: "1M+", source: "Google Trends", articles: [{ title: "New weight loss trend sweeps America", url: "", source: "Health News", timeAgo: "2h atras" }] },
      { title: "AI Trading Bot", traffic: "500K+", source: "Google Trends", articles: [{ title: "AI-powered trading gains popularity", url: "", source: "Tech News", timeAgo: "4h atras" }] },
      { title: "Keto Diet Plan", traffic: "200K+", source: "Google Trends", articles: [{ title: "Keto diet resurgence in 2025", url: "", source: "Health Mag", timeAgo: "6h atras" }] },
      { title: "Crypto Investment", traffic: "800K+", source: "Google Trends", articles: [{ title: "Bitcoin surges past new highs", url: "", source: "Finance", timeAgo: "1h atras" }] },
      { title: "Home Workout No Equipment", traffic: "300K+", source: "Google Trends", articles: [{ title: "At-home fitness trends grow", url: "", source: "Fitness", timeAgo: "3h atras" }] },
      { title: "Diabetes Natural Remedy", traffic: "400K+", source: "Google Trends", articles: [{ title: "Natural blood sugar solutions trending", url: "", source: "Health", timeAgo: "5h atras" }] },
      { title: "Passive Income Ideas", traffic: "600K+", source: "Google Trends", articles: [{ title: "Side hustles booming in 2025", url: "", source: "Business", timeAgo: "2h atras" }] },
      { title: "Gut Health Probiotic", traffic: "250K+", source: "Google Trends", articles: [{ title: "Probiotics market expected to grow", url: "", source: "Health", timeAgo: "7h atras" }] },
    ],
    BR: [
      { title: "Emagrecimento Rapido", traffic: "500K+", source: "Google Trends", articles: [{ title: "Novas dietas para emagrecer", url: "", source: "Saude", timeAgo: "3h atras" }] },
      { title: "Renda Extra Online", traffic: "300K+", source: "Google Trends", articles: [{ title: "Como ganhar dinheiro na internet", url: "", source: "Financas", timeAgo: "2h atras" }] },
      { title: "Criptomoedas Brasil", traffic: "400K+", source: "Google Trends", articles: [{ title: "Investimento em crypto cresce no BR", url: "", source: "Economia", timeAgo: "1h atras" }] },
      { title: "Suplemento Natural", traffic: "200K+", source: "Google Trends", articles: [{ title: "Produtos naturais em alta", url: "", source: "Saude", timeAgo: "5h atras" }] },
      { title: "Treino em Casa", traffic: "150K+", source: "Google Trends", articles: [{ title: "Fitness em casa continua em alta", url: "", source: "Fitness", timeAgo: "4h atras" }] },
    ],
    UK: [
      { title: "Best Weight Loss Programme", traffic: "400K+", source: "Google Trends", articles: [{ title: "UK slimmers flock to new plans", url: "", source: "Health", timeAgo: "2h atras" }] },
      { title: "Crypto Trading UK", traffic: "300K+", source: "Google Trends", articles: [{ title: "British investors eye crypto", url: "", source: "Finance", timeAgo: "3h atras" }] },
      { title: "Home Fitness Revolution", traffic: "250K+", source: "Google Trends", articles: [{ title: "Home gym equipment sales surge", url: "", source: "Fitness", timeAgo: "5h atras" }] },
    ],
  };
  return trendsByCountry[country] || trendsByCountry["US"];
}

export { GEO_MAP, NICHE_KEYWORDS, matchNiche };
