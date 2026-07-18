"use client";

import { useState } from "react";

interface AdResult {
  id?: string;
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
  daysRunning?: number;
  score?: number;
  scoreLabel?: "top" | "bom" | "recente";
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
  { code: "BR", name: "Brasil" }, { code: "US", name: "Estados Unidos" }, { code: "GB", name: "Reino Unido" },
  { code: "PT", name: "Portugal" }, { code: "DE", name: "Alemanha" }, { code: "FR", name: "Franca" },
  { code: "ES", name: "Espanha" }, { code: "IT", name: "Italia" }, { code: "JP", name: "Japao" },
  { code: "KR", name: "Coreia do Sul" }, { code: "CA", name: "Canada" }, { code: "AU", name: "Australia" },
  { code: "MX", name: "Mexico" }, { code: "AR", name: "Argentina" }, { code: "CO", name: "Colombia" },
  { code: "CL", name: "Chile" }, { code: "PE", name: "Peru" }, { code: "EC", name: "Equador" },
  { code: "VE", name: "Venezuela" }, { code: "UY", name: "Uruguai" }, { code: "PY", name: "Paraguai" },
  { code: "BO", name: "Bolivia" }, { code: "CR", name: "Costa Rica" }, { code: "PA", name: "Panama" },
  { code: "GT", name: "Guatemala" }, { code: "DO", name: "Republica Dominicana" }, { code: "CU", name: "Cuba" },
  { code: "HN", name: "Honduras" }, { code: "SV", name: "El Salvador" }, { code: "NI", name: "Nicaragua" },
  { code: "JM", name: "Jamaica" }, { code: "TT", name: "Trinidad e Tobago" }, { code: "PR", name: "Porto Rico" },
  { code: "NL", name: "Holanda" }, { code: "BE", name: "Belgica" }, { code: "CH", name: "Suica" },
  { code: "AT", name: "Austria" }, { code: "SE", name: "Suecia" }, { code: "NO", name: "Noruega" },
  { code: "DK", name: "Dinamarca" }, { code: "FI", name: "Finlandia" }, { code: "IE", name: "Irlanda" },
  { code: "PL", name: "Polonia" }, { code: "CZ", name: "Chequia" }, { code: "RO", name: "Romenia" },
  { code: "HU", name: "Hungria" }, { code: "GR", name: "Grecia" }, { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croacia" }, { code: "RS", name: "Servia" }, { code: "UA", name: "Ucrania" },
  { code: "TR", name: "Turquia" }, { code: "RU", name: "Russia" }, { code: "CN", name: "China" },
  { code: "TW", name: "Taiwan" }, { code: "IN", name: "India" }, { code: "TH", name: "Tailandia" },
  { code: "VN", name: "Vietna" }, { code: "PH", name: "Filipinas" }, { code: "MY", name: "Malasia" },
  { code: "SG", name: "Singapura" }, { code: "ID", name: "Indonesia" }, { code: "HK", name: "Hong Kong" },
  { code: "PK", name: "Paquistao" }, { code: "NZ", name: "Nova Zelandia" }, { code: "ZA", name: "Africa do Sul" },
  { code: "NG", name: "Nigeria" }, { code: "KE", name: "Quenia" }, { code: "GH", name: "Gana" },
  { code: "EG", name: "Egito" }, { code: "MA", name: "Marrocos" }, { code: "TN", name: "Tunisia" },
  { code: "SA", name: "Arabia Saudita" }, { code: "AE", name: "Emirados Arabes" }, { code: "IL", name: "Israel" },
  { code: "QA", name: "Catar" }, { code: "KW", name: "Kuwait" }, { code: "BH", name: "Barein" },
  { code: "OM", name: "Oma" }, { code: "JO", name: "Jordania" }, { code: "LB", name: "Libano" },
  { code: "IQ", name: "Iraque" }, { code: "AO", name: "Angola" }, { code: "MZ", name: "Mocambique" },
  { code: "CV", name: "Cabo Verde" }, { code: "TL", name: "Timor-Leste" }, { code: "GW", name: "Guine-Bissau" },
  { code: "ST", name: "Sao Tome e Principe" },
];

function ScoreBadge({ label }: { label?: string }) {
  if (!label) return null;
  const config = {
    top: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", color: "#22C55E", text: "🏆 Top Performer" },
    bom: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", color: "#F59E0B", text: "⚡ Bom Performer" },
    recente: { bg: "rgba(148,163,184,0.15)", border: "rgba(148,163,184,0.4)", color: "#94A3B8", text: "🕐 Recente" },
  };
  const c = config[label as keyof typeof config] || config.recente;
  return (
    <span style={{ padding: "3px 10px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 99, color: c.color, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
      {c.text}
    </span>
  );
}

export default function AdRadarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState("BR");
  const [countryMode, setCountryMode] = useState<"manual" | "all" | "top3">("manual");
  const [minDays, setMinDays] = useState(14);
  const [maxDays, setMaxDays] = useState(90);

  const [results, setResults] = useState<AdResult[]>([]);
  const [facebookAdLibraryUrl, setFacebookAdLibraryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [note, setNote] = useState("");
  const [selectedAd, setSelectedAd] = useState<AdResult | null>(null);

  const [pageLoading, setPageLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [pageError, setPageError] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [presellDraft, setPresellDraft] = useState<PresellDraft | null>(null);
  const [activeTab, setActiveTab] = useState<"copy" | "page" | "presell">("copy");

  async function handleSearch() {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearched(true);
    setPageInfo(null);
    setPresellDraft(null);
    setNote("");
    try {
      const countryParam = countryMode === "all" ? "ALL" : countryMode === "top3" ? "TOP3" : country;
      const res = await fetch(`/api/ad-radar/scraper?q=${encodeURIComponent(searchTerm)}&country=${countryParam}&minDays=${minDays}&maxDays=${maxDays}&limit=10`);
      const data = await res.json();
      setResults(data.ads || []);
      setFacebookAdLibraryUrl(data.facebookAdLibraryUrl || "");
      setNote(data.note || "");
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

  const topPerformers = results.filter((r) => r.scoreLabel === "top");
  const bomPerformers = results.filter((r) => r.scoreLabel === "bom");
  const recentes = results.filter((r) => r.scoreLabel === "recente");

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Radar de Anuncios</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Encontre anuncios que estao dando resultado — classificados por tempo rodando</p>
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

          <div>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Pais (codigo)</span>

            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[
                { id: "manual" as const, label: "Manual" },
                { id: "all" as const, label: "Todos" },
                { id: "top3" as const, label: "Top 3" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setCountryMode(m.id)}
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
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  list="country-list"
                  value={(() => {
                    const c = COUNTRIES.find((c) => c.code === country);
                    return c ? c.name : country;
                  })()}
                  onChange={(e) => {
                    const found = COUNTRIES.find((c) => c.name.toLowerCase() === e.target.value.toLowerCase());
                    if (found) setCountry(found.code);
                    else setCountry(e.target.value.toUpperCase().slice(0, 2));
                  }}
                  placeholder="Digite o nome do pais..."
                  style={{ width: "100%", padding: "10px 14px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 8, color: "#F3F5FF", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
                <datalist id="country-list">
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.flag} {c.name} ({c.code})</option>
                  ))}
                </datalist>
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
          {facebookAdLibraryUrl && (
            <a
              href={facebookAdLibraryUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 20px",
                background: "rgba(24,119,242,0.1)",
                border: "1px solid rgba(24,119,242,0.3)",
                borderRadius: 10,
                color: "#1877F2",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Ver todos no Ad Library
            </a>
          )}
        </div>
      </div>

      {searched && !loading && results.length === 0 && (
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "48px 40px", textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
          <p style={{ fontWeight: 700, fontSize: 18, color: "#F3F5FF", margin: "0 0 8px" }}>Nenhum anuncio encontrado</p>
          <p style={{ color: "#8C93B8", fontSize: 15 }}>Tente outros termos ou ajuste os filtros de dias.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 700, margin: 0 }}>{results.length} anuncios encontrados</p>
              <p style={{ color: "#8C93B8", fontSize: 13, margin: "4px 0 0" }}>{note}</p>
            </div>
          </div>

          {topPerformers.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <h3 style={{ color: "#22C55E", fontSize: 16, fontWeight: 700, margin: 0 }}>Top Performers</h3>
                <span style={{ color: "#6B739E", fontSize: 13 }}>({topPerformers.length} — rodando ha mais tempo = resultado)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                {topPerformers.map((ad, i) => (
                  <AdCard key={i} ad={ad} onClick={() => setSelectedAd(ad)} />
                ))}
              </div>
            </div>
          )}

          {bomPerformers.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <h3 style={{ color: "#F59E0B", fontSize: 16, fontWeight: 700, margin: 0 }}>Bons Performers</h3>
                <span style={{ color: "#6B739E", fontSize: 13 }}>({bomPerformers.length})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                {bomPerformers.map((ad, i) => (
                  <AdCard key={i} ad={ad} onClick={() => setSelectedAd(ad)} />
                ))}
              </div>
            </div>
          )}

          {recentes.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🕐</span>
                <h3 style={{ color: "#94A3B8", fontSize: 16, fontWeight: 700, margin: 0 }}>Mais Recentes</h3>
                <span style={{ color: "#6B739E", fontSize: 13 }}>({recentes.length})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                {recentes.map((ad, i) => (
                  <AdCard key={i} ad={ad} onClick={() => setSelectedAd(ad)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedAd && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={closeModal}>
          <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 18, maxWidth: 740, width: "100%", maxHeight: "88vh", overflow: "auto", padding: 0 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ color: "#F3F5FF", fontSize: 20, fontWeight: 700, margin: 0 }}>Detalhes do anuncio</h3>
                <ScoreBadge label={selectedAd.scoreLabel} />
              </div>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "#8C93B8", fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #232C52", padding: "0 28px", marginTop: 16 }}>
              {[
                { id: "copy" as const, label: "Copy do anuncio" },
                { id: "page" as const, label: "Ver anuncios reais" },
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
                      {selectedAd.daysRunning !== undefined && (
                        <span style={{ color: "#6B739E", fontSize: 12 }}>ha {selectedAd.daysRunning} dias</span>
                      )}
                    </div>
                    <p style={{ color: "#6B739E", fontSize: 13, margin: 0 }}>Plataformas: {selectedAd.platforms.join(", ")}</p>
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
                    <button onClick={() => downloadText(`Page: ${selectedAd.pageName}\nTitle: ${selectedAd.title}\nBody: ${selectedAd.body}\nDescription: ${selectedAd.description}\nPlatforms: ${selectedAd.platforms.join(", ")}\nDays Running: ${selectedAd.daysRunning}`, `ad-${selectedAd.pageName.replace(/\s+/g, "-")}-copy.txt`)} style={{ flex: 1, padding: "12px 16px", background: "rgba(34,176,125,0.1)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 10, color: "#3FCB92", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Baixar copy</button>
                    {selectedAd.snapshotUrl && (
                      <a href={selectedAd.snapshotUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "12px 16px", background: "rgba(24,119,242,0.1)", border: "1px solid rgba(24,119,242,0.3)", borderRadius: 10, color: "#1877F2", fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block" }}>Ver no Facebook ↗</a>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "page" && (
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

              {activeTab === "presell" && (
                <div>
                  {!presellDraft && !aiLoading && (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <p style={{ fontSize: 36, marginBottom: 12 }}>🤖</p>
                      <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Criar presell similar com IA</p>
                      <p style={{ color: "#8C93B8", fontSize: 14, marginBottom: 20 }}>A IA vai analisar esta copy e gerar uma presell similar.</p>
                      <button onClick={handleGeneratePresell} style={{ padding: "14px 28px", background: "linear-gradient(90deg,#22B07D,#3FCB92)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Gerar presell com IA</button>
                    </div>
                  )}
                  {aiLoading && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <div style={{ width: 40, height: 40, border: "3px solid #232C52", borderTopColor: "#22B07D", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                      <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>IA analisando a copy...</p>
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

function AdCard({ ad, onClick }: { ad: AdResult; onClick: () => void }) {
  return (
    <div
      style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#22B07D")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#232C52")}
      onClick={onClick}
    >
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "#3FCB92", fontSize: 13, fontWeight: 600 }}>{ad.pageName}</span>
          <ScoreBadge label={ad.scoreLabel} />
        </div>
        {ad.title && <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: "0 0 6px", lineHeight: 1.4 }}>{ad.title}</p>}
        <p style={{ color: "#A0A8CE", fontSize: 14, margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ad.body}</p>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6B739E", fontSize: 12 }}>ha {ad.daysRunning || "?"} dias</span>
            <div style={{ display: "flex", gap: 3 }}>
              {ad.platforms.map((p) => (
                <span key={p} style={{ fontSize: 10, padding: "2px 6px", background: "rgba(96,165,250,0.12)", borderRadius: 99, color: "#60A5FA", fontWeight: 500 }}>{p}</span>
              ))}
            </div>
          </div>
          <span style={{ color: "#22B07D", fontSize: 12, fontWeight: 600 }}>Ver copy →</span>
        </div>
      </div>
    </div>
  );
}
