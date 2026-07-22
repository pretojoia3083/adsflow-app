"use client";

import { useState, useEffect } from "react";
import MarketIntelligence from "./MarketIntelligence";
import CreativeStep from "./CreativeStep";
import CampaignAudit from "./CampaignAudit";
import {
  COUNTRIES,
  CTA_OPTIONS,
  FUNNEL_STAGES,
  BUDGET_PREFS,
  PLACEMENTS,
  type CampaignData,
  type AdCopy,
  type MarketAnalysis,
} from "@/types";

const STEP_NAMES = [
  "Produto",
  "Analise",
  "Segmentacao",
  "Copy",
  "Criativo & Presell",
  "Config",
  "Revisao",
  "Publicar",
];

const C = {
  bg: "#080B14",
  card: "#121830",
  cardAlt: "#0F1626",
  border: "#232C52",
  green1: "#22B07D",
  green2: "#3FCB92",
  text: "#F3F5FF",
  muted: "#8C93B8",
  dim: "#5B628A",
  orange: "#F97316",
};

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px 18px",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    color: C.text,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
}

function labelStyle(): React.CSSProperties {
  return { display: "block", color: C.muted, fontSize: 15, fontWeight: 500, marginBottom: 10 };
}

function cardStyle(): React.CSSProperties {
  return { background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "clamp(24px, 3vw, 40px)" };
}

function sectionTitle(): React.CSSProperties {
  return { fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 6 };
}

function sectionSub(): React.CSSProperties {
  return { color: C.muted, fontSize: 16, marginBottom: 28 };
}

function detectLanguage(country: string): string | null {
  const c = country.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const map: Record<string, string> = {
    brasil: "pt-BR", brazil: "pt-BR",
    portugal: "pt-PT", angola: "pt-AO", mocambique: "pt-MZ", mozambique: "pt-MZ",
    timor: "pt-TL", cabo: "pt-CV", guine: "pt-GW",
    euua: "en-US", "estados unidos": "en-US", "united states": "en-US", "united kingdom": "en-GB", reino: "en-GB",
    inglaterra: "en-GB", australia: "en-AU", canada: "en-CA", irlanda: "en-IE",
    espanha: "es-ES", mexico: "es-MX", argentina: "es-AR", colombia: "es-CO",
    chile: "es-CL", peru: "es-PE", venezuela: "es-VE", uruguai: "es-UY",
    paraguai: "es-PY", cuba: "es-CU", "costa rica": "es-CR", panama: "es-PA",
    republica: "es-DO", honduras: "es-HN", "el salvador": "es-SV",
    guatemala: "es-GT", nicaragua: "es-NI", bolivia: "es-BO", equador: "es-EC",
    franca: "fr-FR", france: "fr-FR", canadaquebec: "fr-CA",
    alemanha: "de-DE", germany: "de-DE", austria: "de-AT", suica: "de-CH",
    italia: "it-IT", italy: "it-IT",
    japao: "ja-JP", japan: "ja-JP",
    china: "zh-CN",
    coreia: "ko-KR", korea: "ko-KR",
    russo: "ru-RU", russia: "ru-RU",
    arabia: "ar-SA", dubai: "ar-AE", emirados: "ar-AE",
    turquia: "tr-TR", turkiye: "tr-TR",
    holanda: "nl-NL", "paises baixos": "nl-NL", belgica: "nl-BE",
    suecia: "sv-SE", sueco: "sv-SE",
    noruega: "nb-NO", polonia: "pl-PL", checa: "cs-CZ", hungaria: "hu-HU",
    grecia: "el-GR", romenia: "ro-RO", finlandia: "fi-FI", dinamarca: "da-DK",
    tailandia: "th-TH", vietna: "vi-VN", indonesia: "id-ID", malasia: "ms-MY",
    filipinas: "fil-PH", singapura: "en-SG", india: "hi-IN",
    africa: "af-ZA", niger: "yo-NG",
  };
  for (const [key, lang] of Object.entries(map)) {
    if (c.includes(key)) return lang;
  }
  return null;
}

export default function AdsFlowWizard({ onStepChange, onClose }: { onStepChange?: (step: number) => void; onClose?: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    audience: "",
    country: "BR",
    language: "pt",
    platform: "",
  });

  const [market, setMarket] = useState<MarketAnalysis | null>(null);

  const [targeting, setTargeting] = useState({
    keywords: "",
    interests: "",
    placements: ["Feed do Facebook", "Feed do Instagram"],
    funnelStage: "topo",
  });

  const [adCopy, setAdCopy] = useState<AdCopy>({
    headline: "",
    primaryText: "",
    description: "",
    cta: "Saiba Mais",
  });

  const [presell, setPresell] = useState({
    slug: "",
    title: "",
    headline: "",
    subheadline: "",
    ctaText: "Saiba Mais",
    affiliateLink: "",
    videoUrl: "",
    bgColor: "#080B14",
    accentColor: "#8B5CF6",
    textColor: "#F3F5FF",
  });

  const [campaignConfig, setCampaignConfig] = useState({
    budgetDaily: 30,
    budgetPref: "medio",
    deviceSplit: "70/30",
    pageId: "",
    startTime: "",
    targetCities: "",
    targetRegions: "",
  });

  const [facebookPages, setFacebookPages] = useState<{ id: string; name: string }[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(false);

  const [creativeMode, setCreativeMode] = useState<"ai" | "template" | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [creativeLoading, setCreativeLoading] = useState(false);

  const [launchResult, setLaunchResult] = useState<{ id: string; productName: string; cpmEstimate?: string } | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [intelligence, setIntelligence] = useState<{
    recommendedBudget?: { min: number; suggested: number; aggressive: number };
    selectedCountry?: string;
    selectedCountryName?: string;
    topCountries?: { code: string; name: string; flag: string; searchVolume: number; competitionLevel: string; cpmEstimate: number; successProbability: number }[];
    competitors?: { advertiser: string; headline: string; cta: string; estimatedSpend: string; platform: string }[];
    insights?: string[];
    bestTimeToLaunch?: string;
    estimatedRoi?: string;
  } | null>(null);
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [adsManagerUrl, setAdsManagerUrl] = useState("");
  const [publishPlatform, setPublishPlatform] = useState<"meta" | "google">("meta");
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googlePublishError, setGooglePublishError] = useState("");
  const [googlePublishSuccess, setGooglePublishSuccess] = useState(false);

  const progressSteps = [
    { title: "Salvando campanha no banco de dados", desc: "Registrando todas as configuracoes da sua campanha..." },
    { title: "Gerando presell automatica", desc: "Criando pagina de pre-venda otimizada para conversao..." },
    { title: "Configurando segmentacao", desc: "Aplicando interesses, localizacao e posicionamentos..." },
    { title: "Preparando copy do anuncio", desc: "Validando headline, texto principal e CTA..." },
    { title: "Finalizando criacao", desc: "Tudo quase pronto!" },
  ];

  useEffect(() => {
    fetch("/api/google/config").then((r) => r.json()).then((d) => setGoogleConnected(d.connected)).catch(() => {});
  }, []);

  async function fetchMarket() {
    setLoading(true);
    try {
      const res = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          audience: product.audience,
          country: product.country,
          language: product.language,
        }),
      });
      const data = await res.json();
      setMarket(data);
    } catch {
      setMarket(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCopy() {
    setLoading(true);
    try {
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          audience: product.audience,
          country: product.country,
          funnelStage: targeting.funnelStage,
        }),
      });
      const data = await res.json();
      setAdCopy(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  async function fetchTargeting() {
    setLoading(true);
    try {
      const res = await fetch("/api/targeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          audience: product.audience,
          country: product.country,
          funnelStage: targeting.funnelStage,
        }),
      });
      const data = await res.json();
      setTargeting({
        keywords: data.keywords,
        interests: data.interests,
        placements: data.placements,
        funnelStage: data.funnelStage || targeting.funnelStage,
      });
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleLaunch() {
    setStep(8);
    setCurrentProgress(0);
    setLaunchResult(null);
    setLoading(true);

    for (let i = 0; i < progressSteps.length; i++) {
      setCurrentProgress(i);
      await new Promise((r) => setTimeout(r, 900));
    }

    try {
      const payload: CampaignData = {
        productName: product.productName,
        description: product.description,
        audience: product.audience,
        funnelStage: targeting.funnelStage,
        budgetPref: campaignConfig.budgetPref,
        country: product.country,
        countryCode: product.country,
        language: product.language,
        estimatedCpm: market?.cpmEstimate,
        keywords: targeting.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        interests: targeting.interests.split(",").map((i) => i.trim()).filter(Boolean),
        placements: targeting.placements,
        budgetDaily: campaignConfig.budgetDaily,
        deviceSplit: { mobile: 70, desktop: 30 },
        adCopy,
        creativeUrl: selectedImage || undefined,
      };

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          affiliateLink: presell.affiliateLink,
          presellSlug: presell.slug,
          pageId: campaignConfig.pageId,
          startTime: campaignConfig.startTime || null,
          targetCities: campaignConfig.targetCities ? campaignConfig.targetCities.split(",").map((c) => c.trim()).filter(Boolean) : [],
          targetRegions: campaignConfig.targetRegions ? campaignConfig.targetRegions.split(",").map((r) => r.trim()).filter(Boolean) : [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLaunchResult({ id: data.id, productName: data.productName, cpmEstimate: data.estimatedCpm });
      } else {
        setLaunchResult({
          id: "local",
          productName: product.productName,
          cpmEstimate: market?.cpmEstimate || "N/A",
        });
      }
    } catch {
      setLaunchResult({
        id: "local",
        productName: product.productName,
        cpmEstimate: market?.cpmEstimate || "N/A",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!launchResult?.id || launchResult.id === "local") return;
    if (!campaignConfig.pageId) {
      setPublishError("Selecione uma Facebook Page na etapa Config antes de publicar.");
      return;
    }
    setLoading(true);
    setPublishError("");
    setPublishSuccess(false);
    try {
      const res = await fetch("/api/meta/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: launchResult?.id !== "local" ? launchResult?.id : undefined,
          pageId: campaignConfig.pageId,
          startTime: campaignConfig.startTime || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLaunchResult({ ...launchResult, id: data.metaCampaignId, productName: launchResult.productName });
        if (data.partial) {
          setPublishError("");
          setPublishSuccess(true);
          setAdsManagerUrl(data.adsManagerUrl);
        } else {
          setPublishSuccess(true);
        }
      } else {
        setPublishError(data.error || "Erro ao publicar campanha no Meta.");
      }
    } catch {
      setPublishError("Erro ao conectar com a API do Meta. Verifique sua conexao e token.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishGoogle() {
    if (!campaignConfig.pageId) {
      setGooglePublishError("Selecione uma Facebook Page na etapa Config antes de publicar.");
      return;
    }
    setLoading(true);
    setGooglePublishError("");
    setGooglePublishSuccess(false);
    try {
      const res = await fetch("/api/google/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: launchResult?.id !== "local" ? launchResult?.id : undefined,
          productName: product.productName,
          dailyBudget: campaignConfig.budgetDaily || 20,
          country: product.country || "BR",
          keywords: targeting.keywords.split(",").map((k) => k.trim()).filter(Boolean),
          adCopy: { headline: adCopy.headline, primaryText: adCopy.primaryText, description: adCopy.description, cta: adCopy.cta },
          finalUrl: presellUrl || presell.affiliateLink || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGooglePublishSuccess(true);
        if (campaignConfig.pageId && launchResult?.id && launchResult.id !== "local") {
          setLaunchResult({ ...launchResult, googleCampaignId: data.googleCampaignId, productName: launchResult.productName });
        }
      } else {
        setGooglePublishError(data.error || "Erro ao publicar no Google Ads.");
      }
    } catch {
      setGooglePublishError("Erro ao conectar com a API do Google Ads.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPresell() {
    setLoading(true);
    try {
      const res = await fetch("/api/presell-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          description: product.description,
          audience: product.audience,
          affiliateLink: presell.affiliateLink,
        }),
      });
      const data = await res.json();
      setPresell({
        slug: data.slug || presell.slug,
        title: data.title || product.productName,
        headline: data.headline || "",
        subheadline: data.subheadline || "",
        ctaText: data.ctaText || "Saiba Mais",
        affiliateLink: presell.affiliateLink,
        bgColor: data.bgColor || "#080B14",
        accentColor: data.accentColor || "#8B5CF6",
        textColor: data.textColor || "#F3F5FF",
      });
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  async function fetchFacebookPages() {
    if (pagesLoaded) return;
    try {
      const res = await fetch("/api/meta/pages");
      const data = await res.json();
      setFacebookPages(data.pages || []);
      setPagesLoaded(true);
      if (data.pages?.length > 0 && !campaignConfig.pageId) {
        setCampaignConfig((prev) => ({ ...prev, pageId: data.pages[0].id }));
      }
    } catch {
      setFacebookPages([]);
    }
  }

  async function fetchIntelligence() {
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: product.productName, description: product.description, platform: product.platform, country: product.country }),
      });
      const data = await res.json();
      setIntelligence(data);
      if (data.recommendedBudget) {
        setCampaignConfig((prev) => ({ ...prev, budgetDaily: data.recommendedBudget.suggested }));
      }
    } catch {
      //
    }
  }

  function next() {
    if (step === 1) { fetchMarket(); fetchIntelligence(); }
    if (step === 2) fetchTargeting();
    if (step === 3) fetchCopy();
    if (step === 4) { fetchPresell(); fetchFacebookPages(); }
    setStep((s) => Math.min(s + 1, STEP_NAMES.length));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const countryObj = COUNTRIES.find((c) => c.code === product.country);
  const presellSlug = presell.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") || "meu-produto";
  const presellUrl = `https://adsflow.${presellSlug}.com.br`;

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>

      <div style={cardStyle()}>

        {/* STEP 1: Produto */}
        {step === 1 && (
          <div>
            <h2 style={sectionTitle()}></h2>
            <p style={sectionSub()}>Informe os dados basicos do seu produto ou servico.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label style={labelStyle()}>Nome do Produto *</label>
                <input
                  style={inputStyle()}
                  placeholder="Ex: Curso de Trafego Pago"
                  value={product.productName}
                  onChange={(e) => setProduct({ ...product, productName: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle()}>Plataforma / Rede de Afiliados</label>
                <select
                  style={{ ...inputStyle(), cursor: "pointer", appearance: "none" as const, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B739E' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
                  value={product.platform}
                  onChange={(e) => setProduct({ ...product, platform: e.target.value })}
                >
                  <option value="">Selecione a plataforma</option>
                  <optgroup label="Brasil">
                    <option value="hotmart">Hotmart</option>
                    <option value="kiwify">Kiwify</option>
                    <option value="eduzz">Eduzz</option>
                    <option value="braip">Braip</option>
                    <option value="monetizze">Monetizze</option>
                    <option value="payt">Payt</option>
                    <option value="perfectpay">Perfect Pay</option>
                    <option value="lastlink">LastLink</option>
                  </optgroup>
                  <optgroup label="Internacional">
                    <option value="clickbank">ClickBank</option>
                    <option value="jvzoo">JVZoo</option>
                    <option value="warriorplus">WarriorPlus</option>
                    <option value="digistore24">Digistore24</option>
                    <option value="impact">Impact</option>
                    <option value="cj">CJ Affiliate</option>
                    <option value="shareasale">ShareASale</option>
                    <option value="awin">Awin</option>
                    <option value="webvork">Webvork</option>
                    <option value="admitad">Admitad</option>
                  </optgroup>
                  <optgroup label="Outros">
                    <option value="amazon">Amazon Associates</option>
                    <option value="mercadolivre">Mercado Livre Afiliados</option>
                    <option value="shopee">Shopee Afiliados</option>
                    <option value="proprio">Produto Proprio</option>
                    <option value="outro">Outra plataforma</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label style={labelStyle()}>Descricao</label>
                <textarea
                  style={{ ...inputStyle(), minHeight: 90, resize: "vertical" as const }}
                  placeholder="Descreva brevemente o produto..."
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle()}>Publico-Alvo</label>
                <input
                  style={inputStyle()}
                  placeholder="Ex: Empreendedores, 25-45 anos"
                  value={product.audience}
                  onChange={(e) => setProduct({ ...product, audience: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle()}>Pais</label>
                  <select
                    style={{ ...inputStyle(), cursor: "pointer", appearance: "none" as const, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B739E' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
                    value={product.country}
                    onChange={(e) => {
                      const code = e.target.value;
                      const countryData = COUNTRIES.find((c) => c.code === code);
                      const lang = countryData?.language || "pt";
                      setProduct({ ...product, country: code, language: lang });
                    }}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle()}>Idioma</label>
                  <input
                    style={inputStyle()}
                    placeholder="Detectado automaticamente"
                    value={product.language}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Analise de Mercado + Inteligencia */}
        {step === 2 && (
          <div>
            <h2 style={sectionTitle()}></h2>
            <p style={sectionSub()}>Inteligencia de mercado: concorrentes, busca por pais e investimento.</p>
            {loading && !intelligence ? (
              <div style={{ textAlign: "center" as const, padding: "56px 0" }}>
                <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTopColor: C.green1, borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
                <p style={{ color: C.muted, fontSize: 16, marginTop: 18 }}>Pesquisando mercado e concorrentes...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : intelligence ? (
              <MarketIntelligence data={intelligence as never} C={C} />
            ) : market ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {[
                    { value: String(market.score), label: "Score", color: market.score >= 75 ? C.green1 : market.score >= 50 ? "#F59E0B" : "#EF4444" },
                    { value: market.cpmEstimate, label: "CPM Est.", color: C.green2 },
                    { value: market.audienceSize, label: "Publico", color: C.text },
                  ].map((item, i) => (
                    <div key={i} style={{ background: C.bg, borderRadius: 14, padding: 24, textAlign: "center" as const }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                {market.recommendations.length > 0 && (
                  <div style={{ background: C.bg, borderRadius: 14, padding: 22 }}>
                    <div style={{ fontSize: 13, color: C.dim, marginBottom: 12 }}>Recomendacoes</div>
                    {market.recommendations.map((r, i) => (
                      <div key={i} style={{ fontSize: 15, color: C.muted, padding: "5px 0", display: "flex", gap: 10 }}>
                        <span style={{ color: C.green1 }}>&#8594;</span> {r}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => { fetchMarket(); fetchIntelligence(); }}
                  disabled={loading}
                  style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 20px", color: C.muted, fontSize: 14, cursor: "pointer", alignSelf: "flex-start" }}
                >
                  Reanalisar
                </button>
              </div>
            ) : (
              <p style={{ color: C.dim, textAlign: "center" as const, padding: "40px 0" }}>Erro ao carregar analise.</p>
            )}
          </div>
        )}

        {/* STEP 3: Segmentacao */}
        {step === 3 && (
          <div>
            <h2 style={sectionTitle()}></h2>
            {loading ? (
              <div style={{ textAlign: "center" as const, padding: "56px 0" }}>
                <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTopColor: C.green1, borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
                <p style={{ color: C.muted, fontSize: 16, marginTop: 18 }}>Gerando segmentacao automatica...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <p style={sectionSub()}>Segmentacao gerada automaticamente com base no seu produto e mercado.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <label style={{ ...labelStyle(), marginBottom: 0 }}>Palavras-chave</label>
                      <span style={{ fontSize: 12, color: C.green1, background: "rgba(34,176,125,0.12)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>Gerado por IA</span>
                    </div>
                    <textarea
                      style={{ ...inputStyle(), minHeight: 90, resize: "vertical" as const }}
                      value={targeting.keywords}
                      onChange={(e) => setTargeting({ ...targeting, keywords: e.target.value })}
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <label style={{ ...labelStyle(), marginBottom: 0 }}>Interesses</label>
                      <span style={{ fontSize: 12, color: C.green1, background: "rgba(34,176,125,0.12)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>Gerado por IA</span>
                    </div>
                    <textarea
                      style={{ ...inputStyle(), minHeight: 90, resize: "vertical" as const }}
                      value={targeting.interests}
                      onChange={(e) => setTargeting({ ...targeting, interests: e.target.value })}
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <label style={{ ...labelStyle(), marginBottom: 0 }}>Posicionamentos</label>
                      <span style={{ fontSize: 12, color: C.green1, background: "rgba(34,176,125,0.12)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>Gerado por IA</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
                      {PLACEMENTS.map((p) => {
                        const active = targeting.placements.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              setTargeting({
                                ...targeting,
                                placements: active ? targeting.placements.filter((x) => x !== p) : [...targeting.placements, p],
                              });
                            }}
                            style={{
                              padding: "10px 16px",
                              borderRadius: 10,
                              border: `1px solid ${active ? C.green1 : C.border}`,
                              background: active ? "rgba(34,176,125,0.12)" : C.bg,
                              color: active ? C.green2 : C.muted,
                              fontSize: 14,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <label style={{ ...labelStyle(), marginBottom: 0 }}>Estagio do Funil</label>
                      <span style={{ fontSize: 12, color: C.green1, background: "rgba(34,176,125,0.12)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>Sugerido</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                      {FUNNEL_STAGES.map((fs) => {
                        const active = targeting.funnelStage === fs.value;
                        return (
                          <button
                            key={fs.value}
                            onClick={() => setTargeting({ ...targeting, funnelStage: fs.value })}
                            style={{
                              padding: "14px 10px",
                              borderRadius: 12,
                              border: `1px solid ${active ? C.green1 : C.border}`,
                              background: active ? "rgba(34,176,125,0.12)" : C.bg,
                              color: active ? C.green2 : C.muted,
                              fontSize: 14,
                              fontWeight: 500,
                              cursor: "pointer",
                              textAlign: "center" as const,
                            }}
                          >
                            {fs.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4: Ad Copy */}
        {step === 4 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h2 style={sectionTitle()}></h2>
              <button
                onClick={fetchCopy}
                disabled={loading}
                style={{ background: "transparent", border: "none", color: C.green1, fontSize: 14, cursor: "pointer" }}
              >
                {loading ? "Gerando..." : "Gerar com IA"}
              </button>
            </div>
            <p style={sectionSub()}>Texto do seu anuncio no Meta Ads.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label style={labelStyle()}>Headline</label>
                <input style={inputStyle()} value={adCopy.headline} onChange={(e) => setAdCopy({ ...adCopy, headline: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle()}>Texto Principal</label>
                <textarea
                  style={{ ...inputStyle(), minHeight: 110, resize: "vertical" as const }}
                  value={adCopy.primaryText}
                  onChange={(e) => setAdCopy({ ...adCopy, primaryText: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle()}>Descricao</label>
                <input style={inputStyle()} value={adCopy.description} onChange={(e) => setAdCopy({ ...adCopy, description: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle()}>CTA</label>
                <select style={inputStyle()} value={adCopy.cta} onChange={(e) => setAdCopy({ ...adCopy, cta: e.target.value })}>
                  {CTA_OPTIONS.map((cta) => (
                    <option key={cta} value={cta}>{cta}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Criativo & Presell (Unificado) */}
        {step === 5 && (
          <CreativeStep
            product={product}
            adCopy={adCopy}
            presell={presell}
            onPresellChange={setPresell}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            creativeMode={creativeMode}
            onModeChange={setCreativeMode}
            loading={creativeLoading}
            onLoadingChange={setCreativeLoading}
          />
        )}

        {/* STEP 6: Config */}
        {step === 6 && (
          <div>
            <h2 style={sectionTitle()}></h2>
            <p style={sectionSub()}>Defina orcamento, publicacao e segmentacao avancada.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              {/* Facebook Page Selector */}
              <div>
                <label style={labelStyle()}>Facebook Page *</label>
                <p style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>Selecione a pagina do Facebook onde o anuncio sera publicado</p>
                {facebookPages.length > 0 ? (
                  <select
                    style={{ ...inputStyle(), cursor: "pointer", appearance: "none" as const, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B739E' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
                    value={campaignConfig.pageId}
                    onChange={(e) => setCampaignConfig({ ...campaignConfig, pageId: e.target.value })}
                  >
                    {facebookPages.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={fetchFacebookPages}
                    style={{ ...inputStyle(), cursor: "pointer", textAlign: "left" as const }}
                  >
                    📄 Buscar minhas paginas do Facebook...
                  </button>
                )}
              </div>

              {/* Orcamento */}
              <div>
                <label style={labelStyle()}>Orcamento Diario (R$)</label>
                <input
                  type="number"
                  style={inputStyle()}
                  min={5}
                  value={campaignConfig.budgetDaily}
                  onChange={(e) => setCampaignConfig({ ...campaignConfig, budgetDaily: Number(e.target.value) })}
                />
              </div>

              {intelligence?.recommendedBudget && (
                <div style={{ background: "rgba(139,92,246,0.08)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Recomendado pela IA</p>
                    {intelligence.selectedCountryName && (
                      <span style={{ fontSize: 11, color: C.muted, background: C.bg, padding: "3px 8px", borderRadius: 6 }}>
                        {COUNTRIES.find((c) => c.code === intelligence.selectedCountry)?.flag} {intelligence.selectedCountryName}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { label: "Conservador", value: intelligence.recommendedBudget.min, color: C.green1 },
                      { label: "Sugerido", value: intelligence.recommendedBudget.suggested, color: "#8B5CF6" },
                      { label: "Agressivo", value: intelligence.recommendedBudget.aggressive, color: C.orange },
                    ].map((rec) => (
                      <button
                        key={rec.label}
                        onClick={() => setCampaignConfig((prev) => ({ ...prev, budgetDaily: rec.value }))}
                        style={{
                          flex: 1,
                          padding: "10px 6px",
                          borderRadius: 8,
                          border: `1px solid ${campaignConfig.budgetDaily === rec.value ? rec.color : C.border}`,
                          background: campaignConfig.budgetDaily === rec.value ? "rgba(139,92,246,0.12)" : "transparent",
                          color: C.text,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "center" as const,
                        }}
                      >
                        <div style={{ color: rec.color, fontSize: 16, fontWeight: 700 }}>R${rec.value}</div>
                        <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{rec.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={labelStyle()}>Nivel de Orcamento</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {BUDGET_PREFS.map((bp) => {
                    const active = campaignConfig.budgetPref === bp.value;
                    return (
                      <button
                        key={bp.value}
                        onClick={() => setCampaignConfig({ ...campaignConfig, budgetPref: bp.value })}
                        style={{
                          padding: "14px 10px",
                          borderRadius: 12,
                          border: `1px solid ${active ? C.green1 : C.border}`,
                          background: active ? "rgba(34,176,125,0.12)" : C.bg,
                          color: active ? C.green2 : C.muted,
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "center" as const,
                        }}
                      >
                        {bp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Agendamento */}
              <div>
                <label style={labelStyle()}>Agendar Inicio (Opcional)</label>
                <p style={{ fontSize: 12, color: C.dim, marginBottom: 8 }}>Deixe vazio para iniciar manualmente depois de criar</p>
                <input
                  type="datetime-local"
                  style={inputStyle()}
                  value={campaignConfig.startTime}
                  onChange={(e) => setCampaignConfig({ ...campaignConfig, startTime: e.target.value })}
                />
              </div>

              {/* Segmentacao Avancada */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 16 }}>Segmentacao Avancada</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle()}>Cidades (opcional)</label>
                    <input
                      style={inputStyle()}
                      placeholder="Ex: Sao Paulo, Rio de Janeiro, Belo Horizonte"
                      value={campaignConfig.targetCities}
                      onChange={(e) => setCampaignConfig({ ...campaignConfig, targetCities: e.target.value })}
                    />
                    <p style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>Separe por virgula. Se vazio, usa o pais inteiro.</p>
                  </div>
                  <div>
                    <label style={labelStyle()}>Estados/Regioes (opcional)</label>
                    <input
                      style={inputStyle()}
                      placeholder="Ex: Sao Paulo, Minas Gerais, Rio de Janeiro"
                      value={campaignConfig.targetRegions}
                      onChange={(e) => setCampaignConfig({ ...campaignConfig, targetRegions: e.target.value })}
                    />
                    <p style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>Separe por virgula. Funciona junto com cidades.</p>
                  </div>
                </div>
              </div>

              {/* Split de Dispositivos */}
              <div>
                <label style={labelStyle()}>Split de Dispositivos</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ background: C.bg, borderRadius: 14, padding: 24, textAlign: "center" as const }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.green1 }}>70%</div>
                    <div style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>Mobile</div>
                  </div>
                  <div style={{ background: C.bg, borderRadius: 14, padding: 24, textAlign: "center" as const }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.muted }}>30%</div>
                    <div style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>Desktop</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Revisao */}
        {step === 7 && (
          <div>
            <h2 style={sectionTitle()}>Revisao da Campanha</h2>
            <p style={sectionSub()}>Analise completa antes de publicar.</p>

            <CampaignAudit data={{
              productName: product.productName,
              description: product.description,
              audience: product.audience,
              funnelStage: targeting.funnelStage,
              budgetPref: campaignConfig.budgetPref,
              country: product.country,
              keywords: targeting.keywords.split(",").map((k) => k.trim()).filter(Boolean),
              interests: targeting.interests.split(",").map((i) => i.trim()).filter(Boolean),
              placements: targeting.placements,
              budgetDaily: campaignConfig.budgetDaily,
              adCopy,
              presell: { ...presell, slug: presellSlug },
              selectedImage,
              creativeMode,
              intelligence: intelligence as { recommendedBudget?: { min: number; suggested: number; aggressive: number }; topCountries?: { code: string; name: string; competitionLevel: string; cpmEstimate: number }[] } | null,
            }} />

            <div style={{ background: C.bg, borderRadius: 14, padding: 24, marginTop: 20 }}>
              {[
                { label: "Produto", value: product.productName || "—" },
                { label: "Pais", value: countryObj?.name ?? product.country },
                { label: "Publico", value: product.audience || "—" },
                { label: "Funil", value: FUNNEL_STAGES.find((f) => f.value === targeting.funnelStage)?.label || targeting.funnelStage },
                { label: "Headline", value: adCopy.headline || "—" },
                { label: "CTA", value: adCopy.cta || "—" },
                { label: "Presell", value: presellUrl },
                { label: "Link Afiliado", value: presell.affiliateLink || "—" },
                { label: "Orcamento", value: `R$ ${campaignConfig.budgetDaily}/dia` },
                { label: "Facebook Page", value: facebookPages.find((p) => p.id === campaignConfig.pageId)?.name || campaignConfig.pageId || "Nao selecionada" },
                { label: "Agendar para", value: campaignConfig.startTime ? new Date(campaignConfig.startTime).toLocaleString("pt-BR") : "Manual" },
                ...(campaignConfig.targetCities ? [{ label: "Cidades", value: campaignConfig.targetCities }] : []),
                ...(campaignConfig.targetRegions ? [{ label: "Regioes", value: campaignConfig.targetRegions }] : []),
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}`, gap: 16 }}>
                  <span style={{ fontSize: 14, color: C.dim, flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text, textAlign: "right", wordBreak: "break-all" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Criar Campanha - Progresso Animado */}
        {step === 8 && (
          <div>
            <div style={{ textAlign: "center" as const, padding: "40px 0 28px" }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(34,176,125,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 44 }}>
                {launchResult ? "✅" : "🚀"}
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 10 }}>
                {launchResult ? (launchResult.id && launchResult.id !== "local" ? "Campanha Criada!" : "Campanha Salva!") : "Criando sua Campanha..."}
              </h2>
              <p style={{ color: C.muted, fontSize: 16, maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.6 }}>
                {launchResult ? "Tudo pronto! Veja abaixo os detalhes da sua campanha." : "Aguarde enquanto preparamos tudo para voce."}
              </p>
            </div>

            {/* Progress Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: launchResult ? 28 : 0 }}>
              {(launchResult ? progressSteps : progressSteps.filter((_, i) => i <= currentProgress)).map((stepItem, i) => {
                const isDone = launchResult || i < currentProgress;
                const isActive = !launchResult && i === currentProgress;
                return (
                  <div key={i} style={{ display: "flex", gap: 16, minHeight: 64 }}>
                    {/* Vertical line connector */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: isDone ? "rgba(34,176,125,0.18)" : isActive ? "rgba(59,130,246,0.18)" : "rgba(75,85,120,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all 0.4s ease",
                        boxShadow: isActive ? "0 0 20px rgba(59,130,246,0.25)" : isDone ? "0 0 12px rgba(34,176,125,0.2)" : "none",
                      }}>
                        {isDone ? (
                          <span style={{ color: C.green1, fontSize: 18 }}>✓</span>
                        ) : isActive ? (
                          <div style={{ width: 16, height: 16, border: `2px solid #3B82F6`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                        ) : (
                          <span style={{ color: C.dim, fontSize: 14, fontWeight: 600 }}>{i + 1}</span>
                        )}
                      </div>
                      {i < (launchResult ? progressSteps.length - 1 : currentProgress) && (
                        <div style={{
                          width: 2, flex: 1, minHeight: 20,
                          background: isDone ? "rgba(34,176,125,0.3)" : "rgba(75,85,120,0.15)",
                          transition: "background 0.4s ease",
                        }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ paddingBottom: i < progressSteps.length - 1 ? 20 : 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: isDone ? C.text : isActive ? "#60A5FA" : C.dim, marginBottom: 3, transition: "color 0.3s" }}>
                        {stepItem.title}
                      </div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                        {stepItem.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Success Card */}
            {launchResult && (
              <div style={{ background: C.bg, borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, animation: "fadeUp 0.5s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    🎯
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Campanha "{launchResult.productName}" criada!</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{launchResult.cpmEstimate ? `CPM estimado: $${launchResult.cpmEstimate}` : "Pronta para publicar"}</div>
                  </div>
                </div>

                <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: C.dim, marginBottom: 6, fontWeight: 600 }}>PRESELL</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.green2, fontFamily: "monospace", wordBreak: "break-all" }}>{presellUrl}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Cole este link como URL de destino no Meta Ads Manager.</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                  <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 6, fontWeight: 600 }}>COPY</div>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{adCopy.headline}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{adCopy.primaryText.slice(0, 100)}...</div>
                  </div>
                  <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 6, fontWeight: 600 }}>SEGMENTACAO</div>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{countryObj?.name || product.country}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{targeting.interests?.slice(0, 60) || "Interesses gerais"}</div>
                  </div>
                </div>

                <div style={{ background: "rgba(34,176,125,0.08)", borderRadius: 12, padding: 16, border: `1px solid rgba(34,176,125,0.2)` }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.green1, marginBottom: 6 }}>
                    {launchResult.id && launchResult.id !== "local" ? "Campanha criada no banco de dados" : "Campanha salva localmente"}
                  </div>
                  <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
                    Escolha a plataforma para publicar, ou feche e publique depois.
                  </div>
                </div>

                {/* Platform Selector */}
                <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 16 }}>
                  <button onClick={() => setPublishPlatform("meta")} style={{ flex: 1, padding: "14px 16px", background: publishPlatform === "meta" ? "rgba(59,130,246,0.15)" : C.card, border: `2px solid ${publishPlatform === "meta" ? "#3B82F6" : C.border}`, borderRadius: 12, cursor: "pointer", textAlign: "center" as const }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>📱</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: publishPlatform === "meta" ? "#60A5FA" : C.text }}>Meta Ads</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Facebook / Instagram</div>
                  </button>
                  <button onClick={() => setPublishPlatform("google")} style={{ flex: 1, padding: "14px 16px", background: publishPlatform === "google" ? "rgba(34,176,125,0.15)" : C.card, border: `2px solid ${publishPlatform === "google" ? C.green1 : C.border}`, borderRadius: 12, cursor: "pointer", textAlign: "center" as const }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>🔍</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: publishPlatform === "google" ? C.green1 : C.text }}>Google Ads</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Search Network</div>
                  </button>
                </div>

                {publishError && (
                  <div style={{ background: "rgba(248,113,113,0.08)", borderRadius: 12, padding: 16, border: `1px solid rgba(248,113,113,0.25)`, marginTop: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#F87171", marginBottom: 4 }}>Erro ao publicar</div>
                    <div style={{ fontSize: 13, color: "#F87171", opacity: 0.85, lineHeight: 1.5 }}>{publishError}</div>
                  </div>
                )}

                {publishSuccess && (
                  <div style={{ background: "rgba(34,176,125,0.12)", borderRadius: 12, padding: 16, border: `1px solid rgba(34,176,125,0.3)`, marginTop: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#22B07D" }}>
                      {adsManagerUrl
                        ? "Campanha e AdSet criados no Meta!"
                        : "Campanha publicada no Meta com sucesso!"}
                    </div>
                    {adsManagerUrl && (
                      <div style={{ fontSize: 13, color: "#8C93B8", marginTop: 6, lineHeight: 1.5 }}>
                        Finalize o criativo (anuncio visual) no Ads Manager:
                        <a href={adsManagerUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginLeft: 8, padding: "6px 14px", background: "#22B07D", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
                          Abrir Ads Manager
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {googlePublishError && (
                  <div style={{ background: "rgba(248,113,113,0.08)", borderRadius: 12, padding: 16, border: `1px solid rgba(248,113,113,0.25)`, marginTop: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#F87171", marginBottom: 4 }}>Erro ao publicar no Google</div>
                    <div style={{ fontSize: 13, color: "#F87171", opacity: 0.85, lineHeight: 1.5 }}>{googlePublishError}</div>
                  </div>
                )}

                {googlePublishSuccess && (
                  <div style={{ background: "rgba(34,176,125,0.12)", borderRadius: 12, padding: 16, border: `1px solid rgba(34,176,125,0.3)`, marginTop: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#22B07D" }}>
                      Campanha publicada no Google Ads com sucesso!
                    </div>
                    <div style={{ fontSize: 13, color: "#8C93B8", marginTop: 6, lineHeight: 1.5 }}>
                      Campanha criada e pausada. Acesse o Google Ads para ativar e monitorar.
                    </div>
                  </div>
                )}

                {/* Google Ads Data Panel for manual copy */}
                {publishPlatform === "google" && (
                  <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}`, marginTop: 16 }}>
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 8, fontWeight: 600 }}>DADOS PARA GOOGLE ADS (copie e cole)</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { label: "Budget Diario", value: `R$ ${campaignConfig.budgetDaily || 20}/dia` },
                        { label: "Pais", value: countryObj?.name || product.country },
                        { label: "Headline 1", value: adCopy.headline || "—" },
                        { label: "Texto Principal", value: adCopy.primaryText?.slice(0, 90) || "—" },
                        { label: "CTA", value: adCopy.cta || "Saiba Mais" },
                        { label: "URL Destino", value: presellUrl || presell.affiliateLink || "—" },
                        { label: "Palavras-chave", value: targeting.keywords || "—" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, gap: 12 }}>
                          <span style={{ fontSize: 12, color: C.dim, flexShrink: 0 }}>{item.label}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.text, textAlign: "right" as const, wordBreak: "break-all" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <a href="https://ads.google.com/aw/campaigns/new" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center" as const, marginTop: 14, padding: "12px 20px", background: `linear-gradient(90deg, ${C.green1}, ${C.green2})`, color: C.bg, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                      🔗 Abrir Google Ads Manager
                    </a>
                  </div>
                )}
              </div>
            )}

            <style>{`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {step <= STEP_NAMES.length && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button
            onClick={back}
            disabled={step === 1}
            style={{
              padding: "14px 32px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              color: C.muted,
              fontSize: 16,
              fontWeight: 500,
              cursor: step === 1 ? "not-allowed" : "pointer",
              opacity: step === 1 ? 0.3 : 1,
            }}
          >
            &#8592; Voltar
          </button>
          <button
            onClick={step === STEP_NAMES.length - 1 ? handleLaunch : step === 8 ? (publishPlatform === "google" && launchResult?.id && launchResult.id !== "local" ? handlePublishGoogle : handlePublish) : next}
            disabled={loading || (step === 1 && !product.productName)}
            style={{
              padding: "14px 36px",
              background: loading ? "#6D28D9" : `linear-gradient(90deg,${C.green1},${C.green2})`,
              color: C.bg,
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: loading || (step === 1 && !product.productName) ? "not-allowed" : "pointer",
              opacity: loading || (step === 1 && !product.productName) ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: C.bg, borderRadius: "50%", animation: "spin 1s linear infinite", display: "inline-block" }} />
                Processando...
              </>
            ) : step === 7 ? (
              "Criar Campanha"
            ) : step === 8 ? (
              launchResult?.id && launchResult.id !== "local"
                ? (publishPlatform === "google" ? "Publicar no Google" : "Publicar no Meta")
                : "Fechar"
            ) : (
              "Proximo"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
