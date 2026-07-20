"use client";

import { useState, useEffect } from "react";

export default function IaPage() {
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasOpenaiKey, setHasOpenaiKey] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/profile?t=" + Date.now())
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.hasOpenaiKey) setHasOpenaiKey(true);
        if (d.user?.plan) setUserPlan(d.user.plan);
      })
      .catch(() => {});
  }, []);

  async function handleSaveApiKey() {
    if (!openaiApiKey || !openaiApiKey.startsWith("sk-")) return;
    try {
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openaiApiKey }),
      });
      setHasOpenaiKey(true);
      setApiKeySaved(true);
      setOpenaiApiKey("");
      setTimeout(() => setApiKeySaved(false), 2000);
    } catch {}
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>IA — Inteligencia Artificial</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>O que a IA faz por voce no AdsFlow</p>
      </div>

      <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: 0 }}>API Key da IA (OpenAI)</h3>
          <span style={{ fontSize: 11, fontWeight: 600, color: userPlan === "PRO" ? "#8B5CF6" : "#22B07D", background: userPlan === "PRO" ? "rgba(139,92,246,0.12)" : "rgba(34,176,125,0.12)", padding: "3px 8px", borderRadius: 99 }}>
            {userPlan === "PRO" ? "Plano Pro" : "Plano Basico"}
          </span>
        </div>
        <p style={{ color: "#8C93B8", fontSize: 13, marginTop: 8, marginBottom: 16, lineHeight: 1.5 }}>
          {userPlan === "PRO"
            ? "Voce esta no plano Pro — a IA da plataforma ja esta ativa. Nao precisa configurar nada."
            : "Para usar IA no plano Basico (R$30/mes), conecte sua propria API key da OpenAI. A chave e usada apenas para gerar copy, presells e analises. Nao e compartilhada."}
        </p>
        {userPlan !== "PRO" && (
          <>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>OpenAI API Key</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder={hasOpenaiKey ? "sk-...chave salva (digite uma nova para trocar)" : "sk-proj-..."}
                  style={{ flex: 1, padding: "12px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" as const }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{ padding: "12px 14px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, color: "#A78BFA", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {showApiKey ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
            {hasOpenaiKey && !openaiApiKey && (
              <p style={{ fontSize: 12, color: "#22B07D", marginTop: 8 }}>
                Chave salva e ativa. IA habilitada para gerar presells e copy.
              </p>
            )}
            {openaiApiKey && !openaiApiKey.startsWith("sk-") && (
              <p style={{ fontSize: 12, color: "#F87171", marginTop: 8 }}>
                Formato invalido. Deve comecar com sk-
              </p>
            )}
            <button
              onClick={handleSaveApiKey}
              style={{ marginTop: 14, padding: "10px 20px", background: apiKeySaved ? "#22B07D" : "rgba(34,176,125,0.15)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 10, color: apiKeySaved ? "#080B14" : "#22B07D", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              {apiKeySaved ? "Salvo!" : "Salvar API Key"}
            </button>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { icon: "🎯", title: "Segmentacao automatica", desc: "Analisa seu produto e gera interesses, palavras-chave e posicionamentos ideais para seu publico." },
          { icon: "✍️", title: "Copy de anuncios", desc: "Gera headline, texto principal, descricao e CTA otimizados para conversao." },
          { icon: "📊", title: "Analise de mercado", desc: "Estima CPM, nivel de competicao e saturacao do nicho no pais selecionado." },
          { icon: "🌐", title: "Presell inteligente", desc: "Cria pagina de pre-venda com cores e textos baseados no nicho do produto." },
          { icon: "💰", title: "Orcamento sugerido", desc: "Recomenda orcamento diario com base no CPM estimado e objetivos da campanha." },
          { icon: "🔄", title: "Otimizacao continua", desc: "Sugere melhorias nas campanhas baseado nos dados de desempenho (em breve)." },
        ].map((item) => (
          <div key={item.title} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#F3F5FF", marginBottom: 8 }}>{item.title}</div>
            <div style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: 24, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#8B5CF6", marginBottom: 8 }}>Como funciona</div>
        <div style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.7 }}>
          A IA do AdsFlow analisa as informacoes do seu produto (nome, descricao, publico, pais) e utiliza modelos de linguagem para gerar automaticamente todo o conteudo da campanha — desde a segmentacao ate o copy do anuncio. Tudo em segundos, sem precisar de especialista em trafego pago.
        </div>
      </div>
    </div>
  );
}
