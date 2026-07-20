"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import AdsFlowWizard from "@/components/AdsFlowWizard";
import Stepper from "@/components/Stepper";
import Sidebar, { SidebarPage } from "@/components/Sidebar";
import PlansPage from "@/components/pages/PlansPage";
import MetaApiPage from "@/components/pages/MetaApiPage";
import SupportPage from "@/components/pages/SupportPage";
import IaPage from "@/components/pages/IaPage";
import CampaignsPage from "@/components/pages/CampaignsPage";
import CampaignDetailModal from "@/components/CampaignDetailModal";
import MetricsPage from "@/components/pages/MetricsPage";
import CreativesPage from "@/components/pages/CreativesPage";
import InstallAppPage from "@/components/pages/InstallAppPage";
import SettingsPage from "@/components/pages/SettingsPage";
import AdRadarPage from "@/components/pages/AdRadarPage";
import AdsShopPage from "@/components/pages/AdsShopPage";
import InstallBanner from "@/components/InstallBanner";
import { getSimulatedCampaigns, getOverallStats, SimulatedCampaign } from "@/lib/simulated-campaigns";

const STEP_NAMES = [
  "Produto",
  "Analise",
  "Segmentacao",
  "Copy",
  "Presell",
  "Config",
  "Revisao",
  "Publicar",
];

interface Campaign {
  id: string;
  productName: string;
  description: string | null;
  audience: string | null;
  funnelStage: string;
  budgetPref: string;
  country: string;
  countryCode: string;
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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<SidebarPage>("dashboard");
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [simCampaigns, setSimCampaigns] = useState<SimulatedCampaign[]>([]);
  const [simStats, setSimStats] = useState<ReturnType<typeof getOverallStats> | null>(null);
  const [selectedSimCampaign, setSelectedSimCampaign] = useState<SimulatedCampaign | null>(null);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/campaigns")
        .then((r) => r.json())
        .then((d) => { setCampaigns(Array.isArray(d) ? d : []); setLoading(false); })
        .catch(() => setLoading(false));
      fetch("/api/user/profile?t=" + Date.now())
        .then((r) => r.json())
        .then((d) => { if (d.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl); })
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    if (session && currentPage === "dashboard") {
      fetch("/api/user/profile?t=" + Date.now())
        .then((r) => r.json())
        .then((d) => { if (d.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl); })
        .catch(() => {});
    }
  }, [currentPage]);

  useEffect(() => {
    function updateSim() {
      const c = getSimulatedCampaigns();
      setSimCampaigns(c);
      setSimStats(getOverallStats(c));
    }
    updateSim();
    const interval = setInterval(updateSim, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleDeleteCampaign(id: string, metaCampaignId?: string | null) {
    setDeletingId(id);
    try {
      const params = metaCampaignId ? `?id=${id}&deleteMeta=true` : `?id=${id}`;
      await fetch(`/api/campaigns${params}`, { method: "DELETE" });
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch {}
    setDeletingId(null);
  }

  function handleNavigate(page: SidebarPage) {
    setCurrentPage(page);
    setShowWizard(false);
    setCurrentStep(1);
  }

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#080B14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: "#8C93B8", fontSize: 14 }}>Carregando...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#080B14", fontFamily: "'Inter', sans-serif", display: "flex" }}>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} userName={session.user?.name || session.user?.email || ""} avatarUrl={avatarUrl} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ borderBottom: "1px solid #1A2040", padding: "14px clamp(16px, 4vw, 32px)", display: "flex", alignItems: "center", gap: 24, background: "#0C1022" }}>
          {showWizard && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <Stepper labels={STEP_NAMES} currentStep={currentStep} />
            </div>
          )}

          {!showWizard && <div style={{ flex: 1 }} />}

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => handleNavigate("settings")}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: avatarUrl ? "none" : "linear-gradient(135deg, #8B5CF6, #A78BFA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", border: "2px solid #232C52",
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "#080B14", fontSize: 14, fontWeight: 700 }}>{(session.user?.name || session.user?.email || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span style={{ color: "#8C93B8", fontSize: 14 }}>{session.user?.name || session.user?.email}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{ padding: "10px 20px", background: "transparent", border: "1px solid #232C52", borderRadius: 10, color: "#8C93B8", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
              Sair
            </button>
          </div>
        </header>

        <main style={{ padding: "clamp(16px, 4vw, 32px)", flex: 1, overflow: "auto" }}>
          {currentPage === "dashboard" && (
            !showWizard ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Campanhas</h2>
                    <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Visao geral das suas campanhas de anuncios</p>
                  </div>
                  <button
                    onClick={() => setShowWizard(true)}
                    style={{ padding: "12px 24px", background: "linear-gradient(90deg,#8B5CF6,#22B07D)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                  >
                    + Nova campanha
                  </button>
                </div>

                {simStats && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
                    {[
                      { label: "Campanhas", value: simStats.totalCampaigns.toString(), sub: `${simStats.activeCampaigns} ativas`, color: "#8B5CF6" },
                      { label: "Gasto Total", value: `R$ ${simStats.totalSpent.toLocaleString("pt-BR")}`, sub: `R$ ${simStats.dailyBudget}/dia`, color: "#F97316" },
                      { label: "Receita", value: `R$ ${simStats.totalRevenue.toLocaleString("pt-BR")}`, sub: `Lucro R$ ${simStats.totalProfit.toLocaleString("pt-BR")}`, color: "#22B07D" },
                      { label: "Impressoes", value: simStats.totalImpressions >= 1000000 ? `${(simStats.totalImpressions / 1000000).toFixed(1)}M` : `${(simStats.totalImpressions / 1000).toFixed(0)}K`, sub: `${simStats.avgCpm.toFixed(2)} CPM`, color: "#60A5FA" },
                      { label: "Cliques", value: simStats.totalClicks >= 1000 ? `${(simStats.totalClicks / 1000).toFixed(1)}K` : simStats.totalClicks.toString(), sub: `${simStats.avgCtr.toFixed(1)}% CTR`, color: "#A78BFA" },
                      { label: "Conversoes", value: simStats.totalConversions.toLocaleString("pt-BR"), sub: `${simStats.avgCpc.toFixed(2)} CPC`, color: "#22B07D" },
                      { label: "ROAS", value: `${simStats.avgRoas.toFixed(1)}x`, sub: "Retorno medio", color: simStats.avgRoas >= 3 ? "#22B07D" : "#F59E0B" },
                    ].map((kpi, i) => (
                      <div key={i} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: "18px 16px" }}>
                        <p style={{ fontSize: 12, color: "#8C93B8", margin: 0, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{kpi.label}</p>
                        <p style={{ fontSize: 24, fontWeight: 800, color: kpi.color, margin: "6px 0 2px", fontFamily: "'Space Grotesk', sans-serif" }}>{kpi.value}</p>
                        <p style={{ fontSize: 12, color: "#6B739E", margin: 0 }}>{kpi.sub}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Campanhas ativas</h3>
                  <p style={{ color: "#8C93B8", fontSize: 13, marginTop: 4 }}>Metricas atualizadas em tempo real</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {simCampaigns.map((c) => {
                    const st = STATUS_COLORS[c.status] || STATUS_COLORS.DRAFT;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedSimCampaign(c)}
                        style={{
                          background: "#121830",
                          border: "1px solid #232C52",
                          borderRadius: 12,
                          padding: "14px 18px",
                          display: "grid",
                          gridTemplateColumns: "1fr auto auto auto auto auto",
                          alignItems: "center",
                          gap: 16,
                          cursor: "pointer",
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3B4570")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#232C52")}
                      >
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: "#F3F5FF", fontSize: 15, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                          <p style={{ color: "#6B739E", fontSize: 12, margin: "3px 0 0 0" }}>{c.niche} · {c.countryCode}</p>
                        </div>
                        <div style={{ textAlign: "right" as const }}>
                          <p style={{ fontSize: 11, color: "#8C93B8", margin: 0 }}>Gasto</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#F97316", margin: 0, fontFamily: "monospace" }}>R$ {c.spent.toLocaleString("pt-BR")}</p>
                        </div>
                        <div style={{ textAlign: "right" as const }}>
                          <p style={{ fontSize: 11, color: "#8C93B8", margin: 0 }}>Receita</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#22B07D", margin: 0, fontFamily: "monospace" }}>R$ {c.revenue.toLocaleString("pt-BR")}</p>
                        </div>
                        <div style={{ textAlign: "right" as const }}>
                          <p style={{ fontSize: 11, color: "#8C93B8", margin: 0 }}>CTR</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "#60A5FA", margin: 0, fontFamily: "monospace" }}>{c.ctr.toFixed(1)}%</p>
                        </div>
                        <div style={{ textAlign: "right" as const }}>
                          <p style={{ fontSize: 11, color: "#8C93B8", margin: 0 }}>ROAS</p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: c.roas >= 3 ? "#22B07D" : c.roas >= 2 ? "#F59E0B" : "#F87171", margin: 0, fontFamily: "monospace" }}>{c.roas.toFixed(1)}x</p>
                        </div>
                        <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, color: st.color, background: st.bg, whiteSpace: "nowrap" }}>
                          {STATUS_LABELS[c.status] || c.status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {campaigns.length > 0 && (
                  <>
                    <div style={{ marginTop: 32, marginBottom: 16 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Suas campanhas</h3>
                      <p style={{ color: "#8C93B8", fontSize: 13, marginTop: 4 }}>Campanhas criadas por voce</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {campaigns.map((c) => {
                        const st = STATUS_COLORS[c.status] || STATUS_COLORS.DRAFT;
                        return (
                          <div key={c.id} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 600, color: "#F3F5FF", fontSize: 16, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.productName}</p>
                              <p style={{ color: "#8C93B8", fontSize: 14, margin: "4px 0 0 0" }}>{c.countryCode} · {new Date(c.createdAt).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ padding: "5px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, color: st.color, background: st.bg, whiteSpace: "nowrap" }}>
                                {STATUS_LABELS[c.status] || c.status}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedCampaign(c); }}
                                title="Ver detalhes"
                                style={{ padding: "6px 12px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 8, color: "#60A5FA", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                              >
                                Ver
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); if (confirm(`Excluir "${c.productName}"?${c.metaCampaignId ? " A campanha sera removida do Meta tambem." : ""}`)) handleDeleteCampaign(c.id, c.metaCampaignId); }}
                                disabled={deletingId === c.id}
                                title="Excluir campanha"
                                style={{ padding: "6px 10px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, color: "#F87171", fontSize: 14, cursor: deletingId === c.id ? "wait" : "pointer" }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowWizard(false); setCurrentStep(1); }}
                  style={{ background: "transparent", border: "none", color: "#8C93B8", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 16, padding: 0 }}
                >
                  ← Voltar para lista
                </button>
                <AdsFlowWizard onStepChange={handleStepChange} onClose={() => { setShowWizard(false); setCurrentStep(1); }} />
              </>
            )
          )}

          {currentPage === "campaigns" && <CampaignsPage />}
          {currentPage === "metrics" && <MetricsPage />}
          {currentPage === "creatives" && <CreativesPage />}
          {currentPage === "radar" && <AdRadarPage />}
          {currentPage === "ads-shop" && <AdsShopPage />}
          {currentPage === "install" && <InstallAppPage />}
          {currentPage === "settings" && <SettingsPage />}
          {currentPage === "plans" && <PlansPage />}
          {currentPage === "ia" && <IaPage />}
          {currentPage === "meta-api" && <MetaApiPage />}
          {currentPage === "support" && <SupportPage />}
        </main>
      </div>
      <InstallBanner />
      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSaved={(updated) => {
            setCampaigns((prev) => prev.map((c) => c.id === updated.id ? { ...c, ...updated } : c));
            setSelectedCampaign({ ...selectedCampaign, ...updated } as Campaign);
          }}
        />
      )}
      {selectedSimCampaign && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={() => setSelectedSimCampaign(null)}
        >
          <div
            style={{ background: "#0C1022", border: "1px solid #232C52", borderRadius: 18, width: "90%", maxWidth: 640, maxHeight: "85vh", overflow: "auto", padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1A2040", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>{selectedSimCampaign.name}</h3>
                <p style={{ fontSize: 13, color: "#8C93B8", margin: "4px 0 0 0" }}>{selectedSimCampaign.niche} · {selectedSimCampaign.country}</p>
              </div>
              <button onClick={() => setSelectedSimCampaign(null)} style={{ background: "transparent", border: "none", color: "#8C93B8", fontSize: 22, cursor: "pointer" }}>X</button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Gasto", value: `R$ ${selectedSimCampaign.spent.toLocaleString("pt-BR")}`, color: "#F97316" },
                  { label: "Receita", value: `R$ ${selectedSimCampaign.revenue.toLocaleString("pt-BR")}`, color: "#22B07D" },
                  { label: "Lucro", value: `R$ ${(selectedSimCampaign.revenue - selectedSimCampaign.spent).toLocaleString("pt-BR")}`, color: selectedSimCampaign.revenue > selectedSimCampaign.spent ? "#22B07D" : "#F87171" },
                  { label: "Impressoes", value: selectedSimCampaign.impressions.toLocaleString("pt-BR"), color: "#60A5FA" },
                  { label: "Cliques", value: selectedSimCampaign.clicks.toLocaleString("pt-BR"), color: "#A78BFA" },
                  { label: "CTR", value: `${selectedSimCampaign.ctr.toFixed(2)}%`, color: "#60A5FA" },
                  { label: "CPC", value: `R$ ${selectedSimCampaign.cpc.toFixed(2)}`, color: "#F97316" },
                  { label: "CPM", value: `R$ ${selectedSimCampaign.cpm.toFixed(2)}`, color: "#8B5CF6" },
                  { label: "ROAS", value: `${selectedSimCampaign.roas.toFixed(2)}x`, color: selectedSimCampaign.roas >= 3 ? "#22B07D" : "#F59E0B" },
                  { label: "Conversoes", value: selectedSimCampaign.conversions.toLocaleString("pt-BR"), color: "#22B07D" },
                  { label: "Budget/dia", value: `R$ ${selectedSimCampaign.budgetDaily}`, color: "#8C93B8" },
                  { label: "Funil", value: selectedSimCampaign.funnelStage === "topo" ? "Topo" : selectedSimCampaign.funnelStage === "meio" ? "Meio" : "Fundo", color: "#A78BFA" },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 11, color: "#8C93B8", margin: 0 }}>{m.label}</p>
                    <p style={{ fontSize: 17, fontWeight: 700, color: m.color, margin: "4px 0 0", fontFamily: "monospace" }}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 11, color: "#8C93B8", margin: "0 0 6px" }}>Link da presell</p>
                <p style={{ fontSize: 13, color: "#60A5FA", fontFamily: "monospace", wordBreak: "break-all", margin: 0 }}>{selectedSimCampaign.link}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
