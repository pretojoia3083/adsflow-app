"use client";

import { useState } from "react";

interface CampaignDetail {
  id: string;
  productName: string;
  description: string | null;
  audience: string | null;
  funnelStage: string;
  budgetPref: string;
  country: string;
  countryCode: string | null;
  language: string | null;
  estimatedCpm: string | null;
  networkId: string | null;
  networkName: string | null;
  affLink: string | null;
  affiliateLink: string | null;
  presellSlug: string | null;
  keywords: string[];
  interests: string[];
  placements: string[];
  budgetDaily: number | null;
  deviceSplit: Record<string, unknown>;
  adCopy: Record<string, string>;
  tone: string | null;
  status: string;
  metaCampaignId: string | null;
  targetCities: string[];
  targetRegions: string[];
  startTime: string | null;
  endTime: string | null;
  pageId: string | null;
  creativeUrl: string | null;
  createdAt: string;
}

interface Props {
  campaign: CampaignDetail;
  onClose: () => void;
  onSaved: (updated: CampaignDetail) => void;
}

const BG = "#080B14";
const CARD = "#121830";
const BORDER = "#232C52";
const GREEN1 = "#22B07D";
const GREEN2 = "#3FCB92";
const TEXT = "#F3F5FF";
const MUTED = "#8C93B8";
const DIM = "#6B739E";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", background: "#0C1022", border: `1px solid ${BORDER}`,
  borderRadius: 8, color: TEXT, fontSize: 14, outline: "none", boxSizing: "border-box" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: DIM, marginBottom: 4,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: DIM, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function CampaignDetailModal({ campaign, onClose, onSaved }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    productName: campaign.productName,
    description: campaign.description || "",
    audience: campaign.audience || "",
    country: campaign.country,
    countryCode: campaign.countryCode || "",
    language: campaign.language || "",
    funnelStage: campaign.funnelStage,
    budgetDaily: campaign.budgetDaily?.toString() || "",
    adCopy: {
      headline: campaign.adCopy?.headline || "",
      primaryText: campaign.adCopy?.primaryText || "",
      description: campaign.adCopy?.description || "",
      cta: campaign.adCopy?.cta || "",
    },
    keywords: (campaign.keywords || []).join(", "),
    interests: (campaign.interests || []).join(", "),
    placements: (campaign.placements || []).join(", "),
    tone: campaign.tone || "",
    affiliateLink: campaign.affiliateLink || campaign.affLink || "",
    presellSlug: campaign.presellSlug || "",
    status: campaign.status,
  });

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: campaign.id,
          productName: form.productName,
          description: form.description,
          audience: form.audience,
          country: form.country,
          countryCode: form.countryCode,
          language: form.language,
          funnelStage: form.funnelStage,
          budgetDaily: form.budgetDaily ? parseFloat(form.budgetDaily) : null,
          adCopy: form.adCopy,
          keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
          interests: form.interests.split(",").map((i) => i.trim()).filter(Boolean),
          placements: form.placements.split(",").map((p) => p.trim()).filter(Boolean),
          tone: form.tone,
          affiliateLink: form.affiliateLink,
          presellSlug: form.presellSlug,
          status: form.status,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSaved(true);
        setEditing(false);
        onSaved(updated);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {}
    setSaving(false);
  }

  const adCopy = campaign.adCopy || {};

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, width: "100%", maxWidth: 720, maxHeight: "85vh", overflow: "auto", padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: CARD, zIndex: 1, borderRadius: "20px 20px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(34,176,125,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {editing ? "✏️" : "📋"}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>{editing ? "Editando Campanha" : "Detalhes da Campanha"}</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>Criada em {new Date(campaign.createdAt).toLocaleDateString("pt-BR")}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{ padding: "8px 16px", background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 8, color: "#60A5FA", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Editar
              </button>
            )}
            <button onClick={onClose} style={{ padding: "8px 12px", background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, fontSize: 14, cursor: "pointer" }}>
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 28px 28px" }}>
          {editing ? (
            /* EDIT MODE */
            <>
              <Section title="Produto">
                <Field label="Nome do Produto">
                  <input style={inputStyle} value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
                </Field>
                <Field label="Descricao">
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" as const }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Field>
                <Field label="Publico-alvo">
                  <input style={inputStyle} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
                </Field>
              </Section>

              <Section title="Copy">
                <Field label="Headline">
                  <input style={inputStyle} value={form.adCopy.headline} onChange={(e) => setForm({ ...form, adCopy: { ...form.adCopy, headline: e.target.value } })} />
                </Field>
                <Field label="Texto Principal">
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" as const }} value={form.adCopy.primaryText} onChange={(e) => setForm({ ...form, adCopy: { ...form.adCopy, primaryText: e.target.value } })} />
                </Field>
                <Field label="Descricao">
                  <input style={inputStyle} value={form.adCopy.description} onChange={(e) => setForm({ ...form, adCopy: { ...form.adCopy, description: e.target.value } })} />
                </Field>
                <Field label="CTA">
                  <input style={inputStyle} value={form.adCopy.cta} onChange={(e) => setForm({ ...form, adCopy: { ...form.adCopy, cta: e.target.value } })} />
                </Field>
              </Section>

              <Section title="Segmentacao">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Pais">
                    <input style={inputStyle} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  </Field>
                  <Field label="Idioma">
                    <input style={inputStyle} value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
                  </Field>
                </div>
                <Field label="Interesses (separados por virgula)">
                  <input style={inputStyle} value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
                </Field>
                <Field label="Palavras-chave (separadas por virgula)">
                  <input style={inputStyle} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
                </Field>
                <Field label="Placements (separados por virgula)">
                  <input style={inputStyle} value={form.placements} onChange={(e) => setForm({ ...form, placements: e.target.value })} />
                </Field>
              </Section>

              <Section title="Orcamento e Funil">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Funil">
                    <select style={{ ...inputStyle, cursor: "pointer" }} value={form.funnelStage} onChange={(e) => setForm({ ...form, funnelStage: e.target.value })}>
                      <option value="topo">Topo (Consciencia)</option>
                      <option value="meio">Meio (Engajamento)</option>
                      <option value="fundo">Fundo (Conversao)</option>
                    </select>
                  </Field>
                  <Field label="Orcamento Diario ($)">
                    <input style={inputStyle} type="number" value={form.budgetDaily} onChange={(e) => setForm({ ...form, budgetDaily: e.target.value })} />
                  </Field>
                </div>
                <Field label="Link de Afiliado">
                  <input style={inputStyle} value={form.affiliateLink} onChange={(e) => setForm({ ...form, affiliateLink: e.target.value })} />
                </Field>
              </Section>
            </>
          ) : (
            /* VIEW MODE */
            <>
              <Section title="Produto">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>PRODUTO</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{campaign.productName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>STATUS</div>
                    <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 13, fontWeight: 600, color: campaign.status === "ACTIVE" ? GREEN2 : campaign.status === "PAUSED" ? "#F59E0B" : MUTED, background: campaign.status === "ACTIVE" ? "rgba(63,203,146,0.12)" : campaign.status === "PAUSED" ? "rgba(245,158,11,0.12)" : "rgba(140,147,184,0.12)" }}>
                      {campaign.status === "ACTIVE" ? "Ativa" : campaign.status === "PAUSED" ? "Pausada" : campaign.status === "READY" ? "Pronta" : campaign.status === "COMPLETED" ? "Concluida" : "Rascunho"}
                    </span>
                  </div>
                </div>
                {campaign.description && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>DESCRICAO</div>
                    <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.5 }}>{campaign.description}</div>
                  </div>
                )}
                {campaign.audience && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>PUBLICO-ALVO</div>
                    <div style={{ fontSize: 14, color: MUTED }}>{campaign.audience}</div>
                  </div>
                )}
              </Section>

              <Section title="Copy">
                {adCopy.headline && (
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>HEADLINE</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{adCopy.headline}</div>
                  </div>
                )}
                {adCopy.primaryText && (
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>TEXTO PRINCIPAL</div>
                    <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{adCopy.primaryText}</div>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {adCopy.description && (
                    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>DESCRICAO</div>
                      <div style={{ fontSize: 13, color: MUTED }}>{adCopy.description}</div>
                    </div>
                  )}
                  {adCopy.cta && (
                    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>CTA</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: GREEN2 }}>{adCopy.cta}</div>
                    </div>
                  )}
                </div>
              </Section>

              <Section title="Segmentacao">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>PAIS</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{campaign.countryCode || campaign.country}</div>
                  </div>
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>IDIOMA</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{campaign.language || "N/A"}</div>
                  </div>
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>FUNIL</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{campaign.funnelStage === "topo" ? "Topo" : campaign.funnelStage === "meio" ? "Meio" : "Fundo"}</div>
                  </div>
                </div>
                {campaign.interests?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>INTERESSES</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                      {campaign.interests.map((i, idx) => (
                        <span key={idx} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.2)" }}>{i}</span>
                      ))}
                    </div>
                  </div>
                )}
                {campaign.keywords?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>PALAVRAS-CHAVE</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                      {campaign.keywords.map((k, idx) => (
                        <span key={idx} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, background: "rgba(167,139,250,0.1)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.2)" }}>{k}</span>
                      ))}
                    </div>
                  </div>
                )}
                {campaign.placements?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>PLACEMENTS</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                      {campaign.placements.map((p, idx) => (
                        <span key={idx} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, background: "rgba(247,201,72,0.1)", color: "#F7C948", border: "1px solid rgba(247,201,72,0.2)" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              <Section title="Orcamento">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>ORCAMENTO DIARIO</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: GREEN2 }}>{campaign.budgetDaily ? `$${campaign.budgetDaily}` : "N/A"}</div>
                  </div>
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>CPM ESTIMADO</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>{campaign.estimatedCpm ? `$${campaign.estimatedCpm}` : "N/A"}</div>
                  </div>
                </div>
              </Section>

              {campaign.affiliateLink && (
                <Section title="Links">
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>LINK DE AFILIADO</div>
                    <div style={{ fontSize: 13, color: GREEN2, wordBreak: "break-all", fontFamily: "monospace" }}>{campaign.affiliateLink}</div>
                  </div>
                  {campaign.presellSlug && (
                    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12, marginTop: 8 }}>
                      <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>PRESELL</div>
                      <div style={{ fontSize: 13, color: GREEN2, fontFamily: "monospace" }}>https://adsflow-app-ten.vercel.app/p/{campaign.presellSlug}</div>
                    </div>
                  )}
                </Section>
              )}

              {campaign.metaCampaignId && (
                <Section title="Meta">
                  <div style={{ background: "rgba(34,176,125,0.06)", border: `1px solid rgba(34,176,125,0.2)`, borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 11, color: GREEN1, marginBottom: 4 }}>CAMPAIGN ID META</div>
                    <div style={{ fontSize: 13, color: GREEN2, fontFamily: "monospace" }}>{campaign.metaCampaignId}</div>
                  </div>
                </Section>
              )}
            </>
          )}

          {/* Footer */}
          {editing && (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ flex: 1, padding: "12px", background: saved ? GREEN1 : `linear-gradient(90deg,${GREEN1},${GREEN2})`, color: BG, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: saving ? "wait" : "pointer", transition: "all 0.2s" }}
              >
                {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar alteracoes"}
              </button>
              <button onClick={() => { setEditing(false); setForm({ ...form, productName: campaign.productName, description: campaign.description || "", audience: campaign.audience || "", country: campaign.country, countryCode: campaign.countryCode || "", language: campaign.language || "", funnelStage: campaign.funnelStage, budgetDaily: campaign.budgetDaily?.toString() || "", adCopy: { headline: adCopy.headline || "", primaryText: adCopy.primaryText || "", description: adCopy.description || "", cta: adCopy.cta || "" }, keywords: (campaign.keywords || []).join(", "), interests: (campaign.interests || []).join(", "), placements: (campaign.placements || []).join(", "), tone: campaign.tone || "", affiliateLink: campaign.affiliateLink || campaign.affLink || "", presellSlug: campaign.presellSlug || "", status: campaign.status }); }} style={{ padding: "12px 20px", background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 10, color: MUTED, fontSize: 14, cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
