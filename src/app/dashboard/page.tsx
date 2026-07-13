"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const COLORS = {
  bg: "#080B14",
  card: "#121826",
  border: "#232D40",
  accent: "#6366F1",
  text: "#E2E8F0",
  muted: "#94A3B8",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};

type Campaign = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  budget?: number | null;
};

const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  DRAFT: { bg: "rgba(148,163,184,0.15)", color: "#94A3B8", label: "DRAFT" },
  READY: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", label: "READY" },
  ACTIVE: {
    bg: "rgba(34,197,94,0.15)",
    color: "#22C55E",
    label: "ACTIVE",
  },
  PAUSED: {
    bg: "rgba(245,158,11,0.15)",
    color: "#F59E0B",
    label: "PAUSED",
  },
  COMPLETED: {
    bg: "rgba(99,102,241,0.15)",
    color: "#6366F1",
    label: "COMPLETED",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.5,
        background: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/campaigns")
        .then((res) => res.json())
        .then((data) => {
          setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
        })
        .catch(() => setCampaigns([]))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <p style={{ color: COLORS.muted, fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header
        style={{
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: COLORS.accent,
            letterSpacing: 2,
            margin: 0,
          }}
        >
          ADSFLOW
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>
            {session?.user?.name || session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.muted,
              fontSize: 13,
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLORS.error;
              e.currentTarget.style.color = COLORS.error;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.border;
              e.currentTarget.style.color = COLORS.muted;
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ padding: "32px", maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.text,
                margin: 0,
              }}
            >
              Campaigns
            </h2>
            <p
              style={{ color: COLORS.muted, fontSize: 14, marginTop: 4, margin: "4px 0 0 0" }}
            >
              Manage your advertising campaigns
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            style={{
              padding: "10px 20px",
              background: COLORS.accent,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            + New Campaign
          </button>
        </div>

        {showWizard && (
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 32,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ color: COLORS.text, fontSize: 18, margin: 0 }}>
                AdsFlowWizard
              </h3>
              <button
                onClick={() => setShowWizard(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.muted,
                  fontSize: 20,
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                x
              </button>
            </div>
            <p style={{ color: COLORS.muted, fontSize: 14 }}>
              Campaign wizard will be rendered here.
            </p>
          </div>
        )}

        {loading ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 64,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "rgba(99,102,241,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 28,
              }}
            >
              📊
            </div>
            <h3
              style={{
                color: COLORS.text,
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 8px 0",
              }}
            >
              No campaigns yet
            </h3>
            <p
              style={{
                color: COLORS.muted,
                fontSize: 14,
                margin: "0 0 24px 0",
              }}
            >
              Create your first campaign to start tracking performance.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              style={{
                padding: "10px 24px",
                background: COLORS.accent,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = COLORS.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = COLORS.border)
                }
              >
                <div>
                  <h4
                    style={{
                      color: COLORS.text,
                      fontSize: 15,
                      fontWeight: 600,
                      margin: "0 0 4px 0",
                    }}
                  >
                    {campaign.name}
                  </h4>
                  <span style={{ color: COLORS.muted, fontSize: 12 }}>
                    Created{" "}
                    {new Date(campaign.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <StatusBadge status={campaign.status} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
