import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publishCampaign } from "@/lib/meta-ads";

function deserializeJson(val: string | null, fallback: unknown = []) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID e obrigatorio" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha nao encontrada" },
        { status: 404 }
      );
    }

    if (campaign.userId !== session.user.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const adCopy = deserializeJson(campaign.adCopy, {});
    const placements = deserializeJson(campaign.placements, []);
    const variations = (adCopy as Record<string, unknown>)?.variations as Array<{
      headline: string;
      body: string;
      cta: string;
    }> | undefined;

    if (!variations || variations.length === 0) {
      return NextResponse.json(
        { error: "Nenhum anuncio gerado para esta campanha" },
        { status: 400 }
      );
    }

    const targeting = {
      geo_locations: { countries: [campaign.countryCode] },
      locales: [campaign.language === "pt-BR" ? 26 : 1],
      publisher_platforms: (placements as string[]).map((p: string) =>
        p.toLowerCase().includes("instagram")
          ? "instagram"
          : p.toLowerCase().includes("facebook")
          ? "facebook"
          : "audience_network"
      ) || ["facebook", "instagram"],
    };

    const result = await publishCampaign({
      name: `${campaign.productName} - ${campaign.country}`,
      objective: "OUTCOME_TRAFFIC",
      dailyBudget: String((campaign.budgetDaily || 20) * 100),
      targeting,
      headline: variations[0].headline,
      body: variations[0].body,
      cta: variations[0].cta,
      linkUrl: campaign.affLink || `${process.env.NEXT_PUBLIC_APP_URL}/p/${campaign.presellSlug}`,
    });

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "ACTIVE",
        metaCampaignId: result.campaignId,
      },
    });

    return NextResponse.json({
      success: true,
      campaignId: result.campaignId,
      adSetId: result.adSetId,
      adId: result.adId,
    });
  } catch (error) {
    console.error("Publish campaign error:", error);
    return NextResponse.json(
      { error: "Erro ao publicar campanha" },
      { status: 500 }
    );
  }
}
