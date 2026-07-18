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
import MetricsPage from "@/components/pages/MetricsPage";
import CreativesPage from "@/components/pages/CreativesPage";
import InstallAppPage from "@/components/pages/InstallAppPage";
import SettingsPage from "@/components/pages/SettingsPage";
import AdRadarPage from "@/components/pages/AdRadarPage";
import AdsShopPage from "@/components/pages/AdsShopPage";
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
  country: string;
  countryCode: string;
  status: string;
  createdAt: string;
  metaCampaignId: string | null;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  DRAFT: { color: "#8C93B8", bg: "rgba(140,147,184,0.12)" },
  READY: { color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  ACTIVE: { color: "#3FCB92", bg: "rgba(63,203,146,0.12)" },
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
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((d) => { if (d.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl); })
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    if (session && currentPage === "dashboard") {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((d) => { if (d.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl); })
        .catch(() => {});
    }
  }, [currentPage]);

  async function handleDeleteCampaign(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
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

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <span style={{ color: "#8C93B8", fontSize: 14 }}>{session.user?.name || session.user?.email}</span>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Campanhas</h2>
                    <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Gerencie suas campanhas de anuncios</p>
                  </div>
                  <button
                    onClick={() => setShowWizard(true)}
                    style={{ padding: "12px 24px", background: "linear-gradient(90deg,#22B07D,#3FCB92)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                  >
                    + Nova campanha
                  </button>
                </div>

                {loading ? (
                  <p style={{ color: "#8C93B8", fontSize: 14 }}>Carregando campanhas...</p>
                ) : campaigns.length === 0 ? (
                  <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "56px 40px", textAlign: "center" }}>
                    <p style={{ fontSize: 44, marginBottom: 16 }}>📋</p>
                    <p style={{ fontWeight: 700, fontSize: 20, color: "#F3F5FF", marginBottom: 10 }}>Nenhuma campanha ainda</p>
                    <p style={{ color: "#8C93B8", fontSize: 15, marginBottom: 28 }}>Crie sua primeira campanha em poucos passos com ajuda da IA.</p>
                    <button
                      onClick={() => setShowWizard(true)}
                      style={{ padding: "14px 28px", background: "linear-gradient(90deg,#22B07D,#3FCB92)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                    >
                      Criar primeira campanha
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {campaigns.map((c) => {
                      const s = STATUS_COLORS[c.status] || STATUS_COLORS.DRAFT;
                      return (
                        <div key={c.id} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 600, color: "#F3F5FF", fontSize: 16, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.productName}</p>
                            <p style={{ color: "#8C93B8", fontSize: 14, margin: "4px 0 0 0" }}>{c.countryCode} · {new Date(c.createdAt).toLocaleDateString("pt-BR")}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ padding: "5px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, color: s.color, background: s.bg, whiteSpace: "nowrap" }}>
                              {STATUS_LABELS[c.status] || c.status}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); if (confirm(`Excluir "${c.productName}"?`)) handleDeleteCampaign(c.id); }}
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
    </div>
  );
}
