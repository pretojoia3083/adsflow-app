import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { image, name, agencyLogo } = await req.json();

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;
    if (image) updateData.avatarUrl = image;
    if (agencyLogo) updateData.agencyLogo = agencyLogo;

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
    select: { id: true, name: true, email: true, avatarUrl: true, agencyLogo: true },
  });

  return NextResponse.json({ user });
}
