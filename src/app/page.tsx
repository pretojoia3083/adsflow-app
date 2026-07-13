"use client";

import React, { useState } from "react";

const C = {
  bg: "#0B0F17",
  panel: "#121826",
  panelAlt: "#1A2333",
  border: "#232D40",
  accent: "#6366F1",
  accentSoft: "rgba(99,102,241,0.15)",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#F87171",
  text: "#F1F5F9",
  dim: "#8B96A8",
};

const SCORE_COLOR = (score: number) =>
  score >= 75 ? C.green : score >= 50 ? C.amber : C.red;

const FUNNEL_STAGES = [
  { id: "topo", label: "Topo de funil", desc: "Descoberta" },
  { id: "meio", label: "Meio de funil", desc: "Consideracao" },
  { id: "fundo", label: "Fundo de funil", desc: "Decisao" },
];

const AFFILIATE_NETWORKS = [
  { id: "hotmart", name: "Hotmart", tag: "Infoproduto" },
  { id: "kiwify", name: "Kiwify", tag: "Infoproduto" },
  { id: "eduzz", name: "Eduzz", tag: "Infoproduto" },
  { id: "monetizze", name: "Monetizze", tag: "Infoproduto/Fisico" },
  { id: "braip", name: "Braip", tag: "Recorrencia/Fisico" },
  { id: "clickbank", name: "ClickBank", tag: "Global" },
  { id: "amazon", name: "Amazon Associados", tag: "E-commerce" },
  { id: "shopee", name: "Shopee Afiliados", tag: "E-commerce" },
];

const TEMPLATES: Record<string, Array<{ id: string; label: string; desc: string }>> = {
  topo: [
    { id: "advertorial", label: "Advertorial / Noticia", desc: "Formato de materia, alto engajamento" },
    { id: "quiz", label: "Quiz interativo", desc: "Engaja e qualifica antes de mostrar a oferta" },
  ],
  meio: [
    { id: "comparacao", label: "Comparacao", desc: "Produto vs concorrentes" },
    { id: "depoimentos", label: "Depoimentos", desc: "Prova social pra vencer objecoes" },
  ],
  fundo: [
    { id: "contagem", label: "Contagem regressiva", desc: "Urgencia/escassez pra fechar a venda" },
    { id: "depoimentos", label: "Depoimentos", desc: "Reforco de confianca antes do checkout" },
  ],
};

function Spinner({ label }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.dim, fontSize: 13 }}>
      <div
        style={{
          width: 16,
          height: 16,
          border: `2px solid ${C.border}`,
          borderTopColor: C.accent,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {label}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const size = 52;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = SCORE_COLOR(score);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={C.border} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", fontWeight: 800, fontSize: 13, color,
        }}
      >
        {score}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["Produto", "Mercado", "Presell", "Anuncios", "Campanha"];
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 22, flexWrap: "wrap" }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, flex: "1 1 auto", minWidth: 60 }}>
            <div
              style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800,
                flexShrink: 0, background: done ? C.green : active ? C.accent : C.panelAlt,
                color: done || active ? "#fff" : C.dim,
                border: `1px solid ${done ? C.green : active ? C.accent : C.border}`,
              }}
            >
              {done ? "✓" : n}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: active ? C.text : C.dim, whiteSpace: "nowrap" }}>
              {label}
            </span>
            {n < steps.length && <div style={{ flex: 1, height: 1, background: C.border, minWidth: 8 }} />}
          </div>
        );
      })}
    </div>
  );
}

const MOCK_MARKETS = [
  { country: "Brasil", countryCode: "BR", flag: "🇧🇷", demandScore: 92, competitionLevel: "media" as const, suggestedLanguage: "Portugues", estimatedCpm: "$2-5", reasoning: "Maior mercado de infoprodutos da America Latina. Publico altamente receptivo a ofertas digitais." },
  { country: "Estados Unidos", countryCode: "US", flag: "🇺🇸", demandScore: 88, competitionLevel: "alta" as const, suggestedLanguage: "English", estimatedCpm: "$6-12", reasoning: "Maior mercado de afiliados do mundo. Alta competicao mas enorme potencial de conversao." },
  { country: "Mexico", countryCode: "MX", flag: "🇲🇽", demandScore: 78, competitionLevel: "baixa" as const, suggestedLanguage: "Espanhol", estimatedCpm: "$1-3", reasoning: "Mercado em crescimento rapido com baixa concorrencia. Custo de midia muito acessivel." },
  { country: "Portugal", countryCode: "PT", flag: "🇵🇹", demandScore: 72, competitionLevel: "baixa" as const, suggestedLanguage: "Portugues", estimatedCpm: "$2-4", reasoning: "Publico lusofono com poder de compra superior ao Brasil. Pouca competicao em nichos digitais." },
  { country: "Colombia", countryCode: "CO", flag: "🇨🇴", demandScore: 68, competitionLevel: "baixa" as const, suggestedLanguage: "Espanhol", estimatedCpm: "$1-2", reasoning: "Crescimento acelerado de e-commerce. Custo de CPM muito baixo para alcance." },
  { country: "Argentina", countryCode: "AR", flag: "🇦🇷", demandScore: 65, competitionLevel: "baixa" as const, suggestedLanguage: "Espanhol", estimatedCpm: "$1-3", reasoning: "Publico engajado com conteudo digital. Boa oportunidade para entrada antecipada." },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("medio");
  const [funnelStage, setFunnelStage] = useState("meio");
  const [marketLoading, setMarketLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<typeof MOCK_MARKETS[0] | null>(null);
  const [networkId, setNetworkId] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [affLink, setAffLink] = useState("");
  const [domainSlug, setDomainSlug] = useState("");
  const [presellLang, setPresellLang] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templateLabel, setTemplateLabel] = useState("");
  const [tone, setTone] = useState("confiante");
  const [copyLoading, setCopyLoading] = useState(false);
  const [variations, setVariations] = useState<Array<{ label: string; headline: string; body: string; cta: string; imageStyle: string; colors: { background: string; accent: string; text: string } }> | null>(null);
  const [campaignData, setCampaignData] = useState<{ keywords: string[]; interests: string[]; placements: string[] } | null>(null);
  const [activated, setActivated] = useState(false);

  const analyzeMarkets = () => {
    if (!product.trim()) return;
    setMarketLoading(true);
    setTimeout(() => setMarketLoading(false), 2000);
  };

  const generateCopy = () => {
    setCopyLoading(true);
    setTimeout(() => {
      setVariations([
        { label: "Variacao A - Confiante", headline: `${product} - A solucao que voce precisava`, body: `Descubra como ${product} pode transformar seus resultados. Milhares de pessoas ja esta usando.`, cta: "Saiba Mais", imageStyle: "Foto de pessoa sorrindo com produto, fundo vibrante", colors: { background: "#1a1a2e", accent: "#6366F1", text: "#F1F5F9" } },
        { label: "Variacao B - Urgente", headline: `Ultima chance: ${product} com desconto`, body: `Nao perca tempo! ${product} esta com oferta especial por tempo limitado. Garanta ja o seu.`, cta: "Garantir Agora", imageStyle: "Timer regressivo com foto do produto, cores quentes", colors: { background: "#2d1b1b", accent: "#EF4444", text: "#F1F5F9" } },
        { label: "Variacao C - Premium", headline: `Experiencia premium: ${product}`, body: `Para quem busca excelencia. ${product} e a escolha dos que sabem o que querem.`, cta: "Descobrir", imageStyle: "Minimalista, fundo escuro, produto em destaque com luz suave", colors: { background: "#0f0f0f", accent: "#F59E0B", text: "#F1F5F9" } },
      ]);
      setCopyLoading(false);
    }, 2500);
  };

  const goToCampaign = () => {
    setCampaignData({
      keywords: [product, "comprar online", "melhor preco", "oferta especial", "frete gratis"],
      interests: ["Marketing digital", "Empreendedorismo", "Negocios online", "Infoprodutos"],
      placements: ["Feed Instagram", "Reels", "Stories", "Feed Facebook"],
    });
    setStep(5);
  };

  const slug = domainSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") || "meu-produto";
  const inputStyle = { width: "100%", marginTop: 6, background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: C.dim };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: C.bg, minHeight: "100dvh", width: "100%", color: C.text, padding: "28px 16px", margin: 0 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; margin: 0; } input, textarea, select { font-family: inherit; } input::placeholder, textarea::placeholder { color: #56607A; } body { margin: 0; }`}</style>

      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>ADSFLOW</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "4px 0 2px" }}>Produto → Mercado → Presell → Anuncio → Campanha</h1>
          <p style={{ fontSize: 13, color: C.dim, margin: 0 }}>Prototipo funcional — IA para analise de mercado, copy e segmentacao.</p>
        </div>

        <Stepper step={step} />

        {step === 1 && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Produto *</label>
              <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: capsulas emagrecedoras naturais" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Descricao (opcional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Diferenciais, faixa de preco, para quem e indicado..." rows={2} style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties} />
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={labelStyle}>Publico-alvo (opcional)</label>
                <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex: mulheres 30-50 anos" style={inputStyle} />
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <label style={labelStyle}>Orcamento de midia</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} style={inputStyle}>
                  <option value="baixo">Baixo</option>
                  <option value="medio">Medio</option>
                  <option value="alto">Alto</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Estagio de funil</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {FUNNEL_STAGES.map((f) => (
                  <button key={f.id} onClick={() => setFunnelStage(f.id)}
                    style={{ flex: "1 1 150px", textAlign: "left", background: funnelStage === f.id ? C.accentSoft : C.panelAlt, border: `1px solid ${funnelStage === f.id ? C.accent : C.border}`, borderRadius: 9, padding: "10px 12px", color: C.text, cursor: "pointer" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { setStep(2); analyzeMarkets(); }}
              style={{ background: C.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 0", borderRadius: 9, marginTop: 4, cursor: "pointer" }}>
              Analisar mercados →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: C.dim, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>← Editar produto</button>
            </div>
            {marketLoading ? (
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                <Spinner label="Analisando mercados globais com IA..." />
              </div>
            ) : (
              <>
                <div style={{ background: C.accentSoft, border: `1px solid ${C.accent}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, marginBottom: 14, color: "#C7D2FE" }}>
                  Analise completa: identificamos os melhores mercados para <strong>{product}</strong>. Considere comecar pelo Brasil (maior demanda) ou Mexico (menor custo de CPM).
                </div>
                <div style={{ fontSize: 12, color: C.dim, marginBottom: 8, fontWeight: 600 }}>Escolha um pais:</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {MOCK_MARKETS.sort((a, b) => b.demandScore - a.demandScore).map((c, i) => {
                    const comp = { baixa: { color: C.green, label: "Baixa concorrencia" }, media: { color: C.amber, label: "Concorrencia media" }, alta: { color: C.red, label: "Alta concorrencia" } }[c.competitionLevel];
                    return (
                      <button key={i} onClick={() => { setSelectedCountry(c); setPresellLang(c.suggestedLanguage); setStep(3); }}
                        style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: "flex", gap: 14, alignItems: "center", textAlign: "left", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.accent)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
                        <ScoreRing score={c.demandScore} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 15, fontWeight: 800 }}>{c.flag} {c.country}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: comp.color, background: `${comp.color}22`, padding: "2px 8px", borderRadius: 999 }}>{comp.label}</span>
                          </div>
                          <div style={{ fontSize: 12.5, color: C.dim, margin: "6px 0" }}>{c.reasoning}</div>
                          <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#B0B9CC" }}>
                            <span>🗣 {c.suggestedLanguage}</span>
                            <span>💵 CPM {c.estimatedCpm}</span>
                          </div>
                        </div>
                        <span style={{ color: C.accent, fontSize: 18 }}>→</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && selectedCountry && (
          <div>
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: C.dim, fontSize: 13, fontWeight: 600, marginBottom: 12, cursor: "pointer" }}>← Trocar pais</button>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Rede de afiliados</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginTop: 6 }}>
                  {AFFILIATE_NETWORKS.map((n) => (
                    <button key={n.id} onClick={() => { setNetworkId(n.id); setNetworkName(n.name); }}
                      style={{ background: networkId === n.id ? C.accentSoft : C.panelAlt, border: `1px solid ${networkId === n.id ? C.accent : C.border}`, borderRadius: 8, padding: "8px 10px", textAlign: "left", color: C.text, cursor: "pointer" }}>
                      <div style={{ fontWeight: 700, fontSize: 12.5 }}>{n.name}</div>
                      <div style={{ fontSize: 10, color: C.dim }}>{n.tag}</div>
                    </button>
                  ))}
                </div>
              </div>
              {networkId && (
                <>
                  <div>
                    <label style={labelStyle}>Link de afiliado ({networkName})</label>
                    <input value={affLink} onChange={(e) => setAffLink(e.target.value)} placeholder="Cole aqui o link da oferta original" style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 180px" }}>
                      <label style={labelStyle}>Idioma da presell</label>
                      <input value={presellLang} onChange={(e) => setPresellLang(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ flex: "1 1 180px" }}>
                      <label style={labelStyle}>Dominio da presell</label>
                      <input value={domainSlug} onChange={(e) => setDomainSlug(e.target.value)} placeholder="nome-do-produto" style={inputStyle} />
                      <div style={{ marginTop: 6, fontSize: 12.5, color: C.accent, fontFamily: "monospace" }}>http://localhost:3000/p/{slug}</div>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Template da presell</label>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {(TEMPLATES[funnelStage] || []).map((t) => (
                        <button key={t.id} onClick={() => { setTemplateId(t.id); setTemplateLabel(t.label); }}
                          style={{ flex: "1 1 180px", textAlign: "left", background: templateId === t.id ? C.accentSoft : C.panelAlt, border: `1px solid ${templateId === t.id ? C.accent : C.border}`, borderRadius: 9, padding: "10px 12px", color: C.text, cursor: "pointer" }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{t.label}</div>
                          <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { if (templateId) setStep(4); }}
                    disabled={!templateId}
                    style={{ background: templateId ? C.accent : C.panelAlt, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 0", borderRadius: 9, opacity: templateId ? 1 : 0.6, cursor: "pointer" }}>
                    Gerar anuncios →
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {step === 4 && selectedCountry && (
          <div>
            <button onClick={() => setStep(3)} style={{ background: "none", border: "none", color: C.dim, fontSize: 13, fontWeight: 600, marginBottom: 12, cursor: "pointer" }}>← Editar presell</button>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={labelStyle}>Gerando anuncios para</div>
                  <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{selectedCountry.flag} {selectedCountry.country} · {presellLang}</div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ ...inputStyle, width: 150, marginTop: 0 }}>
                    <option value="confiante">Confiante</option>
                    <option value="divertido">Divertido</option>
                    <option value="urgente">Urgente</option>
                    <option value="premium">Premium</option>
                    <option value="acolhedor">Acolhedor</option>
                  </select>
                  <button onClick={generateCopy} disabled={copyLoading}
                    style={{ background: C.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 18px", borderRadius: 9, opacity: copyLoading ? 0.7 : 1, whiteSpace: "nowrap", cursor: "pointer" }}>
                    {copyLoading ? "Gerando..." : variations ? "Gerar de novo" : "Gerar anuncios"}
                  </button>
                </div>
              </div>
              {copyLoading && <div style={{ marginTop: 14 }}><Spinner label="Criando 3 variacoes de anuncio com IA..." /></div>}
            </div>
            {variations && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14, marginBottom: 16 }}>
                  {variations.map((v, i) => (
                    <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, background: v.colors?.background || C.panel, color: v.colors?.text || C.text }}>
                      <div style={{ padding: "8px 14px", background: "rgba(0,0,0,0.15)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{v.label}</div>
                      <div style={{ padding: 18 }}>
                        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, lineHeight: 1.25 }}>{v.headline}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14, opacity: 0.9 }}>{v.body}</div>
                        <button style={{ background: v.colors?.accent || C.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 8, marginBottom: 12 }}>{v.cta}</button>
                        <div style={{ fontSize: 11, opacity: 0.7, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 8 }}>🎨 {v.imageStyle}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={goToCampaign} style={{ background: C.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 0", borderRadius: 9, width: "100%", cursor: "pointer" }}>
                  Montar campanha →
                </button>
              </>
            )}
          </div>
        )}

        {step === 5 && selectedCountry && campaignData && (
          <div>
            <button onClick={() => setStep(4)} style={{ background: "none", border: "none", color: C.dim, fontSize: 13, fontWeight: 600, marginBottom: 12, cursor: "pointer" }}>← Editar anuncios</button>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10 }}>RESUMO DA CAMPANHA</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, fontSize: 13 }}>
                  <div><div style={labelStyle}>Produto</div><div style={{ fontWeight: 700 }}>{product}</div></div>
                  <div><div style={labelStyle}>Pais</div><div style={{ fontWeight: 700 }}>{selectedCountry.flag} {selectedCountry.country}</div></div>
                  <div><div style={labelStyle}>Funil</div><div style={{ fontWeight: 700, textTransform: "capitalize" }}>{funnelStage}</div></div>
                  <div><div style={labelStyle}>Rede</div><div style={{ fontWeight: 700 }}>{networkName}</div></div>
                  <div><div style={labelStyle}>Presell</div><div style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 12 }}>localhost:3000/p/{slug}</div></div>
                  <div><div style={labelStyle}>Template</div><div style={{ fontWeight: 700 }}>{templateLabel}</div></div>
                </div>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10 }}>VERBA SUGERIDA / DIA</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>$25<span style={{ fontSize: 13, color: C.dim, fontWeight: 600 }}> /dia</span></div>
                <div style={{ fontSize: 12.5, color: C.dim, marginTop: 6 }}>{funnelStage === "topo" ? "Topo de funil precisa de mais alcance." : funnelStage === "fundo" ? "Fundo de funil e publico qualificado, verba mais enxuta." : "Meio de funil equilibra alcance e qualificacao."}</div>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10 }}>SEGMENTACAO POR DISPOSITIVO</div>
                <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ width: "68%", background: C.accent }} />
                  <div style={{ width: "22%", background: C.green }} />
                  <div style={{ width: "10%", background: C.amber }} />
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12.5 }}>
                  <span>📱 Mobile 68%</span>
                  <span>🖥 Desktop 22%</span>
                  <span>📱 Tablet 10%</span>
                </div>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10 }}>PALAVRAS-CHAVE E INTERESSES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {campaignData.keywords.map((k, i) => (
                    <span key={i} style={{ fontSize: 12, background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 999, padding: "4px 10px" }}>{k}</span>
                  ))}
                </div>
                <div style={labelStyle}>Interesses (Meta Ads Manager)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {campaignData.interests.map((k, i) => (
                    <span key={i} style={{ fontSize: 12, background: C.accentSoft, border: `1px solid ${C.accent}`, borderRadius: 999, padding: "4px 10px" }}>{k}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10 }}>POSICIONAMENTOS RECOMENDADOS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {campaignData.placements.map((p, i) => (
                    <span key={i} style={{ fontSize: 12, background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 999, padding: "4px 10px" }}>{p}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, textAlign: "center" }}>
                {!activated ? (
                  <>
                    <button onClick={() => setActivated(true)}
                      style={{ background: C.green, border: "none", color: "#fff", fontWeight: 800, fontSize: 15, padding: "14px 28px", borderRadius: 10, cursor: "pointer" }}>
                      Ativar campanha
                    </button>
                    <div style={{ fontSize: 11, color: C.dim, marginTop: 10 }}>Para publicar de verdade, conecte sua conta Meta Ads.</div>
                  </>
                ) : (
                  <div>
                    <div style={{ fontSize: 32 }}>✅</div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginTop: 6 }}>Campanha pronta!</div>
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>Material pronto para ser publicado no Meta Ads.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
