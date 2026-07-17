import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMetaConfig, getCampaignMetrics, getCampaignInsights } from "@/lib/meta-api";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getMetaConfig(session.user.id);
  if (!config) {
    return NextResponse.json({ error: "Meta API nao configurada" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  const dateRange = searchParams.get("dateRange") || "7d";

  if (campaignId) {
    const metrics = await getCampaignMetrics(config.accessToken, campaignId, dateRange);
    if (!metrics) {
      return NextResponse.json({ error: "Erro ao buscar metricas" }, { status: 500 });
    }
    return NextResponse.json({ metrics, campaignId });
  }

  const insights = await getCampaignInsights(config.accessToken, config.accountId, dateRange);
  return NextResponse.json({ insights, accountId: config.accountId });
}
