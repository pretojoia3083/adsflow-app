import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGoogleConfig, listAccessibleAccounts } from "@/lib/google-ads";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await getGoogleConfig(session.user.id);
  if (!config) return NextResponse.json({ error: "Google Ads nao conectado" }, { status: 400 });

  try {
    const accounts = await listAccessibleAccounts(config);
    return NextResponse.json({ accounts });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro ao listar contas" }, { status: 500 });
  }
}
