"use client";

import { useState, useEffect } from "react";

const C = {
  bg: "#080B14",
  card: "#121830",
  border: "#232C52",
  green1: "#22B07D",
  green2: "#3FCB92",
  text: "#F3F5FF",
  muted: "#8C93B8",
  dim: "#5B628A",
  orange: "#F97316",
  purple: "#8B5CF6",
};

export default function GoogleAdsConfigPage() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [mccId, setMccId] = useState("");
  const [developerToken, setDeveloperToken] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/google/config");
        const data = await res.json();
        if (data.connected) {
          setConnected(true);
          setCustomerId(data.customerId || "");
          setMccId(data.mccId || "");
          setDeveloperToken(data.developerToken || "");
        }
      } catch {}
    }
    load();

    const params = new URLSearchParams(window.location.search);
    if (params.get("google_auth") === "success") {
      setConnected(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    if (params.get("google_auth") === "error") {
      setError("Erro na autenticacao com Google. Tente novamente.");
    }
  }, []);

  async function handleSave() {
    if (!customerId || !developerToken) {
      setError("Customer ID e Developer Token sao obrigatorios");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/google/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, developerToken, mccId }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setConnected(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || "Erro ao salvar");
      }
    } catch {
      setError("Erro de conexao");
    }
    setLoading(false);
  }

  async function handleOAuth() {
    if (!customerId || !developerToken) {
      setError("Preencha Customer ID e Developer Token primeiro");
      return;
    }
    const state = encodeURIComponent(JSON.stringify({ customerId, developerToken, mccId }));
    window.location.href = `/api/google/auth?state=${state}`;
  }

  async function handleValidate() {
    setValidating(true);
    try {
      const res = await fetch("/api/google/config/validate");
      const data = await res.json();
      setValid(data.valid);
    } catch {
      setValid(false);
    }
    setValidating(false);
  }

  async function handleDisconnect() {
    if (!confirm("Desconectar Google Ads?")) return;
    await fetch("/api/google/config", { method: "DELETE" });
    setConnected(false);
    setCustomerId("");
    setMccId("");
    setDeveloperToken("");
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 6 }}>
        Google Ads API
      </h2>
      <p style={{ fontSize: 15, color: C.muted, marginBottom: 28, lineHeight: 1.6 }}>
        Conecte sua conta Google Ads para criar campanhas diretamente pela plataforma.
      </p>

      {saved && (
        <div style={{ background: "rgba(34,176,125,0.12)", border: `1px solid ${C.green1}40`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, color: C.green2, fontSize: 14, fontWeight: 500 }}>
          ✓ Configuracao salva com sucesso!
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #EF444440", borderRadius: 12, padding: "14px 18px", marginBottom: 20, color: "#EF4444", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Status */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: connected ? "rgba(34,176,125,0.15)" : "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {connected ? "✓" : "🔍"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: connected ? C.green2 : C.text }}>
              {connected ? "Google Ads Conectado" : "Nao conectado"}
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>
              {connected ? `Conta: ${customerId}` : "Configure abaixo para comecar"}
            </div>
          </div>
          {connected && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={handleValidate} disabled={validating} style={{ background: "rgba(139,92,246,0.15)", border: `1px solid ${C.purple}40`, color: C.purple, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: validating ? "wait" : "pointer" }}>
                {validating ? "Testando..." : "Testar Conexao"}
              </button>
              <button onClick={handleDisconnect} style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #EF444440", color: "#EF4444", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Desconectar
              </button>
            </div>
          )}
        </div>

        {valid !== null && (
          <div style={{ background: valid ? "rgba(34,176,125,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${valid ? C.green1 : "#EF4444"}40`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: valid ? C.green2 : "#EF4444" }}>
            {valid ? "✓ Conexao valida! Google Ads API funcionando." : "✕ Token invalido ou expirado. Verifique suas credenciais."}
          </div>
        )}
      </div>

      {/* Config Form */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 18 }}>Credenciais</h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Customer ID *</label>
          <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="459-275-1442" style={{ width: "100%", padding: "12px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", fontFamily: "monospace" }} />
          <p style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>ID da sua conta Google Ads (aparece no canto superior direito do Google Ads)</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>MCC / Conta Gerente (opcional)</label>
          <input value={mccId} onChange={(e) => setMccId(e.target.value)} placeholder="Se tiver conta de gerente" style={{ width: "100%", padding: "12px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", fontFamily: "monospace" }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Developer Token *</label>
          <div style={{ position: "relative" }}>
            <input type={showToken ? "text" : "password"} value={developerToken} onChange={(e) => setDeveloperToken(e.target.value)} placeholder="Cole seu Developer Token aqui" style={{ width: "100%", padding: "12px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", fontFamily: "monospace", paddingRight: 60 }} />
            <button onClick={() => setShowToken(!showToken)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.dim, fontSize: 12, cursor: "pointer" }}>
              {showToken ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <p style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>Obtido em ads.google.com/aw/apicenter (precisa billing + campanha ativa)</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Client ID (OAuth2)</label>
            <input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Google Cloud Console" style={{ width: "100%", padding: "12px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", fontFamily: "monospace" }} />
            <p style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>Opcional — preenchido automaticamente se configurado no servidor</p>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Client Secret (OAuth2)</label>
            <input type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="Google Cloud Console" style={{ width: "100%", padding: "12px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, outline: "none", fontFamily: "monospace" }} />
            <p style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>Opcional — preenchido automaticamente se configurado no servidor</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handleSave} disabled={loading} style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.green1})`, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Salvando..." : "Salvar Credenciais"}
          </button>
          <button onClick={handleOAuth} disabled={!customerId || !developerToken} style={{ background: "rgba(34,176,125,0.15)", color: C.green1, border: `1px solid ${C.green1}40`, borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: !customerId || !developerToken ? "not-allowed" : "pointer", opacity: !customerId || !developerToken ? 0.4 : 1 }}>
            🔗 Conectar com Google
          </button>
        </div>
      </div>

      {/* How to get tokens */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Como obter as credenciais</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { step: "1", title: "Customer ID", desc: "Acesse ads.google.com/aw/overview — o ID aparece no canto superior direito (formato: 123-456-7890)", color: C.green1 },
            { step: "2", title: "Developer Token", desc: "Acesse ads.google.com/aw/apicenter — precisa de billing (cartao) e pelo menos 1 campanha ativa. Aprovacao ~24h", color: C.purple },
            { step: "3", title: "OAuth2 (opcional)", desc: "Crie no console.cloud.google.com — habilita Google Ads API, cria ID de cliente OAuth, escopo: adwords", color: C.orange },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}20`, border: `1px solid ${item.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: item.color, flexShrink: 0 }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
