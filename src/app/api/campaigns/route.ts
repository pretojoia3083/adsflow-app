import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function serializeJson(val: unknown): string {
  if (val === null || val === undefined) return "[]";
  if (typeof val === "string") return val;
  return JSON.stringify(val);
}

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

    const data = await request.json();

    const {
      campaignId,
      productName,
      description,
      audience,
      funnelStage,
      budgetPref,
      country,
      countryCode,
      language,
      estimatedCpm,
      networkId,
      networkName,
      affLink,
      trackingId,
      templateId,
      templateLabel,
      presellSlug,
      keywords,
      interests,
      placements,
      budgetDaily,
      deviceSplit,
      adCopy,
      tone,
    } = data;

    if (campaignId) {
      const existing = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!existing || existing.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Campanha nao encontrada" },
          { status: 404 }
        );
      }

      const updated = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          productName,
          description,
          audience,
          funnelStage,
          budgetPref,
          country,
          countryCode,
          language,
          estimatedCpm,
          networkId,
          networkName,
          affLink,
          trackingId,
          templateId,
          templateLabel,
          presellSlug,
          keywords: serializeJson(keywords),
          interests: serializeJson(interests),
          placements: serializeJson(placements),
          budgetDaily,
          deviceSplit: serializeJson(deviceSplit),
          adCopy: serializeJson(adCopy),
          tone,
        },
      });

      return NextResponse.json(updated);
    }

    const slug =
      presellSlug ||
      productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString(36);

    const created = await prisma.campaign.create({
      data: {
        userId: session.user.id,
        productName,
        description,
        audience,
        funnelStage: funnelStage || "meio",
        budgetPref: budgetPref || "medio",
        country,
        countryCode,
        language,
        estimatedCpm,
        networkId,
        networkName,
        affLink,
        trackingId,
        templateId,
        templateLabel,
        presellSlug: slug,
        keywords: serializeJson(keywords),
        interests: serializeJson(interests),
        placements: serializeJson(placements),
        budgetDaily,
        deviceSplit: serializeJson(deviceSplit),
        adCopy: serializeJson(adCopy),
        tone,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Save campaign error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar campanha" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const parsed = campaigns.map((c) => ({
      ...c,
      keywords: deserializeJson(c.keywords),
      interests: deserializeJson(c.interests),
      placements: deserializeJson(c.placements),
      deviceSplit: deserializeJson(c.deviceSplit, {}),
      adCopy: deserializeJson(c.adCopy, {}),
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("List campaigns error:", error);
    return NextResponse.json(
      { error: "Erro ao listar campanhas" },
      { status: 500 }
    );
  }
}
