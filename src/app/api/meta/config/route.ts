import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMetaConfig, saveMetaConfig, deleteMetaConfig, validateMetaToken, getAdAccounts } from "@/lib/meta-api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getMetaConfig(session.user.id);
  if (!config) {
    return NextResponse.json({ connected: false });
  }

  let accountId = config.accountId;
  if (!accountId.startsWith("act_")) {
    accountId = `act_${accountId}`;
    await saveMetaConfig(session.user.id, config.accessToken, accountId);
  }

  return NextResponse.json({
    connected: true,
    accountId,
    createdAt: config.createdAt,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accessToken, accountId } = await req.json();

  if (!accessToken || !accountId) {
    return NextResponse.json({ error: "Token e ID da conta sao obrigatorios" }, { status: 400 });
  }

  const validation = await validateMetaToken(accessToken);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error || "Token invalido" }, { status: 400 });
  }

  let normalizedAccountId = accountId.trim();
  if (!normalizedAccountId.startsWith("act_")) {
    normalizedAccountId = `act_${normalizedAccountId}`;
  }

  await saveMetaConfig(session.user.id, accessToken, normalizedAccountId);

  return NextResponse.json({ success: true, connected: true, accountId: normalizedAccountId });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteMetaConfig(session.user.id);
  return NextResponse.json({ success: true, connected: false });
}
