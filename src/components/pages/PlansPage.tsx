"use client";

import { useState } from "react";

const plans = [
  {
    id: "mensal",
    name: "Mensal",
    price: "R$ 59,90",
    period: "/mes",
    highlight: false,
    features: [
      "Campanhas ilimitadas",
      "IA para copy e segmentacao",
      "Presell hospedada",
      "Analise de mercado",
      "Suporte via chat",
    ],
    cta: "Comecar agora",
  },
  {
    id: "semestral",
    name: "6 Meses",
    price: "R$ 299,90",
    period: "/6 meses",
    perMonth: "R$ 49,98/mes",
    highlight: true,
    badge: "Mais popular",
    features: [
      "Tudo do plano Mensal",
      "Economia de 17%",
      "Relatorios avancados",
      "Prioridade no suporte",
      "Integracao Meta Ads API",
      "Templates de presell premium",
    ],
    cta: "Assinar 6 meses",
  },
  {
    id: "anual",
    name: "Anual",
    price: "R$ 599,90",
    period: "/ano",
    perMonth: "R$ 49,99/mes",
    highlight: false,
    features: [
      "Tudo do plano 6 Meses",
      "Economia de 17%",
      "Acesso antecipado a novidades",
      "Suporte prioritario VIP",
      "Consultoria mensal (1h)",
      "API completa para automacao",
    ],
    cta: "Assinar anual",
  },
];

export default function PlansPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  async function handleCheckout(planId: string) {
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      //
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleManageSubscription() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/billing", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      //
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Planos</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Escolha o plano ideal para escalar seus anuncios</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.highlight ? "rgba(34,176,125,0.06)" : "#121830",
              border: plan.highlight ? "2px solid #22B07D" : "1px solid #232C52",
              borderRadius: 18,
              padding: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {plan.badge && (
              <div style={{ background: "linear-gradient(90deg,#22B07D,#3FCB92)", color: "#080B14", fontSize: 12, fontWeight: 700, textAlign: "center" as const, padding: "8px 0", textTransform: "uppercase" as const, letterSpacing: 1 }}>
                {plan.badge}
              </div>
            )}

            <div style={{ padding: "32px 28px" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: plan.highlight ? "#3FCB92" : "#8C93B8", marginBottom: 12, textTransform: "uppercase" as const, letterSpacing: 1 }}>
                {plan.name}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: "#F3F5FF", fontFamily: "'Space Grotesk', sans-serif" }}>{plan.price}</span>
              </div>

              {plan.perMonth && (
                <div style={{ fontSize: 14, color: "#8C93B8", marginBottom: 4 }}>{plan.perMonth}</div>
              )}

              <div style={{ fontSize: 14, color: "#6B739E", marginBottom: 28 }}>{plan.period}</div>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loadingPlan === plan.id}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: loadingPlan === plan.id ? "#1a7a55" : plan.highlight ? "linear-gradient(90deg,#22B07D,#3FCB92)" : "transparent",
                  color: plan.highlight ? "#080B14" : "#3FCB92",
                  border: plan.highlight ? "none" : "1px solid #232C52",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loadingPlan === plan.id ? "not-allowed" : "pointer",
                  marginBottom: 28,
                  transition: "all 0.15s",
                  opacity: loadingPlan && loadingPlan !== plan.id ? 0.5 : 1,
                }}
              >
                {loadingPlan === plan.id ? "Redirecionando..." : plan.cta}
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "#22B07D", fontSize: 16, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "#C0C6E0", fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gerenciar assinatura */}
      <div style={{ marginTop: 32, textAlign: "center" as const }}>
        <button
          onClick={handleManageSubscription}
          disabled={loadingPortal}
          style={{
            padding: "12px 24px",
            background: "transparent",
            border: "1px solid #232C52",
            borderRadius: 10,
            color: "#8C93B8",
            fontSize: 14,
            fontWeight: 500,
            cursor: loadingPortal ? "not-allowed" : "pointer",
          }}
        >
          {loadingPortal ? "Abrindo portal..." : "Ja tem assinatura? Gerenciar"}
        </button>
      </div>
    </div>
  );
}
