"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";

const C = {
  bg: "#080B14",
  card: "#121830",
  cardAlt: "#0F1626",
  border: "#232C52",
  green1: "#22B07D",
  green2: "#3FCB92",
  purple: "#8B5CF6",
  text: "#F3F5FF",
  muted: "#8C93B8",
  dim: "#5B628A",
};

interface CreativeStepProps {
  product: { productName: string; description: string; audience: string };
  adCopy: { headline: string; primaryText: string; description: string; cta: string };
  presell: {
    slug: string;
    title: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    affiliateLink: string;
    videoUrl: string;
    bgColor: string;
    accentColor: string;
    textColor: string;
  };
  onPresellChange: (presell: CreativeStepProps["presell"]) => void;
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
  creativeMode: "ai" | "template" | null;
  onModeChange: (mode: "ai" | "template") => void;
  loading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

const STYLES = ["Moderno", "Bold", "Elegante", "Divertido", "Corporativo"] as const;
const FORMATS = [
  { key: "feed" as const, label: "Feed", w: 1080, h: 1080, preview: { w: 300, h: 300 } },
  { key: "link" as const, label: "Link", w: 1200, h: 628, preview: { w: 300, h: 160 } },
  { key: "stories" as const, label: "Stories", w: 1080, h: 1920, preview: { w: 180, h: 320 } },
];

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

function sectionTitle(): React.CSSProperties {
  return { fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 6 };
}

function sectionSub(): React.CSSProperties {
  return { color: C.muted, fontSize: 16, marginBottom: 28 };
}

export default function CreativeStep({
  product,
  adCopy,
  presell,
  onPresellChange,
  selectedImage,
  onImageSelect,
  creativeMode,
  onModeChange,
  loading,
  onLoadingChange,
}: CreativeStepProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  const [aiStyle, setAiStyle] = useState<string>("Moderno");
  const [aiImages, setAiImages] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [bannerFormat, setBannerFormat] = useState<"feed" | "link" | "stories">("feed");
  const [bannerHeadline, setBannerHeadline] = useState("");
  const [bannerSub, setBannerSub] = useState("");
  const [bannerCta, setBannerCta] = useState("Saiba Mais");
  const [bannerBg, setBannerBg] = useState("#080B14");
  const [bannerAccent, setBannerAccent] = useState("#8B5CF6");
  const [bannerText, setBannerText] = useState("#F3F5FF");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentFormat = FORMATS.find((f) => f.key === bannerFormat)!;
  const presellUrl = `adshflow.com/p/${presell.slug || "meu-produto"}`;

  const handleGenerateAI = useCallback(async () => {
    onLoadingChange(true);
    setAiLoading(true);
    setAiError("");
    setAiImages([]);
    try {
      const res = await fetch("/api/generate-creative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          description: product.description,
          audience: product.audience,
          style: aiStyle,
        }),
      });

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("image/")) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setAiImages([blobUrl]);
        onImageSelect(blobUrl);
      } else {
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          setAiImages(data.images);
          onImageSelect(data.images[0]);
        } else {
          setAiError(data.error || "Nenhuma imagem foi gerada.");
        }
      }
    } catch {
      setAiError("Erro ao gerar criativos. Verifique sua conexao.");
    } finally {
      setAiLoading(false);
      onLoadingChange(false);
    }
  }, [product, aiStyle, onLoadingChange]);

  const handleDownloadBanner = useCallback(async () => {
    if (!bannerRef.current) return;
    setDownloadLoading(true);
    setDownloadSuccess(false);
    try {
      const dataUrl = await toPng(bannerRef.current, { quality: 0.95, pixelRatio: 2 });
      onImageSelect(dataUrl);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      // silent
    } finally {
      setDownloadLoading(false);
    }
  }, [onImageSelect]);

  return (
    <div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .creative-input:focus { border-color: ${C.green1} !important; }
      `}</style>

      <h2 style={sectionTitle()}>Criativo & Presell</h2>
      <p style={sectionSub()}>Gere a imagem do anuncio e configure a pagina de pre-venda.</p>

      {/* ─── MODE SELECTION ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {([
          { mode: "ai" as const, icon: "🎨", title: "Gerar com IA (DALL-E)", desc: "Imagens unicas geradas por inteligencia artificial" },
          { mode: "template" as const, icon: "🖼️", title: "Template Banner", desc: "Banners editaveis com templates prontos" },
        ]).map(({ mode, icon, title, desc }) => {
          const active = creativeMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              style={{
                padding: "24px 20px",
                borderRadius: 16,
                border: `2px solid ${active ? C.green1 : C.border}`,
                background: active ? "rgba(34,176,125,0.08)" : C.card,
                cursor: "pointer",
                textAlign: "center" as const,
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: active ? C.green2 : C.text, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{desc}</div>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────
          SECTION 1: CREATIVE
         ─────────────────────────────────────────────── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "clamp(24px, 3vw, 40px)", marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>Criativo</h3>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Imagem do anuncio que aparecera no feed.</p>

        {/* ── AI MODE ── */}
        {creativeMode === "ai" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle()}>Estilo Visual</label>
              <select
                style={{ ...inputStyle(), cursor: "pointer" }}
                value={aiStyle}
                onChange={(e) => setAiStyle(e.target.value)}
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={aiLoading}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 12,
                border: "none",
                background: aiLoading ? C.cardAlt : `linear-gradient(135deg, ${C.green1}, ${C.purple})`,
                color: C.text,
                fontSize: 16,
                fontWeight: 700,
                cursor: aiLoading ? "wait" : "pointer",
                marginBottom: 24,
                opacity: aiLoading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {aiLoading ? "Gerando..." : "Gerar Criativo"}
            </button>

            {aiLoading && (
              <div style={{ textAlign: "center" as const, padding: "48px 0" }}>
                <div style={{ width: 44, height: 44, border: `3px solid ${C.border}`, borderTopColor: C.green1, borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
                <p style={{ color: C.muted, fontSize: 15, marginTop: 18 }}>Gerando criativo com IA...</p>
              </div>
            )}

            {aiError && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <p style={{ color: "#EF4444", fontSize: 14 }}>{aiError}</p>
              </div>
            )}

            {aiImages.length > 0 && !aiLoading && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: aiImages.length === 1 ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {aiImages.map((img, i) => {
                    const isSelected = selectedImage === img;
                    return (
                      <button
                        key={i}
                        onClick={() => onImageSelect(img)}
                        style={{
                          position: "relative" as const,
                          borderRadius: 14,
                          border: `2px solid ${isSelected ? C.green1 : C.border}`,
                          background: C.bg,
                          overflow: "hidden",
                          cursor: "pointer",
                          padding: 0,
                          transition: "border-color 0.2s, transform 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = C.dim; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = C.border; }}
                      >
                        <img
                          src={img}
                          alt={`Criativo ${i + 1}`}
                          style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                        />
                        {isSelected && (
                          <div style={{
                            position: "absolute" as const,
                            top: 10,
                            right: 10,
                            background: C.green1,
                            color: "#000",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: 6,
                            letterSpacing: 0.5,
                          }}>
                            SELECIONADO
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedImage && aiImages.includes(selectedImage) && (
                  <div style={{ marginBottom: 20, textAlign: "center" as const }}>
                    <div style={{ fontSize: 13, color: C.dim, marginBottom: 8 }}>Imagem selecionada</div>
                    <img
                      src={selectedImage}
                      alt="Selecionada"
                      style={{ width: 240, borderRadius: 12, border: `2px solid ${C.green1}` }}
                    />
                  </div>
                )}

                <button
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  style={{
                    width: "100%",
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: "transparent",
                    color: C.muted,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.green1; e.currentTarget.style.color = C.green2; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                >
                  Gerar novamente
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TEMPLATE MODE ── */}
        {creativeMode === "template" && (
          <div>
            {/* Format selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle()}>Formato</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {FORMATS.map((f) => {
                  const active = bannerFormat === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setBannerFormat(f.key)}
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
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>{f.label}</div>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{f.w}×{f.h}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 24 }}>
              <div>
                <label style={labelStyle()}>Headline do Banner</label>
                <input
                  style={{ ...inputStyle(), cursor: "text" }}
                  value={bannerHeadline}
                  onChange={(e) => setBannerHeadline(e.target.value)}
                  placeholder="Ex: Transforme seu negocio"
                />
              </div>
              <div>
                <label style={labelStyle()}>Subtitulo</label>
                <input
                  style={{ ...inputStyle(), cursor: "text" }}
                  value={bannerSub}
                  onChange={(e) => setBannerSub(e.target.value)}
                  placeholder="Ex: Descubra a solucao definitiva"
                />
              </div>
              <div>
                <label style={labelStyle()}>Texto do CTA</label>
                <input
                  style={{ ...inputStyle(), cursor: "text" }}
                  value={bannerCta}
                  onChange={(e) => setBannerCta(e.target.value)}
                  placeholder="Ex: Saiba Mais"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle()}>Cor de fundo</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: bannerBg, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                    <input
                      style={{ ...inputStyle(), cursor: "text", flex: 1, minWidth: 0 }}
                      value={bannerBg}
                      onChange={(e) => setBannerBg(e.target.value)}
                      placeholder="#080B14"
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle()}>Cor destaque</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: bannerAccent, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                    <input
                      style={{ ...inputStyle(), cursor: "text", flex: 1, minWidth: 0 }}
                      value={bannerAccent}
                      onChange={(e) => setBannerAccent(e.target.value)}
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle()}>Cor do texto</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: bannerText, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                    <input
                      style={{ ...inputStyle(), cursor: "text", flex: 1, minWidth: 0 }}
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      placeholder="#F3F5FF"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 12 }}>Preview ao vivo</div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  ref={bannerRef}
                  id="banner-preview"
                  style={{
                    width: currentFormat.preview.w,
                    height: currentFormat.preview.h,
                    borderRadius: 12,
                    overflow: "hidden",
                    position: "relative" as const,
                    background: bannerBg,
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                  }}
                >
                  {/* Gradient orbs */}
                  <div style={{
                    position: "absolute" as const,
                    top: -40,
                    right: -40,
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${bannerAccent}44 0%, transparent 70%)`,
                    filter: "blur(30px)",
                  }} />
                  <div style={{
                    position: "absolute" as const,
                    bottom: -30,
                    left: -30,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${C.green1}44 0%, transparent 70%)`,
                    filter: "blur(25px)",
                  }} />

                  {/* Badge */}
                  <div style={{
                    fontSize: bannerFormat === "stories" ? 9 : 8,
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: "uppercase" as const,
                    color: bannerAccent,
                    marginBottom: bannerFormat === "stories" ? 14 : 10,
                    zIndex: 1,
                  }}>
                    {product.productName || "SEU PRODUTO"}
                  </div>

                  {/* Headline */}
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: bannerFormat === "stories" ? 18 : bannerFormat === "link" ? 13 : 16,
                    fontWeight: 700,
                    color: bannerText,
                    textAlign: "center" as const,
                    lineHeight: 1.2,
                    marginBottom: bannerFormat === "stories" ? 10 : 6,
                    zIndex: 1,
                    maxWidth: "90%",
                  }}>
                    {bannerHeadline || "Headline do Banner"}
                  </div>

                  {/* Sub */}
                  <div style={{
                    fontSize: bannerFormat === "stories" ? 11 : 9,
                    color: `${bannerText}aa`,
                    textAlign: "center" as const,
                    lineHeight: 1.4,
                    marginBottom: bannerFormat === "stories" ? 18 : 12,
                    zIndex: 1,
                    maxWidth: "85%",
                  }}>
                    {bannerSub || "Subtitulo do banner"}
                  </div>

                  {/* CTA */}
                  <div style={{
                    padding: bannerFormat === "stories" ? "10px 24px" : "8px 18px",
                    background: bannerAccent,
                    color: bannerBg,
                    borderRadius: 8,
                    fontSize: bannerFormat === "stories" ? 11 : 9,
                    fontWeight: 700,
                    zIndex: 1,
                    letterSpacing: 0.3,
                  }}>
                    {bannerCta || "Saiba Mais"}
                  </div>
                </div>
              </div>
            </div>

            {/* Download */}
            <button
              onClick={handleDownloadBanner}
              disabled={downloadLoading}
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                border: "none",
                background: downloadSuccess
                  ? C.green1
                  : `linear-gradient(135deg, ${C.green1}, ${C.green2})`,
                color: "#000",
                fontSize: 15,
                fontWeight: 700,
                cursor: downloadLoading ? "wait" : "pointer",
                opacity: downloadLoading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {downloadLoading ? "Baixando..." : downloadSuccess ? "Banner salvo!" : "Baixar Banner"}
            </button>
          </div>
        )}

        {creativeMode === null && (
          <div style={{ textAlign: "center" as const, padding: "40px 0" }}>
            <p style={{ color: C.muted, fontSize: 15 }}>Selecione um modo acima para comecar.</p>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────
          SECTION 2: PRESELL CONFIG
         ─────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>Configuracao da Presell</h3>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Configure a pagina de pre-venda que o visitante vera.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Link preview */}
          <div style={{ background: C.bg, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 6 }}>Link da presell</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.green2, fontFamily: "monospace", wordBreak: "break-all" }}>
              {presellUrl}
            </div>
          </div>

          {/* Slug + Title */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div>
              <label style={labelStyle()}>Slug</label>
              <input
                style={{ ...inputStyle(), cursor: "text" }}
                placeholder="meu-produto"
                value={presell.slug}
                onChange={(e) => onPresellChange({ ...presell, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              />
            </div>
            <div>
              <label style={labelStyle()}>Titulo</label>
              <input
                style={{ ...inputStyle(), cursor: "text" }}
                value={presell.title}
                onChange={(e) => onPresellChange({ ...presell, title: e.target.value })}
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <label style={labelStyle()}>Headline da Pagina</label>
            <input
              style={{ ...inputStyle(), cursor: "text" }}
              value={presell.headline}
              onChange={(e) => onPresellChange({ ...presell, headline: e.target.value })}
            />
          </div>

          {/* Subheadline */}
          <div>
            <label style={labelStyle()}>Subheadline</label>
            <textarea
              style={{ ...inputStyle(), cursor: "text", minHeight: 80, resize: "vertical" as const }}
              value={presell.subheadline}
              onChange={(e) => onPresellChange({ ...presell, subheadline: e.target.value })}
            />
          </div>

          {/* Affiliate link */}
          <div>
            <label style={labelStyle()}>Link de Afiliado *</label>
            <input
              style={{
                ...inputStyle(),
                cursor: "text",
                borderColor: !presell.affiliateLink ? "rgba(239,68,68,0.5)" : C.border,
              }}
              placeholder="https://exemplo.com/afiliado/seu-id"
              value={presell.affiliateLink}
              onChange={(e) => onPresellChange({ ...presell, affiliateLink: e.target.value })}
            />
            {!presell.affiliateLink && (
              <div style={{ fontSize: 13, color: "#EF4444", marginTop: 6 }}>
                O link de afiliado e obrigatorio para publicar a presell.
              </div>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label style={labelStyle()}>Video da Presell (opcional)</label>
            <input
              style={{ ...inputStyle(), cursor: "text" }}
              placeholder="https://youtube.com/watch?v=... ou https://exemplo.com/video.mp4"
              value={presell.videoUrl}
              onChange={(e) => onPresellChange({ ...presell, videoUrl: e.target.value })}
            />
          </div>

          {/* Color pickers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle()}>Cor de fundo</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: presell.bgColor, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                <input
                  style={{ ...inputStyle(), cursor: "text", flex: 1, minWidth: 0 }}
                  value={presell.bgColor}
                  onChange={(e) => onPresellChange({ ...presell, bgColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle()}>Cor destaque</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: presell.accentColor, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                <input
                  style={{ ...inputStyle(), cursor: "text", flex: 1, minWidth: 0 }}
                  value={presell.accentColor}
                  onChange={(e) => onPresellChange({ ...presell, accentColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle()}>Cor do texto</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: presell.textColor, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                <input
                  style={{ ...inputStyle(), cursor: "text", flex: 1, minWidth: 0 }}
                  value={presell.textColor}
                  onChange={(e) => onPresellChange({ ...presell, textColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ── PRESELL LIVE PREVIEW ── */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginBottom: 12 }}>Preview da Presell</div>
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {/* Browser chrome */}
              <div style={{ background: "#1A2333", padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B5CF6" }} />
                <span style={{ marginLeft: 12, fontSize: 12, color: C.dim }}>{presellUrl}</span>
              </div>
              {/* Page content */}
              <div style={{
                background: presell.bgColor,
                color: presell.textColor,
                padding: "clamp(32px, 5vw, 56px) clamp(24px, 4vw, 40px)",
                textAlign: "center" as const,
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 2,
                  color: presell.accentColor,
                  textTransform: "uppercase" as const,
                  marginBottom: 16,
                }}>
                  {presell.title || product.productName}
                </div>
                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 700,
                  color: presell.textColor,
                  marginBottom: 16,
                  lineHeight: 1.2,
                }}>
                  {presell.headline || "Headline da presell"}
                </h1>
                <p style={{
                  fontSize: 16,
                  color: `${presell.textColor}cc`,
                  maxWidth: 480,
                  margin: "0 auto 32px",
                  lineHeight: 1.6,
                }}>
                  {presell.subheadline || "Subheadline da presell"}
                </p>

                {presell.videoUrl && (
                  <div style={{ marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>
                    {presell.videoUrl.includes("youtube.com") || presell.videoUrl.includes("youtu.be") ? (
                      <div style={{ position: "relative" as const, paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12 }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${presell.videoUrl.includes("youtu.be") ? presell.videoUrl.split("youtu.be/")[1]?.split("?")[0] : presell.videoUrl.split("v=")[1]?.split("&")[0]}`}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 12 }}
                          allowFullScreen
                        />
                      </div>
                    ) : presell.videoUrl.includes("vimeo.com") ? (
                      <div style={{ position: "relative" as const, paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12 }}>
                        <iframe
                          src={`https://player.vimeo.com/video/${presell.videoUrl.split("vimeo.com/")[1]?.split("?")[0]}`}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 12 }}
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video
                        controls
                        style={{ width: "100%", borderRadius: 12, maxHeight: 320, background: "#000" }}
                        src={presell.videoUrl}
                      />
                    )}
                  </div>
                )}

                <a
                  href={presell.affiliateLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "inline-block",
                    padding: "16px 40px",
                    background: presell.accentColor,
                    color: presell.bgColor,
                    borderRadius: 12,
                    fontSize: 17,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                >
                  {presell.ctaText || "Saiba Mais"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
