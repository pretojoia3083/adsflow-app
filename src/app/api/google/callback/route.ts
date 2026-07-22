import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { exchangeCodeForTokens } from "@/lib/google-ads";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?google_auth=error&msg=${error}`, req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?google_auth=no_code", req.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const stateParam = searchParams.get("state") || "";
    const params = new URLSearchParams(stateParam);

    const customerId = params.get("customerId") || "";
    const developerToken = params.get("developerToken") || "";
    const mccId = params.get("mccId") || "";

    if (!customerId || !developerToken) {
      return NextResponse.redirect(new URL("/dashboard?google_auth=missing_params", req.url));
    }

    const configRes = await fetch(`${process.env.NEXTAUTH_URL || "https://adsflow-app-ten.vercel.app"}/api/google/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        customerId,
        developerToken,
        mccId,
      }),
    });

    if (!configRes.ok) {
      return NextResponse.redirect(new URL("/dashboard?google_auth=save_failed", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard?google_auth=success", req.url));
  } catch {
    return NextResponse.redirect(new URL("/dashboard?google_auth=error", req.url));
  }
}
