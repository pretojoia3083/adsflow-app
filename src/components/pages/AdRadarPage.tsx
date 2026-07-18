"use client";

import { useState, useRef, useEffect } from "react";

interface AdResult {
  id: string;
  pageName: string;
  body: string;
  title: string;
  description: string;
  snapshotUrl: string;
  pageUrl?: string;
  landingUrl?: string;
  isMock?: boolean;
  startTime: string;
  platforms: string[];
  mediaType: string;
  mediaUrl?: string;
}

interface PageInfo {
  url: string;
  domain: string;
  title: string;
  description: string;
  image: string;
  headings: { h1: string[]; h2: string[] };
  ctas: string[];
  bodyText: string;
}

interface PresellDraft {
  headline: string;
  subheadline: string;
  bodyText: string;
  ctaText: string;
  keyPoints: string[];
  tone: string;
  style: string;
}

const COUNTRIES = [
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "MZ", name: "Mocambique", flag: "🇲🇿" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "GW", name: "Guine-Bissau", flag: "🇬🇼" },
  { code: "ST", name: "Sao Tome e Principe", flag: "🇸🇹" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "EC", name: "Equador", flag: "🇪🇨" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "UY", name: "Uruguai", flag: "🇺🇾" },
  { code: "PY", name: "Paraguai", flag: "🇵🇾" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "DO", name: "Republica Dominicana", flag: "🇩🇴" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "TT", name: "Trinidad e Tobago", flag: "🇹🇹" },
  { code: "PR", name: "Porto Rico", flag: "🇵🇷" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "Reino Unido", flag: "🇬🇧" },
  { code: "DE", name: "Alemanha", flag: "🇩🇪" },
  { code: "FR", name: "Franca", flag: "🇫🇷" },
  { code: "ES", name: "Espanha", flag: "🇪🇸" },
  { code: "IT", name: "Italia", flag: "🇮🇹" },
  { code: "NL", name: "Holanda", flag: "🇳🇱" },
  { code: "BE", name: "Belgica", flag: "🇧🇪" },
  { code: "CH", name: "Suica", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "SE", name: "Suecia", flag: "🇸🇪" },
  { code: "NO", name: "Noruega", flag: "🇳🇴" },
  { code: "DK", name: "Dinamarca", flag: "🇩🇰" },
  { code: "FI", name: "Finlandia", flag: "🇫🇮" },
  { code: "IE", name: "Irlanda", flag: "🇮🇪" },
  { code: "PL", name: "Polonia", flag: "🇵🇱" },
  { code: "CZ", name: "Chequia", flag: "🇨🇿" },
  { code: "RO", name: "Romenia", flag: "🇷🇴" },
  { code: "HU", name: "Hungria", flag: "🇭🇺" },
  { code: "GR", name: "Grecia", flag: "🇬🇷" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", name: "Croacia", flag: "🇭🇷" },
  { code: "RS", name: "Servia", flag: "🇷🇸" },
  { code: "UA", name: "Ucrania", flag: "🇺🇦" },
  { code: "TR", name: "Turquia", flag: "🇹🇷" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "JP", name: "Japao", flag: "🇯🇵" },
  { code: "KR", name: "Coreia do Sul", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "TH", name: "Tailandia", flag: "🇹🇭" },
  { code: "VN", name: "Vietna", flag: "🇻🇳" },
  { code: "PH", name: "Filipinas", flag: "🇵🇭" },
  { code: "MY", name: "Malasia", flag: "🇲🇾" },
  { code: "SG", name: "Singapura", flag: "🇸🇬" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "PK", name: "Paquistao", flag: "🇵🇰" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "Nova Zelandia", flag: "🇳🇿" },
  { code: "ZA", name: "Africa do Sul", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Quenia", flag: "🇰🇪" },
  { code: "GH", name: "Gana", flag: "🇬🇭" },
  { code: "EG", name: "Egito", flag: "🇪🇬" },
  { code: "MA", name: "Marrocos", flag: "🇲🇦" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "SA", name: "Arabia Saudita", flag: "🇸🇦" },
  { code: "AE", name: "Emirados Arabes", flag: "🇦🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "QA", name: "Catar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Barein", flag: "🇧🇭" },
  { code: "OM", name: "Oma", flag: "🇴🇲" },
  { code: "JO", name: "Jordania", flag: "🇯🇴" },
  { code: "LB", name: "Libano", flag: "🇱🇧" },
  { code: "IQ", name: "Iraque", flag: "🇮🇶" },
];

export default function AdRadarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState("BR");
  const [countryMode, setCountryMode] = useState<"manual" | "all" | "top3">("manual");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [minDays, setMinDays] = useState(7);
  const [maxDays, setMaxDays] = useState(90);
  const countryRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<AdResult[]>([]);
  const [facebookAdLibraryUrl, setFacebookAdLibraryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdResult | null>(null);

  const [pageLoading, setPageLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [pageError, setPageError] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [presellDraft, setPresellDraft] = useState<PresellDraft | null>(null);
  const [activeTab, setActiveTab] = useState<"copy" | "page" | "presell">("copy");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry = COUNTRIES.find((c) => c.code === country);
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  async function handleSearch() {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearched(true);
    setPageInfo(null);
    setPresellDraft(null);
    try {
      const res = await fetch(`/api/ad-radar?q=${encodeURIComponent(searchTerm)}&country=${countryMode === "all" ? "ALL" : countryMode === "top3" ? "TOP3" : country}&minDays=${minDays}&maxDays=${maxDays}`);
      const data = await res.json();
      setResults(data.ads || []);
      setFacebookAdLibraryUrl(data.facebookAdLibraryUrl || "");
    } catch {
      setResults([]);
      setFacebookAdLibraryUrl("");
    }
    setLoading(false);
  }

  async function handleFetchPage(url: string) {
    setPageLoading(true);
    setPageError("");
    setPageInfo(null);
    setPresellDraft(null);
    setActiveTab("page");
    try {
      const res = await fetch(`/api/fetch-page?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) setPageError(data.error);
      else setPageInfo(data);
    } catch {
      setPageError("Erro ao buscar pagina");
    }
    setPageLoading(false);
  }

  async function handleGeneratePresell() {
    if (!pageInfo) return;
    setAiLoading(true);
    setPresellDraft(null);
    setActiveTab("presell");
    try {
      const res = await fetch("/api/generate-similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageInfo, productName: searchTerm, productDescription: pageInfo.description }),
      });
      const data = await res.json();
      setPresellDraft(data);
    } catch {
      setPresellDraft({
        headline: `Descubra como ${searchTerm} pode transformar seus resultados`,
        subheadline: "Metodo comprovado que ja ajudou milhares de pessoas",
        bodyText: "A IA nao conseguiu gerar a presell. Use as informacoes da aba anterior para criar sua propria.",
        ctaText: "Quero Comecar Agora",
        keyPoints: [],
        tone: "urgente",
        style: "storytelling",
      });
    }
    setAiLoading(false);
  }

  function downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCreative(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.target = "_blank";
    a.click();
  }

  function closeModal() {
    setSelectedAd(null);
    setPageInfo(null);
    setPresellDraft(null);
    setPageError("");
    setActiveTab("copy");
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Radar de Anuncios</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Analise criativos e copy — veja anuncios reais direto no Facebook Ad Library</p>
      </div>

      <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: 28, marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, alignItems: "end", marginBottom: 16 }}>
          <label style={{ display: "block" }}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Buscar por palavra-chave ou marca</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ex: emagrecimento, curso online, skincare..."
              style={{ width: "100%", padding: "12px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </label>

          <div style={{ position: "relative" }} ref={countryRef}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Pais / Regiao</span>

            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[
                { id: "manual" as const, label: "Manual" },
                { id: "all" as const, label: "Todos" },
                { id: "top3" as const, label: "Top 3" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setCountryMode(m.id);
                    if (m.id === "manual") setShowCountryDropdown(true);
                  }}
                  style={{
                    padding: "6px 12px",
                    background: countryMode === m.id ? "rgba(34,176,125,0.15)" : "#0C1022",
                    border: countryMode === m.id ? "1px solid #22B07D" : "1px solid #232C52",
                    borderRadius: 6,
                    color: countryMode === m.id ? "#3FCB92" : "#6B739E",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {countryMode === "manual" && (
              <div>
                <button
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "#0C1022",
                    border: "1px solid #232C52",
                    borderRadius: 8,
                    color: "#F3F5FF",
                    fontSize: 14,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{selectedCountry?.flag}</span>
                  <span>{selectedCountry?.name || country}</span>
                  <span style={{ marginLeft: "auto", color: "#6B739E", fontSize: 12 }}>▼</span>
                </button>

                {showCountryDropdown && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, maxHeight: 280, overflow: "hidden", zIndex: 50, marginTop: 4, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                    <div style={{ padding: "8px 10px", borderBottom: "1px solid #1A2040" }}>
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Buscar pais..."
                        autoFocus
                        style={{ width: "100%", padding: "8px 12px", background: "#121830", border: "1px solid #232C52", borderRadius: 6, color: "#F3F5FF", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div style={{ maxHeight: 240, overflowY: "auto" }}>
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCountry(c.code); setShowCountryDropdown(false); setCountrySearch(""); }}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            background: country === c.code ? "rgba(34,176,125,0.1)" : "transparent",
                            border: "none",
                            borderBottom: "1px solid #1A2040",
                            color: country === c.code ? "#3FCB92" : "#F3F5FF",
                            fontSize: 14,
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{c.flag}</span>
                          <span>{c.name}</span>
                          <span style={{ marginLeft: "auto", color: "#6B739E", fontSize: 12, fontWeight: 500 }}>{c.code}</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div style={{ padding: 16, textAlign: "center", color: "#6B739E", fontSize: 14 }}>Nenhum pais encontrado</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {countryMode === "all" && (
              <div style={{ padding: "10px 14px", background: "rgba(34,176,125,0.06)", border: "1px solid rgba(34,176,125,0.2)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🌍</span>
                <span style={{ color: "#3FCB92", fontSize: 14, fontWeight: 500 }}>Buscando em todos os paises</span>
              </div>
            )}

            {countryMode === "top3" && (
              <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🏆</span>
                <span style={{ color: "#F59E0B", fontSize: 14, fontWeight: 500 }}>IA vai detectar os 3 paises com mais busca para &quot;{searchTerm || "..."}&quot;</span>
              </div>
            )}
          </div>

          <label style={{ display: "block" }}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Min. dias rodando</span>
            <input
              type="number"
              value={minDays}
              onChange={(e) => setMinDays(Number(e.target.value))}
              min={1}
              style={{ width: "100%", padding: "12px 14px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Max. dias rodando</span>
            <input
              type="number"
              value={maxDays}
              onChange={(e) => setMaxDays(Number(e.target.value))}
              min={1}
              style={{ width: "100%", padding: "12px 14px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </label>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !searchTerm.trim()}
          style={{
            padding: "12px 28px",
            background: loading ? "#4A5178" : "linear-gradient(90deg,#22B07D,#3FCB92)",
            color: "#080B14",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Buscando..." : "Buscar anuncios"}
        </button>
      </div>

      {searched && !loading && results.length === 0 && (
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "48px 40px", textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
          <p style={{ fontWeight: 700, fontSize: 18, color: "#F3F5FF", margin: "0 0 8px" }}>Nenhum anuncio encontrado</p>
          <p style={{ color: "#8C93B8", fontSize: 15 }}>Tente outros termos ou ajuste os filtros.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#8C93B8", fontSize: 14, margin: 0 }}>{results.length} anuncios encontrados — exemplos de copy para referencia</p>
            {facebookAdLibraryUrl && (
              <a
                href={facebookAdLibraryUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "linear-gradient(90deg,#1877F2,#4293F5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Ver anuncios REAIS no Facebook
              </a>
            )}
          </div>

          <div style={{ background: "rgba(24,119,242,0.06)", border: "1px solid rgba(24,119,242,0.2)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <p style={{ color: "#A0A8CE", fontSize: 13, margin: 0 }}>
              Os anuncios acima sao <strong style={{ color: "#F3F5FF" }}>exemplos de copy</strong> para voce se inspirar. Clique no botao azul acima para ver <strong style={{ color: "#1877F2" }}>anuncios reais</strong> no Facebook Ad Library.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {results.map((ad) => (
              <div key={ad.id} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#22B07D")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#232C52")}
                onClick={() => setSelectedAd(ad)}
              >
                {ad.mediaUrl && (
                  <div style={{ height: 200, background: "#0C1022", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {ad.mediaType === "video" ? (
                      <video src={ad.mediaUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                    ) : (
                      <img src={ad.mediaUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                )}
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#3FCB92", fontSize: 13, fontWeight: 600 }}>{ad.pageName}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {ad.platforms.map((p) => (
                        <span key={p} style={{ fontSize: 11, padding: "2px 8px", background: "rgba(96,165,250,0.12)", borderRadius: 99, color: "#60A5FA", fontWeight: 500 }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  {ad.title && <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: "0 0 6px", lineHeight: 1.4 }}>{ad.title}</p>}
                  <p style={{ color: "#A0A8CE", fontSize: 14, margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ad.body}</p>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#6B739E", fontSize: 12 }}>Ativo desde {new Date(ad.startTime).toLocaleDateString("pt-BR")}</span>
                    <span style={{ color: "#22B07D", fontSize: 12, fontWeight: 600 }}>Ver detalhes →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedAd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={closeModal}>
          <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 18, maxWidth: 740, width: "100%", maxHeight: "88vh", overflow: "auto", padding: 0 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#F3F5FF", fontSize: 20, fontWeight: 700, margin: 0 }}>Detalhes do anuncio</h3>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "#8C93B8", fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #232C52", padding: "0 28px", marginTop: 16 }}>
              {[
                { id: "copy" as const, label: "Copy do anuncio" },
                { id: "page" as const, label: "Pagina de vendas" },
                { id: "presell" as const, label: "Criar presell similar" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: "12px 18px", background: "transparent", border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid #22B07D" : "2px solid transparent",
                  color: activeTab === tab.id ? "#3FCB92" : "#6B739E",
                  fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 500, cursor: "pointer",
                }}>{tab.label}</button>
              ))}
            </div>

            <div style={{ padding: "20px 28px 28px" }}>
              {activeTab === "copy" && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <p style={{ color: "#3FCB92", fontSize: 15, fontWeight: 600, margin: 0 }}>{selectedAd.pageName}</p>
                    </div>
                    <p style={{ color: "#6B739E", fontSize: 13, margin: 0 }}>Ativo desde {new Date(selectedAd.startTime).toLocaleDateString("pt-BR")} · Plataformas: {selectedAd.platforms.join(", ")}</p>
                  </div>
                  {selectedAd.title && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 6px" }}>Titulo</p>
                      <p style={{ color: "#F3F5FF", fontSize: 17, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{selectedAd.title}</p>
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 6px" }}>Texto do anuncio</p>
                    <p style={{ color: "#F3F5FF", fontSize: 15, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{selectedAd.body}</p>
                  </div>
                  {selectedAd.description && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 6px" }}>Descricao</p>
                      <p style={{ color: "#A0A8CE", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{selectedAd.description}</p>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                    <button onClick={() => downloadText(`Page: ${selectedAd.pageName}\nTitle: ${selectedAd.title}\nBody: ${selectedAd.body}\nDescription: ${selectedAd.description}\nPlatforms: ${selectedAd.platforms.join(", ")}`, `ad-${selectedAd.id}-copy.txt`)} style={{ flex: 1, padding: "12px 16px", background: "rgba(34,176,125,0.1)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 10, color: "#3FCB92", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Baixar copy</button>
                    {selectedAd.mediaUrl && (
                      <button onClick={() => downloadCreative(selectedAd.mediaUrl!, `ad-${selectedAd.id}-creative`)} style={{ flex: 1, padding: "12px 16px", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 10, color: "#60A5FA", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Baixar criativo</button>
                    )}
                    <button onClick={() => downloadText(`ANUNCIO COMPLETO\n\nPagina: ${selectedAd.pageName}\nPlataformas: ${selectedAd.platforms.join(", ")}\nDesde: ${selectedAd.startTime}\n\n--- TITULO ---\n${selectedAd.title}\n\n--- TEXTO ---\n${selectedAd.body}\n\n--- DESCRICAO ---\n${selectedAd.description}`, `ad-${selectedAd.id}-transcricao.txt`)} style={{ flex: 1, padding: "12px 16px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, color: "#A78BFA", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Baixar transcricao</button>
                  </div>
                </div>
              )}

              {activeTab === "page" && (
                <div>
                  {!pageInfo && !pageLoading && !pageError && (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <p style={{ fontSize: 36, marginBottom: 12 }}>🌐</p>
                      <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Ver anuncios reais no Facebook</p>
                      <p style={{ color: "#8C93B8", fontSize: 14, marginBottom: 20 }}>Acesse o Facebook Ad Library e veja todos os anuncios ativos para esta palavra-chave</p>
                      {facebookAdLibraryUrl && (
                        <a href={facebookAdLibraryUrl} target="_blank" rel="noopener noreferrer" style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "14px 28px",
                          background: "linear-gradient(90deg,#1877F2,#4293F5)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: "pointer",
                          textDecoration: "none",
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          Abrir no Facebook Ad Library
                        </a>
                      )}
                    </div>
                  )}
                  {pageLoading && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ width: 40, height: 40, border: "3px solid #232C52", borderTopColor: "#22B07D", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                      <p style={{ color: "#8C93B8", fontSize: 14 }}>Carregando pagina...</p>
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                  )}
                  {pageError && (
                    <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: 20, textAlign: "center" }}>
                      <p style={{ color: "#F87171", fontSize: 14, margin: 0 }}>{pageError}</p>
                    </div>
                  )}
                  {pageInfo && (
                    <div>
                      <div style={{ background: "#0C1022", borderRadius: 10, padding: "16px 18px", marginBottom: 16, border: "1px solid #1A2040" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <span style={{ color: "#3FCB92", fontSize: 13, fontWeight: 600 }}>{pageInfo.domain}</span>
                        </div>
                        {pageInfo.title && <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>{pageInfo.title}</p>}
                        {pageInfo.description && <p style={{ color: "#A0A8CE", fontSize: 14, margin: 0 }}>{pageInfo.description}</p>}
                      </div>
                      {pageInfo.image && <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", maxHeight: 200 }}><img src={pageInfo.image} alt="" style={{ width: "100%", objectFit: "cover" }} /></div>}
                      {pageInfo.headings?.h2?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 8px" }}>Secoes</p>
                          {pageInfo.headings.h2.map((h, i) => (<div key={i} style={{ padding: "8px 14px", background: "#0C1022", borderRadius: 8, border: "1px solid #1A2040", marginBottom: 4 }}><span style={{ color: "#F3F5FF", fontSize: 14 }}>{h}</span></div>))}
                        </div>
                      )}
                      {pageInfo.ctas?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 8px" }}>CTAs</p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {pageInfo.ctas.map((cta, i) => (<span key={i} style={{ padding: "6px 14px", background: "rgba(34,176,125,0.1)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 99, color: "#3FCB92", fontSize: 13, fontWeight: 500 }}>{cta}</span>))}
                          </div>
                        </div>
                      )}
                      {pageInfo.bodyText && (
                        <div style={{ marginBottom: 20 }}>
                          <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 8px" }}>Conteudo</p>
                          <div style={{ background: "#0C1022", borderRadius: 10, padding: 16, border: "1px solid #1A2040", maxHeight: 300, overflow: "auto" }}>
                            <p style={{ color: "#A0A8CE", fontSize: 14, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{pageInfo.bodyText.slice(0, 3000)}</p>
                          </div>
                        </div>
                      )}
                      <button onClick={handleGeneratePresell} style={{ width: "100%", padding: "14px 24px", background: "linear-gradient(90deg,#22B07D,#3FCB92)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Gerar presell similar com IA</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "presell" && (
                <div>
                  {!presellDraft && !aiLoading && (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <p style={{ fontSize: 36, marginBottom: 12 }}>🤖</p>
                      <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Criar presell similar com IA</p>
                      <p style={{ color: "#8C93B8", fontSize: 14, marginBottom: 20 }}>Analise a pagina de vendas primeiro.</p>
                      <button onClick={() => setActiveTab("page")} style={{ padding: "12px 24px", background: "#1A2040", border: "1px solid #232C52", borderRadius: 10, color: "#8C93B8", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Ver pagina primeiro →</button>
                    </div>
                  )}
                  {aiLoading && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ width: 40, height: 40, border: "3px solid #232C52", borderTopColor: "#22B07D", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                      <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>IA analisando a pagina...</p>
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                  )}
                  {presellDraft && (
                    <div>
                      <div style={{ background: "rgba(34,176,125,0.06)", border: "1px solid rgba(34,176,125,0.2)", borderRadius: 10, padding: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>✨</span>
                        <p style={{ color: "#3FCB92", fontSize: 14, margin: 0 }}>Presell gerada por IA — Edite conforme necessario</p>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 6px" }}>Headline</p>
                        <p style={{ color: "#F3F5FF", fontSize: 20, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{presellDraft.headline}</p>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 6px" }}>Subheadline</p>
                        <p style={{ color: "#A0A8CE", fontSize: 16, margin: 0 }}>{presellDraft.subheadline}</p>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 6px" }}>Texto</p>
                        <div style={{ background: "#0C1022", borderRadius: 10, padding: 16, border: "1px solid #1A2040" }}>
                          <p style={{ color: "#F3F5FF", fontSize: 15, margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{presellDraft.bodyText}</p>
                        </div>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 6px" }}>CTA</p>
                        <div style={{ padding: "12px 20px", background: "linear-gradient(90deg,#22B07D,#3FCB92)", borderRadius: 10, textAlign: "center" }}>
                          <span style={{ color: "#080B14", fontSize: 15, fontWeight: 700 }}>{presellDraft.ctaText}</span>
                        </div>
                      </div>
                      {presellDraft.keyPoints?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p style={{ color: "#8C93B8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 8px" }}>Pontos-chave</p>
                          {presellDraft.keyPoints.map((kp, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#0C1022", borderRadius: 8, marginBottom: 4 }}>
                              <span style={{ color: "#22B07D" }}>✓</span>
                              <span style={{ color: "#F3F5FF", fontSize: 14 }}>{kp}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <span style={{ padding: "4px 12px", background: "rgba(167,139,250,0.12)", borderRadius: 99, color: "#A78BFA", fontSize: 12, fontWeight: 600 }}>Tom: {presellDraft.tone}</span>
                        <span style={{ padding: "4px 12px", background: "rgba(96,165,250,0.12)", borderRadius: 99, color: "#60A5FA", fontSize: 12, fontWeight: 600 }}>Estilo: {presellDraft.style}</span>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => downloadText(`PRESELL\n\nHEADLINE: ${presellDraft.headline}\nSUBHEADLINE: ${presellDraft.subheadline}\n\nTEXTO:\n${presellDraft.bodyText}\n\nCTA: ${presellDraft.ctaText}`, `presell-${selectedAd.pageName.replace(/\s+/g, "-").toLowerCase()}.txt`)} style={{ flex: 1, padding: "12px 16px", background: "rgba(34,176,125,0.1)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 10, color: "#3FCB92", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Baixar presell</button>
                        <button onClick={handleGeneratePresell} style={{ flex: 1, padding: "12px 16px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, color: "#A78BFA", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Gerar outra versao</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
