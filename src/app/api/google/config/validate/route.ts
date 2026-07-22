import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGoogleConfig, validateGoogleToken, refreshAccessToken } from "@/lib/google-ads";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await getGoogleConfig(session.user.id);
  if (!config) return NextResponse.json({ valid: false, error: "Google Ads nao conectado" });

  let result = await validateGoogleToken(config);

  if (!result.valid && config.refreshToken) {
    try {
      const newToken = await refreshAccessToken(config.refreshToken);
      await prisma.googleConfig.update({
        where: { userId: session.user.id },
        data: { accessToken: newToken },
      });
      result = await validateGoogleToken({ ...config, accessToken: newToken });
    } catch {
      return NextResponse.json({ valid: false, error: "Token expirado. Reconecte o Google Ads." });
    }
  }

  return NextResponse.json(result);
}
