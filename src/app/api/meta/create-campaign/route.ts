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

  let accountId = config.accountId;
  if (!accountId.startsWith("act_")) {
    accountId = `act_${accountId}`;
  }

  const body = await req.json();
  const { campaignId, pageId, startTime, endTime } = body;

  let campaign = null;

  if (campaignId) {
    campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: session.user.id },
    });
  }

  if (!campaign && campaignId) {
    campaign = await prisma.campaign.findFirst({
      where: { id: campaignId },
    });
  }

  if (!campaign && body.productName) {
    campaign = {
      id: "inline",
      productName: body.productName,
      countryCode: body.countryCode || "BR",
      budgetDaily: body.budgetDaily || 20,
      funnelStage: body.funnelStage || "topo",
      creativeUrl: body.creativeUrl || null,
      affiliateLink: body.affiliateLink || null,
      affLink: null,
      adCopy: JSON.stringify(body.adCopy || {}),
      interests: JSON.stringify(body.interests || []),
      placements: JSON.stringify(body.placements || []),
      targetCities: JSON.stringify(body.targetCities || []),
      targetRegions: JSON.stringify(body.targetRegions || []),
      metaCampaignId: null,
      status: "DRAFT",
      userId: session.user.id,
    } as Awaited<ReturnType<typeof prisma.campaign.findFirst>> & Record<string, unknown>;
  }

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
      accountId,
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
      status: startTime ? "PAUSED" : "ACTIVE",
      pixelId: config.pixelId || undefined,
    });

    if (campaign.id && campaign.id !== "inline") {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { metaCampaignId: result.id, status: "ACTIVE" },
      });
    }

    if (result.partial) {
      return NextResponse.json({
        success: true,
        partial: true,
        metaCampaignId: result.id,
        adSetId: result.adSetId,
        adsManagerUrl: result.adsManagerUrl,
        message: result.message,
      });
    }

    return NextResponse.json({ success: true, metaCampaignId: result.id, name: result.name, status: result.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao criar campanha no Meta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
