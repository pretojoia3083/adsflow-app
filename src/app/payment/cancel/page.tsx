"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080B14", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" as const }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 44 }}>
          ⚠️
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: "#F3F5FF", marginBottom: 12 }}>
          Pagamento cancelado
        </h1>
        <p style={{ color: "#8C93B8", fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
          Nenhum valor foi cobrado. Voce pode escolher um plano a qualquer momento.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "16px 40px",
            background: "transparent",
            color: "#3FCB92",
            border: "1px solid #232C52",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
