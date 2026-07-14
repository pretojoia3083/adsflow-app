"use client";

import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080B14", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" as const }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(34,176,125,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 44 }}>
          ✅
        </div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: "#F3F5FF", marginBottom: 12 }}>
          Pagamento confirmado!
        </h1>
        <p style={{ color: "#8C93B8", fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
          Seu plano foi ativado com sucesso. Agora voce tem acesso a todas as funcionalidades do AdsFlow.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "16px 40px",
            background: "linear-gradient(90deg,#22B07D,#3FCB92)",
            color: "#080B14",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
}
