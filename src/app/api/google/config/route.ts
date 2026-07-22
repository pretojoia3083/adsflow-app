import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGoogleConfig, saveGoogleConfig, deleteGoogleConfig } from "@/lib/google-ads";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await getGoogleConfig(session.user.id);
  if (!config) return NextResponse.json({ connected: false });

  return NextResponse.json({
    connected: true,
    customerId: config.customerId,
    mccId: config.mccId,
    developerToken: config.developerToken ? "••••••••" : "",
    createdAt: config.createdAt,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { accessToken, refreshToken, customerId, developerToken, mccId } = body;

  if (!accessToken || !refreshToken || !customerId || !developerToken) {
    return NextResponse.json({ error: "Campos obrigatorios: accessToken, refreshToken, customerId, developerToken" }, { status: 400 });
  }

  try {
    await saveGoogleConfig(session.user.id, accessToken, refreshToken, customerId, developerToken, mccId);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro ao salvar" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await deleteGoogleConfig(session.user.id);
  return NextResponse.json({ success: true });
}
