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
import AdminPanel from "@/components/pages/AdminPanel";
import InstallBanner from "@/components/InstallBanner";

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
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("USER");
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        .then((d) => {
          if (d.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl);
          if (d.user?.plan) setUserPlan(d.user.plan);
          if (d.user?.role) setUserRole(d.user.role);
          if (d.user?.subscription?.currentPeriod) setSubscriptionEnd(d.user.subscription.currentPeriod);
        })
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

  const isPaid = userPlan === "BASICO" || userPlan === "PRO";
  const isAdmin = userRole === "ADMIN";
  const isFree = userPlan !== null && !isPaid && !isAdmin;
  const freePages: SidebarPage[] = ["plans", "settings", "support"];
  const isPageBlocked = isFree && !freePages.includes(currentPage);

  if (userPlan !== null && !isPaid && !isAdmin && currentPage === "plans") {
    // allow plans page to show inline below
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080B14", fontFamily: "'Inter', sans-serif", display: "flex" }}>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} userName={session.user?.name || session.user?.email || ""} avatarUrl={avatarUrl} isAdmin={isAdmin} onMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ borderBottom: "1px solid #1A2040", padding: "14px clamp(12px, 3vw, 32px)", display: "flex", alignItems: "center", gap: 12, background: "#0C1022" }}>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{ display: "none", background: "transparent", border: "none", color: "#F3F5FF", fontSize: 22, cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}
            className="mobile-menu-btn"
          >
            &#9776;
          </button>

          {showWizard && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <Stepper labels={STEP_NAMES} currentStep={currentStep} />
            </div>
          )}

          {!showWizard && <div style={{ flex: 1 }} />}

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
            {isPaid && (
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, color: userPlan === "PRO" ? "#8B5CF6" : "#22B07D", background: userPlan === "PRO" ? "rgba(139,92,246,0.12)" : "rgba(34,176,125,0.12)" }}>
                {userPlan === "PRO" ? "Pro" : "Basico"}
              </span>
            )}
            {isPaid && subscriptionEnd && (
              <span className="hide-mobile" style={{ fontSize: 12, color: "#6B739E" }}>
                Expira: {new Date(subscriptionEnd).toLocaleDateString("pt-BR")}
              </span>
            )}
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
            <span className="hide-mobile" style={{ color: "#8C93B8", fontSize: 14 }}>{session.user?.name || session.user?.email}</span>
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
          {isPageBlocked ? (
            <div style={{ textAlign: "center", padding: "80px 32px" }}>
              <p style={{ fontSize: 52, marginBottom: 16 }}>&#128274;</p>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#F3F5FF", margin: "0 0 10px" }}>Funcionalidade bloqueada</h2>
              <p style={{ color: "#8C93B8", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
                Assine um plano para desbloquear todas as funcionalidades.
              </p>
              <button
                onClick={() => handleNavigate("plans")}
                style={{ padding: "14px 32px", background: "linear-gradient(90deg,#8B5CF6,#22B07D)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                Ver planos
              </button>
            </div>
          ) : currentPage === "dashboard" ? (
            !showWizard ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Campanhas</h2>
                    <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Gerencie suas campanhas de anuncios</p>
                  </div>
                  <button
                    onClick={() => setShowWizard(true)}
                    style={{ padding: "12px 24px", background: "linear-gradient(90deg,#8B5CF6,#22B07D)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                  >
                    + Nova campanha
                  </button>
                </div>

                {loading ? (
                  <p style={{ color: "#8C93B8", fontSize: 14 }}>Carregando campanhas...</p>
                ) : campaigns.length === 0 ? (
                  <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "56px 40px", textAlign: "center" }}>
                    <p style={{ fontSize: 44, marginBottom: 16 }}>&#128203;</p>
                    <p style={{ fontWeight: 700, fontSize: 20, color: "#F3F5FF", marginBottom: 10 }}>Nenhuma campanha ainda</p>
                    <p style={{ color: "#8C93B8", fontSize: 15, marginBottom: 28 }}>Crie sua primeira campanha em poucos passos com ajuda da IA.</p>
                    <button
                      onClick={() => setShowWizard(true)}
                      style={{ padding: "14px 28px", background: "linear-gradient(90deg,#8B5CF6,#22B07D)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                    >
                      Criar primeira campanha
                    </button>
                  </div>
                ) : (
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
                              &#128465;&#65039;
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowWizard(false); setCurrentStep(1); }}
                  style={{ background: "transparent", border: "none", color: "#8C93B8", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 16, padding: 0 }}
                >
                  &#8592; Voltar para lista
                </button>
                <AdsFlowWizard onStepChange={handleStepChange} onClose={() => { setShowWizard(false); setCurrentStep(1); }} />
              </>
            )
          ) : (
            <>
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
              {currentPage === "admin" && isAdmin && <AdminPanel />}
            </>
          )}
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
    </div>
  );
}
