import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMetaConfig, createMetaCampaign } from "@/lib/meta-api";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getMetaConfig(session.user.id);
  if (!config) {
    return NextResponse.json({ error: "Meta API nao configurada" }, { status: 400 });
  }

  const body = await req.json();
  const { campaignId, pageId, startTime, endTime } = body;

  if (!campaignId) {
    return NextResponse.json({ error: "campaignId obrigatorio" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, userId: session.user.id },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campanha nao encontrada" }, { status: 404 });
  }

  if (campaign.metaCampaignId) {
    return NextResponse.json({ error: "Campanha ja publicada no Meta", metaCampaignId: campaign.metaCampaignId }, { status: 400 });
  }

  if (!pageId) {
    return NextResponse.json({ error: "pageId obrigatorio - selecione uma Facebook Page" }, { status: 400 });
  }

  try {
    const adCopy = JSON.parse(campaign.adCopy || "{}");
    const interests = JSON.parse(campaign.interests || "[]");
    const placements = JSON.parse(campaign.placements || "[]");
    const targetCities = campaign.targetCities ? JSON.parse(campaign.targetCities) : [];
    const targetRegions = campaign.targetRegions ? JSON.parse(campaign.targetRegions) : [];

    const result = await createMetaCampaign({
      accessToken: config.accessToken,
      accountId: config.accountId,
      pageId,
      campaignName: campaign.productName,
      dailyBudget: campaign.budgetDaily || 20,
      country: campaign.countryCode || "BR",
      cities: targetCities,
      regions: targetRegions,
      interests,
      placements,
      adCopy: {
        headline: adCopy.headline || campaign.productName,
        primaryText: adCopy.primaryText || adCopy.headline || "",
        description: adCopy.description || "",
        cta: campaign.affiliateLink || campaign.affLink || "",
      },
      creativeUrl: campaign.creativeUrl || undefined,
      funnelStage: campaign.funnelStage || "topo",
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      status: startTime ? "SCHEDULED" : "PAUSED",
    });

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { metaCampaignId: result.id, status: startTime ? "SCHEDULED" : "ACTIVE" },
    });

    return NextResponse.json({ success: true, metaCampaignId: result.id, name: result.name, status: result.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao criar campanha no Meta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
