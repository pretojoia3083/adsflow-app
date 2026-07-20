import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { image, name, agencyLogo, openaiApiKey } = await req.json();

    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.avatarUrl = image;
    if (agencyLogo !== undefined) updateData.agencyLogo = agencyLogo;
    if (openaiApiKey !== undefined) updateData.openaiApiKey = openaiApiKey || null;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl,
        agencyLogo: updated.agencyLogo,
        hasOpenaiKey: !!updated.openaiApiKey,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao atualizar perfil";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, avatarUrl: true, agencyLogo: true, openaiApiKey: true },
  });

  return NextResponse.json({
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      agencyLogo: user.agencyLogo,
      hasOpenaiKey: !!user.openaiApiKey,
    } : null,
  });
}
