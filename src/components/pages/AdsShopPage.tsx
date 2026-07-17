"use client";

import { useState, useEffect, useCallback } from "react";

interface TrendingTopic {
  title: string;
  traffic: string;
  source: string;
  articles: { title: string; url: string; source: string; timeAgo: string }[];
  niche: string;
  suggestedProducts: { id: string; name: string; match: number; commission: number; gravity: number }[];
}

const NICHE_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  saude: { color: "#3FCB92", bg: "rgba(63,203,146,0.1)", icon: "💊" },
  financeiro: { color: "#F7C948", bg: "rgba(247,201,72,0.1)", icon: "💰" },
  fitness: { color: "#F72585", bg: "rgba(247,37,133,0.1)", icon: "💪" },
  educacao: { color: "#60A5FA", bg: "rgba(96,165,250,0.1)", icon: "📚" },
  tecnologia: { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", icon: "💻" },
  geral: { color: "#8C93B8", bg: "rgba(140,147,184,0.1)", icon: "🔥" },
};

const CATEGORIES = [
  { id: "all", label: "Todos", icon: "🔥" },
  { id: "health", label: "Saude", icon: "💊" },
  { id: "fitness", label: "Fitness", icon: "💪" },
  { id: "finance", label: "Financeiro", icon: "💰" },
  { id: "education", label: "Educacao", icon: "📚" },
  { id: "tech", label: "Tecnologia", icon: "💻" },
  { id: "home", label: "Casa", icon: "🏠" },
  { id: "entertainment", label: "Entretenimento", icon: "🎮" },
];

const COUNTRIES_FILTER = [
  { code: "ALL", label: "Todos" },
  { code: "US", label: "EUA" },
  { code: "BR", label: "Brasil" },
  { code: "UK", label: "UK" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Alemanha" },
  { code: "FR", label: "Franca" },
];

const SORT_OPTIONS = [
  { id: "trending", label: "Em alta" },
  { id: "commission", label: "Maior comissao" },
  { id: "gravity", label: "Mais popular" },
  { id: "price-high", label: "Maior preco" },
  { id: "price-low", label: "Menor preco" },
  { id: "refund", label: "Menor reembolso" },
];

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  commission: number;
  commissionPercent: number;
  gravity: number;
  country: string;
  image: string;
  vendor: string;
  recurring: boolean;
  refundRate: number;
  tags: string[];
  affiliateUrl: string;
}

interface ProductStats {
  total: number;
  trending: number;
  avgCommission: string;
  avgGravity: string;
  categories: number;
}

export default function AdsShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats>({ total: 0, trending: 0, avgCommission: "0", avgGravity: "0", categories: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [searchDebounce, setSearchDebounce] = useState("");
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [showTrends, setShowTrends] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        country: selectedCountry,
        sort: sortBy,
      });
      if (searchDebounce) params.set("q", searchDebounce);
      if (searchDebounce) params.set("action", "search");

      const res = await fetch(`/api/ads-shop?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setStats(data.stats || { total: 0, trending: 0, avgCommission: "0", avgGravity: "0", categories: 0 });
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [selectedCategory, selectedCountry, sortBy, searchDebounce]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function loadTrends() {
      setTrendsLoading(true);
      try {
        const res = await fetch(`/api/trends?country=${selectedCountry === "ALL" ? "BR" : selectedCountry}`);
        const data = await res.json();
        setTrends(data.trends || []);
      } catch {
        setTrends([]);
      }
      setTrendsLoading(false);
    }
    loadTrends();
  }, [selectedCountry]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #FF6B35, #F7C948)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>
            🛒
          </div>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>
              ADS <span style={{ color: "#F7C948" }}>SHOP</span>
            </h2>
            <p style={{ color: "#8C93B8", fontSize: 14, margin: 0 }}>Produtos em alta prontos para promover</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Produtos", value: stats.total.toString(), icon: "📦", color: "#60A5FA" },
          { label: "Em alta", value: stats.trending.toString(), icon: "📈", color: "#F72585" },
          { label: "Comissao media", value: `${stats.avgCommission}%`, icon: "💰", color: "#F7C948" },
          { label: "Gravity medio", value: stats.avgGravity, icon: "🚀", color: "#3FCB92" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "#121830", border: "1px solid #232C52", borderRadius: 12,
            padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: `${stat.color}15`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: "#6B739E", margin: 0 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Em Alta Agora - Google Trends */}
      {showTrends && (
        <div style={{
          background: "linear-gradient(135deg, #121830 0%, #1A2340 100%)",
          border: "1px solid #232C52", borderRadius: 16,
          padding: "24px 28px", marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #FF4444, #FF6B35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, animation: "pulse 2s infinite",
              }}>📈</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>
                  Em Alta Agora
                </h3>
                <p style={{ fontSize: 12, color: "#6B739E", margin: 0 }}>
                  Google Trends + produtos sugeridos
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTrends(false)}
              style={{
                background: "transparent", border: "1px solid #232C52",
                borderRadius: 8, padding: "6px 12px", color: "#6B739E",
                cursor: "pointer", fontSize: 12,
              }}
            >Fechar</button>
          </div>

          {trendsLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  background: "#0C1022", border: "1px solid #232C52",
                  borderRadius: 12, padding: 18, height: 120,
                  animation: "pulse 1.5s infinite",
                }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
              {trends.slice(0, 8).map((topic, idx) => {
                const nicheStyle = NICHE_COLORS[topic.niche] || NICHE_COLORS.geral;
                return (
                  <div key={idx} style={{
                    background: "#0C1022", border: "1px solid #232C52",
                    borderRadius: 12, padding: "16px 18px",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = nicheStyle.color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#232C52";
                    e.currentTarget.style.transform = "none";
                  }}
                  onClick={() => {
                    setSearchQuery(topic.title);
                    setShowTrends(false);
                  }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{nicheStyle.icon}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: nicheStyle.color,
                          background: nicheStyle.bg, padding: "2px 8px", borderRadius: 6,
                          textTransform: "uppercase", letterSpacing: 0.5,
                        }}>{topic.niche}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "#6B739E" }}>{topic.traffic}</span>
                    </div>

                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "#F3F5FF", margin: "0 0 6px 0" }}>
                      {topic.title}
                    </h4>

                    {topic.articles[0] && (
                      <p style={{ fontSize: 11, color: "#8C93B8", margin: "0 0 8px 0", lineHeight: 1.3 }}>
                        {topic.articles[0].title} · {topic.articles[0].timeAgo}
                      </p>
                    )}

                    {topic.suggestedProducts.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {topic.suggestedProducts.slice(0, 2).map((p) => (
                          <span key={p.id} style={{
                            fontSize: 10, fontWeight: 600,
                            background: "rgba(63,203,146,0.1)", color: "#3FCB92",
                            padding: "2px 8px", borderRadius: 6,
                          }}>
                            ${p.commission} · {p.match}% match
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!showTrends && (
        <button
          onClick={() => setShowTrends(true)}
          style={{
            background: "linear-gradient(135deg, #121830, #1A2340)",
            border: "1px dashed #232C52", borderRadius: 12,
            padding: "12px 20px", marginBottom: 20,
            color: "#F7C948", fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}
        >📈 Mostrar Em Alta Agora</button>
      )}

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#6B739E" }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produto, nicho ou palavra-chave..."
            style={{
              width: "100%", padding: "12px 16px 12px 42px",
              background: "#0C1022", border: "1px solid #232C52",
              borderRadius: 10, color: "#F3F5FF", fontSize: 14,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{
            padding: "12px 16px", background: "#0C1022",
            border: "1px solid #232C52", borderRadius: 10,
            color: "#F3F5FF", fontSize: 14, cursor: "pointer", outline: "none",
          }}
        >
          {COUNTRIES_FILTER.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "12px 16px", background: "#0C1022",
            border: "1px solid #232C52", borderRadius: 10,
            color: "#F3F5FF", fontSize: 14, cursor: "pointer", outline: "none",
          }}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "10px 18px", borderRadius: 99, whiteSpace: "nowrap",
                background: active ? "linear-gradient(90deg,#FF6B35,#F7C948)" : "#121830",
                border: active ? "none" : "1px solid #232C52",
                color: active ? "#080B14" : "#8C93B8",
                fontSize: 14, fontWeight: active ? 700 : 500,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s", flexShrink: 0,
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Product Count */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ color: "#8C93B8", fontSize: 14, margin: 0 }}>
          {loading ? "Carregando..." : `${products.length} produto${products.length !== 1 ? "s" : ""} encontrado${products.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              background: "#121830", border: "1px solid #232C52", borderRadius: 14,
              height: 380, display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulse 1.5s infinite",
            }}>
              <p style={{ color: "#6B739E", fontSize: 14 }}>Carregando...</p>
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length === 0 ? (
        <div style={{
          background: "#121830", border: "1px solid #232C52", borderRadius: 16,
          padding: "56px 40px", textAlign: "center",
        }}>
          <p style={{ fontSize: 44, marginBottom: 16 }}>🔍</p>
          <p style={{ fontWeight: 700, fontSize: 20, color: "#F3F5FF", marginBottom: 10 }}>
            Nenhum produto encontrado
          </p>
          <p style={{ color: "#8C93B8", fontSize: 15 }}>
            Tente ajustar os filtros ou buscar por outro termo.
          </p>
        </div>
      ) : !loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}>
          {products.map((product) => {
            const isHovered = hoveredProduct === product.id;
            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => setSelectedProduct(product)}
                style={{
                  background: "#121830",
                  border: isHovered ? "1px solid #FF6B35" : "1px solid #232C52",
                  borderRadius: 14,
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  transform: isHovered ? "translateY(-2px)" : "none",
                  overflow: "hidden",
                }}
              >
                {/* Product Image/Icon Area */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(247,201,72,0.05))",
                  padding: "28px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  borderBottom: "1px solid #232C52",
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 14,
                    background: "linear-gradient(135deg, #1A1F35, #121830)",
                    border: "1px solid #232C52",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 32, flexShrink: 0,
                  }}>
                    {product.image}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{
                      fontSize: 17, fontWeight: 700, color: "#F3F5FF",
                      margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "#6B739E", margin: "4px 0 0 0" }}>
                      por {product.vendor}
                    </p>
                  </div>
                </div>

                {/* Product Body */}
                <div style={{ padding: "18px 20px" }}>
                  <p style={{
                    fontSize: 13, color: "#8C93B8", lineHeight: 1.5,
                    margin: "0 0 16px 0", display: "-webkit-box",
                    WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {product.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} style={{
                        padding: "3px 10px", borderRadius: 99,
                        background: "rgba(96,165,250,0.08)",
                        border: "1px solid rgba(96,165,250,0.15)",
                        color: "#60A5FA", fontSize: 11, fontWeight: 500,
                      }}>
                        {tag}
                      </span>
                    ))}
                    {product.recurring && (
                      <span style={{
                        padding: "3px 10px", borderRadius: 99,
                        background: "rgba(63,203,146,0.08)",
                        border: "1px solid rgba(63,203,146,0.15)",
                        color: "#3FCB92", fontSize: 11, fontWeight: 600,
                      }}>
                        Recorrente
                      </span>
                    )}
                  </div>

                  {/* Metrics Row */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    <div style={{
                      flex: 1, minWidth: 80, background: "#0C1022",
                      borderRadius: 8, padding: "10px 12px", textAlign: "center",
                    }}>
                      <p style={{ fontSize: 11, color: "#6B739E", margin: 0 }}>Preco</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#F3F5FF", margin: "4px 0 0 0" }}>
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div style={{
                      flex: 1, minWidth: 80, background: "#0C1022",
                      borderRadius: 8, padding: "10px 12px", textAlign: "center",
                    }}>
                      <p style={{ fontSize: 11, color: "#6B739E", margin: 0 }}>Comissao</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#F7C948", margin: "4px 0 0 0" }}>
                        ${product.commission.toFixed(2)}
                      </p>
                    </div>
                    <div style={{
                      flex: 1, minWidth: 80, background: "#0C1022",
                      borderRadius: 8, padding: "10px 12px", textAlign: "center",
                    }}>
                      <p style={{ fontSize: 11, color: "#6B739E", margin: 0 }}>Gravity</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#F72585", margin: "4px 0 0 0" }}>
                        {product.gravity.toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Commission Bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#6B739E" }}>Comissao</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#F7C948" }}>{product.commissionPercent}%</span>
                    </div>
                    <div style={{ height: 4, background: "#0C1022", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4,
                        width: `${product.commissionPercent}%`,
                        background: "linear-gradient(90deg, #FF6B35, #F7C948)",
                      }} />
                    </div>
                  </div>

                  {/* Refund Rate */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    <span style={{ fontSize: 12, color: "#6B739E" }}>Taxa de reembolso:</span>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: product.refundRate < 5 ? "#3FCB92" : product.refundRate < 8 ? "#F59E0B" : "#F87171",
                    }}>
                      {product.refundRate}%
                    </span>
                    {product.refundRate < 5 && (
                      <span style={{ fontSize: 11, color: "#3FCB92" }}>✓ Baixa</span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    style={{
                      width: "100%", padding: "12px",
                      background: "linear-gradient(90deg, #FF6B35, #F7C948)",
                      color: "#080B14", border: "none", borderRadius: 10,
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    🚀 Criar Campanha
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 20,
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={{
              background: "#121830", border: "1px solid #232C52",
              borderRadius: 18, maxWidth: 560, width: "100%",
              maxHeight: "90vh", overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(247,201,72,0.06))",
              padding: "28px 28px 24px", borderBottom: "1px solid #232C52",
              display: "flex", alignItems: "flex-start", gap: 16,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: "linear-gradient(135deg, #1A1F35, #121830)",
                border: "1px solid #232C52",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, flexShrink: 0,
              }}>
                {selectedProduct.image}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>
                  {selectedProduct.name}
                </h2>
                <p style={{ fontSize: 14, color: "#6B739E", margin: "4px 0 0 0" }}>
                  por {selectedProduct.vendor}
                </p>
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {selectedProduct.recurring && (
                    <span style={{
                      padding: "4px 12px", borderRadius: 99,
                      background: "rgba(63,203,146,0.12)", color: "#3FCB92",
                      fontSize: 12, fontWeight: 600,
                    }}>
                      🔄 Recorrente
                    </span>
                  )}
                  <span style={{
                    padding: "4px 12px", borderRadius: 99,
                    background: "rgba(247,201,72,0.12)", color: "#F7C948",
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {selectedProduct.commissionPercent}% comissao
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  background: "transparent", border: "none",
                  color: "#6B739E", fontSize: 22, cursor: "pointer",
                  padding: 4, flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontSize: 15, color: "#8C93B8", lineHeight: 1.6, margin: "0 0 24px 0" }}>
                {selectedProduct.description}
              </p>

              {/* Key Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Preco", value: `$${selectedProduct.price.toFixed(2)}`, color: "#F3F5FF" },
                  { label: "Comissao por venda", value: `$${selectedProduct.commission.toFixed(2)}`, color: "#F7C948" },
                  { label: "Gravity Score", value: selectedProduct.gravity.toFixed(0), color: "#F72585" },
                  { label: "Taxa de reembolso", value: `${selectedProduct.refundRate}%`, color: selectedProduct.refundRate < 5 ? "#3FCB92" : "#F59E0B" },
                ].map((m) => (
                  <div key={m.label} style={{
                    background: "#0C1022", borderRadius: 10, padding: "14px 16px",
                  }}>
                    <p style={{ fontSize: 12, color: "#6B739E", margin: 0 }}>{m.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: m.color, margin: "6px 0 0 0" }}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: "#6B739E", margin: "0 0 8px 0" }}>Tags:</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {selectedProduct.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: "5px 14px", borderRadius: 99,
                      background: "rgba(96,165,250,0.08)",
                      border: "1px solid rgba(96,165,250,0.15)",
                      color: "#60A5FA", fontSize: 13,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                  }}
                  style={{
                    flex: 1, padding: "14px",
                    background: "linear-gradient(90deg, #FF6B35, #F7C948)",
                    color: "#080B14", border: "none", borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  🚀 Criar Campanha com este Produto
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    padding: "14px 20px",
                    background: "transparent", border: "1px solid #232C52",
                    borderRadius: 12, color: "#8C93B8", fontSize: 15,
                    fontWeight: 500, cursor: "pointer",
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
