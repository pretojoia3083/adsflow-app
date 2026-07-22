import { NextRequest, NextResponse } from "next/server";
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  getTrendingProducts,
  getTopCommissionProducts,
  getProductStats,
} from "@/lib/clickbank";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "list";
  const category = searchParams.get("category") || "all";
  const q = searchParams.get("q") || "";
  const country = searchParams.get("country") || "ALL";
  const sort = searchParams.get("sort") || "trending";
  const minGravity = parseInt(searchParams.get("minGravity") || "0");

  try {
    let products;

    switch (action) {
      case "trending":
        products = getTrendingProducts(minGravity || 300);
        break;
      case "top-commission":
        products = getTopCommissionProducts(10);
        break;
      case "search":
        products = q ? searchProducts(q) : getAllProducts();
        break;
      default:
        products = getAllProducts();
    }

    if (category !== "all" && action !== "trending" && action !== "top-commission") {
      if (action === "search") {
        products = products.filter((p) => p.category === category);
      } else {
        products = getProductsByCategory(category);
        if (q) {
          const qLower = q.toLowerCase();
          products = products.filter(
            (p) =>
              p.name.toLowerCase().includes(qLower) ||
              p.description.toLowerCase().includes(qLower) ||
              p.tags.some((t) => t.toLowerCase().includes(qLower))
          );
        }
      }
    }

    if (country !== "ALL") {
      const countryFiltered = products.filter((p) => p.country === country);
      if (countryFiltered.length > 0) {
        products = countryFiltered;
      }
    }

    switch (sort) {
      case "commission":
        products.sort((a, b) => b.commission - a.commission);
        break;
      case "gravity":
        products.sort((a, b) => b.gravity - a.gravity);
        break;
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "refund":
        products.sort((a, b) => a.refundRate - b.refundRate);
        break;
      default:
        products.sort((a, b) => b.gravity - a.gravity);
    }

    const trending = products.filter((p) => p.gravity > 400).length;
    const avgCommission = products.length > 0
      ? products.reduce((s, p) => s + p.commissionPercent, 0) / products.length
      : 0;
    const avgGravity = products.length > 0
      ? products.reduce((s, p) => s + p.gravity, 0) / products.length
      : 0;
    const categories = [...new Set(products.map((p) => p.category))];

    const stats = {
      total: products.length,
      trending,
      avgCommission: avgCommission.toFixed(1),
      avgGravity: avgGravity.toFixed(0),
      categories: categories.length,
    };

    return NextResponse.json({
      products,
      stats,
      filters: {
        category,
        country,
        sort,
        query: q,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar produtos", products: [], stats: getProductStats() },
      { status: 500 }
    );
  }
}
