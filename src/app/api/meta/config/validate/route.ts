import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMetaConfig, validateMetaToken } from "@/lib/meta-api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getMetaConfig(session.user.id);
  if (!config) {
    return NextResponse.json({ valid: false, error: "Meta nao configurado" });
  }

  const result = await validateMetaToken(config.accessToken);
  return NextResponse.json(result);
}
