import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254", "metadata.google.internal", "instance-data"];
const BLOCKED_SCHEMES = ["file:", "ftp:", "data:", "javascript:"];

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "Apenas URLs HTTP/HTTPS sao permitidas" }, { status: 400 });
    }

    if (BLOCKED_HOSTS.some((h) => parsedUrl.hostname === h || parsedUrl.hostname.endsWith("." + h))) {
      return NextResponse.json({ error: "URL nao permitida" }, { status: 400 });
    }

    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(parsedUrl.hostname)) {
      return NextResponse.json({ error: "URLs com enderecos IP nao sao permitidas" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      signal: AbortSignal.timeout(15000),
    });

    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || "";

    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const metaDescription = metaDescMatch?.[1]?.trim() || "";

    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i);
    const ogTitle = ogTitleMatch?.[1]?.trim() || "";

    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["']/i);
    const ogDescription = ogDescMatch?.[1]?.trim() || "";

    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i);
    const ogImage = ogImageMatch?.[1]?.trim() || "";

    const h1Matches = [...html.matchAll(/<h1[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h1>/gi)];
    const h1s = h1Matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim()).filter(Boolean);

    const h2Matches = [...html.matchAll(/<h2[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h2>/gi)];
    const h2s = h2Matches.map((m) => m[1].replace(/<[^>]*>/g, "").trim()).filter(Boolean);

    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    const ctaMatch = html.match(/<button[^>]*class=["'][^"']*(?:btn|cta|buy|order|comprar|assinar)[^"']*["'][^>]*>([^<]*)<\/button>/gi);
    const ctas = ctaMatch?.map((m) => m.replace(/<[^>]*>/g, "").trim()).filter(Boolean) || [];

    return NextResponse.json({
      url,
      domain: parsedUrl.hostname,
      title: ogTitle || title,
      description: ogDescription || metaDescription,
      image: ogImage,
      headings: { h1: h1s.slice(0, 5), h2: h2s.slice(0, 10) },
      ctas: ctas.slice(0, 5),
      bodyText: bodyText.slice(0, 4000),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch page", url });
  }
}
