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

  const { campaignId } = await req.json();

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, userId: session.user.id },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campanha nao encontrada" }, { status: 404 });
  }

  if (campaign.metaCampaignId) {
    return NextResponse.json({ error: "Campanha ja publicada no Meta", metaCampaignId: campaign.metaCampaignId }, { status: 400 });
  }

  try {
    const adCopy = JSON.parse(campaign.adCopy);
    const interests = JSON.parse(campaign.interests);
    const placements = JSON.parse(campaign.placements);

    const result = await createMetaCampaign(
      config.accessToken,
      config.accountId,
      campaign.productName,
      campaign.budgetDaily || 20,
      campaign.countryCode || "BR",
      interests,
      placements,
      {
        headline: campaign.productName,
        primaryText: adCopy.headline || adCopy.primaryText || "",
        description: adCopy.description || "",
        cta: campaign.affiliateLink || campaign.affLink || "",
      }
    );

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { metaCampaignId: result.id, status: "ACTIVE" },
    });

    return NextResponse.json({ success: true, metaCampaignId: result.id, name: result.name, status: result.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao criar campanha no Meta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
