"use client";

import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  productName: string;
  country: string;
  countryCode: string;
  status: string;
  createdAt: string;
  budgetDaily: number | null;
  affLink: string | null;
  affiliateLink: string | null;
  metaCampaignId: string | null;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  DRAFT: { color: "#8C93B8", bg: "rgba(140,147,184,0.12)" },
  READY: { color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  ACTIVE: { color: "#22B07D", bg: "rgba(34,176,125,0.12)" },
  PAUSED: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  COMPLETED: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  READY: "Pronta",
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  COMPLETED: "Concluida",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  function fetchCampaigns() {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => { setCampaigns(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  async function handleDelete(deleteMeta: boolean) {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/campaigns?id=${deleteTarget.id}&deleteMeta=${deleteMeta}`, { method: "DELETE" });
      setCampaigns((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
    }
    setDeleting(false);
  }

  async function handleToggleStatus(c: Campaign) {
    const action = c.status === "ACTIVE" ? "pause" : "resume";
    setActionLoading(c.id + action);
    try {
      const res = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, action }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns((prev) => prev.map((x) => x.id === c.id ? { ...x, status: data.status } : x));
      }
    } catch {}
    setActionLoading(null);
  }

  async function handleDuplicate(c: Campaign) {
    setActionLoading(c.id + "duplicate");
    try {
      const res = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, action: "duplicate" }),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaigns((prev) => [data.campaign, ...prev]);
      }
    } catch {}
    setActionLoading(null);
  }

  const filtered = filter === "ALL" ? campaigns : campaigns.filter((c) => c.status === filter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Campanhas</h2>
          <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Todas as suas campanhas de anuncios</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["ALL", "DRAFT", "READY", "ACTIVE", "PAUSED", "COMPLETED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              background: filter === f ? "rgba(139,92,246,0.15)" : "#121830",
              border: filter === f ? "1px solid #8B5CF6" : "1px solid #232C52",
              borderRadius: 8,
              color: filter === f ? "#A78BFA" : "#8C93B8",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f === "ALL" ? "Todas" : STATUS_LABELS[f] || f}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#8C93B8", fontSize: 14 }}>Carregando...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "56px 40px", textAlign: "center" }}>
          <p style={{ fontSize: 44, marginBottom: 16 }}>🎯</p>
          <p style={{ fontWeight: 700, fontSize: 20, color: "#F3F5FF", marginBottom: 10 }}>Nenhuma campanha encontrada</p>
          <p style={{ color: "#8C93B8", fontSize: 15 }}>Crie uma campanha no Dashboard para comecar.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((c) => {
            const s = STATUS_COLORS[c.status] || STATUS_COLORS.DRAFT;
            const isLoading = actionLoading?.startsWith(c.id);
            return (
              <div key={c.id} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontWeight: 600, color: "#F3F5FF", fontSize: 17, margin: 0 }}>{c.productName}</p>
                  <p style={{ color: "#8C93B8", fontSize: 14, margin: "4px 0 0 0" }}>
                    {c.country || c.countryCode} · {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    {c.budgetDaily && <span> · R${c.budgetDaily}/dia</span>}
                  </p>
                  {c.metaCampaignId && (
                    <p style={{ color: "#22B07D", fontSize: 12, margin: "4px 0 0 0" }}>🔗 Conectada ao Meta Ads</p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ padding: "5px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, color: s.color, background: s.bg, whiteSpace: "nowrap" }}>
                    {STATUS_LABELS[c.status] || c.status}
                  </span>

                  {(c.status === "ACTIVE" || c.status === "DRAFT" || c.status === "READY" || c.status === "PAUSED") && (
                    <button
                      onClick={() => handleToggleStatus(c)}
                      disabled={!!isLoading}
                      title={c.status === "ACTIVE" ? "Pausar campanha" : "Ativar/Retomar campanha"}
                      style={{ padding: "7px 12px", background: c.status === "ACTIVE" ? "rgba(245,158,11,0.08)" : "rgba(34,176,125,0.08)", border: `1px solid ${c.status === "ACTIVE" ? "rgba(245,158,11,0.25)" : "rgba(34,176,125,0.25)"}`, borderRadius: 8, color: c.status === "ACTIVE" ? "#F59E0B" : "#22B07D", fontSize: 14, cursor: isLoading ? "wait" : "pointer" }}
                    >
                      {c.status === "ACTIVE" ? "⏸️" : "▶️"}
                    </button>
                  )}

                  {c.status !== "ACTIVE" && c.status !== "DRAFT" && c.status !== "READY" && c.status !== "PAUSED" && c.status !== "COMPLETED" && (
                    <button
                      onClick={() => handleToggleStatus(c)}
                      disabled={!!isLoading}
                      title="Ativar campanha"
                      style={{ padding: "7px 12px", background: "rgba(34,176,125,0.08)", border: "1px solid rgba(34,176,125,0.25)", borderRadius: 8, color: "#22B07D", fontSize: 14, cursor: isLoading ? "wait" : "pointer" }}
                    >
                      ▶️
                    </button>
                  )}

                  <button
                    onClick={() => handleDuplicate(c)}
                    disabled={!!isLoading}
                    title="Duplicar campanha"
                    style={{ padding: "7px 12px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 8, color: "#60A5FA", fontSize: 14, cursor: isLoading ? "wait" : "pointer" }}
                  >
                    📋
                  </button>

                  <button
                    onClick={() => setDeleteTarget(c)}
                    title="Excluir campanha"
                    style={{ padding: "7px 12px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, color: "#F87171", fontSize: 14, cursor: "pointer" }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => !deleting && setDeleteTarget(null)}>
          <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 18, maxWidth: 480, width: "100%", padding: 32 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#F87171", fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>Excluir campanha</h3>
            <p style={{ color: "#A0A8CE", fontSize: 15, margin: "0 0 20px", lineHeight: 1.5 }}>
              Tem certeza que deseja excluir <strong style={{ color: "#F3F5FF" }}>{deleteTarget.productName}</strong>?
            </p>

            {deleteTarget.metaCampaignId && (
              <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: 14, marginBottom: 20 }}>
                <p style={{ color: "#F59E0B", fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>⚠️ Esta campanha esta conectada ao Meta Ads</p>
                <p style={{ color: "#8C93B8", fontSize: 13, margin: 0 }}>Voce pode excluir apenas do sistema, ou tambem do Meta (ira pausar e arquivar a campanha no Meta).</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {deleteTarget.metaCampaignId && (
                <button
                  onClick={() => handleDelete(true)}
                  disabled={deleting}
                  style={{ padding: "12px 20px", background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)", borderRadius: 10, color: "#F87171", fontSize: 15, fontWeight: 600, cursor: deleting ? "wait" : "pointer" }}
                >
                  {deleting ? "Excluindo..." : "Excluir do sistema + Meta"}
                </button>
              )}
              <button
                onClick={() => handleDelete(false)}
                disabled={deleting}
                style={{ padding: "12px 20px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, color: "#F87171", fontSize: 15, fontWeight: 600, cursor: deleting ? "wait" : "pointer" }}
              >
                {deleting ? "Excluindo..." : "Excluir apenas do sistema"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                style={{ padding: "12px 20px", background: "transparent", border: "1px solid #232C52", borderRadius: 10, color: "#8C93B8", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
