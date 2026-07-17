import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingSearches, matchProductsToTrend } from "@/lib/google-trends";
import { getAllProducts } from "@/lib/clickbank";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "US";

  try {
    const trends = await fetchTrendingSearches(country);
    const products = getAllProducts();

    const enriched = trends.map((trend) => {
      const matchedProducts = matchProductsToTrend(trend.title, products);
      const nicheWords = trend.title.toLowerCase();
      let niche = "geral";
      if (/\b(weight|diet|health|supplement|keto|detox|gut|sugar|blood|pain|skin|hair|aging|testosterone|diabetes|cholesterol|immunity|sleep|anxiety|tinnitus|vision|dental|oral|probiotic)\b/i.test(nicheWords)) niche = "saude";
      else if (/\b(crypto|bitcoin|trading|forex|invest|money|income|wealth|stock|finance|budget|debt|retire|passive)\b/i.test(nicheWords)) niche = "financeiro";
      else if (/\b(workout|exercise|muscle|gym|yoga|fitness|cardio|body|lean|home fitness)\b/i.test(nicheWords)) niche = "fitness";
      else if (/\b(learn|course|class|skill|language|teach|study|training)\b/i.test(nicheWords)) niche = "educacao";
      else if (/\b(tech|ai|software|app|gadget|phone|coding|cyber|robot|bot)\b/i.test(nicheWords)) niche = "tecnologia";

      return {
        ...trend,
        suggestedProducts: matchedProducts,
        niche,
      };
    });

    return NextResponse.json({
      country,
      trends: enriched,
      count: enriched.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar trends", country, trends: [], count: 0 },
      { status: 500 }
    );
  }
}
