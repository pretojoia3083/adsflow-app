import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
