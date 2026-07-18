import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scrapeAdLibrary } from "@/lib/ad-library-scraper";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const country = searchParams.get("country") || "BR";
  const minDays = Number(searchParams.get("minDays")) || 7;
  const maxDays = Number(searchParams.get("maxDays")) || 90;
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 15);

  if (!q) {
    return NextResponse.json({ ads: [], facebookAdLibraryUrl: "" });
  }

  const result = await scrapeAdLibrary(q, country, minDays, maxDays, limit);

  return NextResponse.json({
    ads: result.ads,
    facebookAdLibraryUrl: result.facebookAdLibraryUrl,
    note: result.error || "Dados extraidos do Facebook Ad Library",
    error: result.error,
  });
}
