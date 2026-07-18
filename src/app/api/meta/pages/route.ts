import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMetaConfig, getFacebookPages } from "@/lib/meta-api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getMetaConfig(session.user.id);
  if (!config) {
    return NextResponse.json({ error: "Meta API nao configurada" }, { status: 400 });
  }

  try {
    const pages = await getFacebookPages(config.accessToken);
    return NextResponse.json({ pages });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao buscar paginas";
    return NextResponse.json({ error: message, pages: [] }, { status: 500 });
  }
}
