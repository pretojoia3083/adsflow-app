import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMetaConfig, deleteMetaCampaign } from "@/lib/meta-api";

const META_API_VERSION = "v21.0";

async function toggleMetaCampaign(accessToken: string, metaCampaignId: string, action: "pause" | "resume") {
  try {
    const res = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${metaCampaignId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action === "pause" ? "PAUSED" : "ACTIVE", access_token: accessToken }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = campaigns.map((c) => ({
    ...c,
    keywords: JSON.parse(c.keywords),
    interests: JSON.parse(c.interests),
    placements: JSON.parse(c.placements),
    deviceSplit: JSON.parse(c.deviceSplit),
    adCopy: JSON.parse(c.adCopy),
  }));

  return NextResponse.json(serialized);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const campaign = await prisma.campaign.create({
    data: {
      userId: session.user.id,
      productName: data.productName,
      description: data.description ?? null,
      audience: data.audience ?? null,
      funnelStage: data.funnelStage ?? "meio",
      budgetPref: data.budgetPref ?? "medio",
      country: data.country,
      countryCode: data.countryCode ?? null,
      language: data.language ?? null,
      estimatedCpm: data.estimatedCpm ?? null,
      networkId: data.networkId ?? null,
      networkName: data.networkName ?? null,
      affLink: data.affLink ?? null,
      affiliateLink: data.affiliateLink ?? null,
      presellSlug: data.presellSlug ?? null,
      keywords: JSON.stringify(data.keywords ?? []),
      interests: JSON.stringify(data.interests ?? []),
      placements: JSON.stringify(data.placements ?? []),
      budgetDaily: data.budgetDaily ?? null,
      deviceSplit: JSON.stringify(data.deviceSplit ?? {}),
      adCopy: JSON.stringify(data.adCopy ?? {}),
      tone: data.tone ?? null,
    },
  });

  return NextResponse.json({
    ...campaign,
    keywords: JSON.parse(campaign.keywords),
    interests: JSON.parse(campaign.interests),
    placements: JSON.parse(campaign.placements),
    deviceSplit: JSON.parse(campaign.deviceSplit),
    adCopy: JSON.parse(campaign.adCopy),
  });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const deleteMeta = searchParams.get("deleteMeta") === "true";

  if (!id) {
    return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  if (deleteMeta && campaign.metaCampaignId) {
    const metaConfig = await getMetaConfig(session.user.id);
    if (metaConfig) {
      await deleteMetaCampaign(metaConfig.accessToken, campaign.metaCampaignId);
    }
  }

  await prisma.campaign.delete({ where: { id } });

  return NextResponse.json({ success: true, deletedMeta: deleteMeta && !!campaign.metaCampaignId });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, action } = await req.json();

  if (!id || !["pause", "resume", "duplicate"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  if (action === "pause" || action === "resume") {
    const newStatus = action === "pause" ? "PAUSED" : "ACTIVE";

    if (campaign.metaCampaignId) {
      const metaConfig = await getMetaConfig(session.user.id);
      if (metaConfig) {
        await toggleMetaCampaign(metaConfig.accessToken, campaign.metaCampaignId, action);
      }
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, status: updated.status });
  }

  if (action === "duplicate") {
    const dup = await prisma.campaign.create({
      data: {
        userId: session.user.id,
        productName: campaign.productName + " (Copia)",
        description: campaign.description,
        audience: campaign.audience,
        funnelStage: campaign.funnelStage,
        budgetPref: campaign.budgetPref,
        country: campaign.country,
        countryCode: campaign.countryCode,
        language: campaign.language,
        estimatedCpm: campaign.estimatedCpm,
        networkId: campaign.networkId,
        networkName: campaign.networkName,
        affLink: campaign.affLink,
        affiliateLink: campaign.affiliateLink,
        presellSlug: campaign.presellSlug,
        keywords: campaign.keywords,
        interests: campaign.interests,
        placements: campaign.placements,
        budgetDaily: campaign.budgetDaily,
        deviceSplit: campaign.deviceSplit,
        adCopy: campaign.adCopy,
        tone: campaign.tone,
        status: "DRAFT",
      },
    });

    return NextResponse.json({
      success: true,
      campaign: {
        ...dup,
        keywords: JSON.parse(dup.keywords),
        interests: JSON.parse(dup.interests),
        placements: JSON.parse(dup.placements),
        deviceSplit: JSON.parse(dup.deviceSplit),
        adCopy: JSON.parse(dup.adCopy),
      },
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
