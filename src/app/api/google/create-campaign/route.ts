import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGoogleConfig, createGoogleCampaign } from "@/lib/google-ads";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await getGoogleConfig(session.user.id);
  if (!config) return NextResponse.json({ error: "Google Ads nao configurado" }, { status: 400 });

  const body = await req.json();
  const { campaignId, dailyBudget, country, keywords, adCopy, finalUrl, productName } = body;

  if (!dailyBudget || !country || !adCopy || !finalUrl) {
    return NextResponse.json({ error: "Campos obrigatorios: dailyBudget, country, adCopy, finalUrl" }, { status: 400 });
  }

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

  if (!campaign && productName) {
    campaign = {
      id: "inline",
      productName,
      countryCode: country,
      budgetDaily: dailyBudget,
      funnelStage: "topo",
      creativeUrl: null,
      affiliateLink: null,
      affLink: null,
      adCopy: JSON.stringify(adCopy),
      interests: "[]",
      placements: "[]",
      targetCities: "[]",
      targetRegions: "[]",
      metaCampaignId: null,
      googleCampaignId: null,
      status: "DRAFT",
      userId: session.user.id,
    } as Awaited<ReturnType<typeof prisma.campaign.findFirst>> & Record<string, unknown>;
  }

  if (!campaign) {
    return NextResponse.json({ error: "Campanha nao encontrada" }, { status: 404 });
  }

  if (campaign.googleCampaignId) {
    return NextResponse.json({ error: "Campanha ja publicada no Google Ads", googleCampaignId: campaign.googleCampaignId }, { status: 400 });
  }

  try {
    const result = await createGoogleCampaign({
      accessToken: config.accessToken,
      refreshToken: config.refreshToken,
      customerId: config.customerId,
      mccId: config.mccId || undefined,
      developerToken: config.developerToken,
      campaignName: campaign.productName || productName || "Campanha AdsFlow",
      dailyBudget: dailyBudget || campaign.budgetDaily || 20,
      country: country || campaign.countryCode || "BR",
      keywords: keywords || [],
      adCopy: {
        headline: adCopy.headline || campaign.productName,
        primaryText: adCopy.primaryText || "",
        description: adCopy.description || "",
        cta: adCopy.cta || "",
      },
      finalUrl,
      status: "PAUSED",
    });

    if (campaign.id && campaign.id !== "inline") {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { googleCampaignId: result.googleCampaignId || result.id, status: "ACTIVE" },
      });
    }

    if (result.partial) {
      return NextResponse.json({
        success: true,
        partial: true,
        googleCampaignId: result.googleCampaignId || result.id,
        adsManagerUrl: result.adsManagerUrl,
        message: result.message,
      });
    }

    return NextResponse.json({
      success: true,
      googleCampaignId: result.googleCampaignId || result.id,
      name: result.name,
      status: result.status,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao criar campanha no Google Ads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
