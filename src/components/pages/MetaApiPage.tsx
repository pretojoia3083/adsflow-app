"use client";

import { useState, useEffect } from "react";

const steps = [
  {
    num: 1,
    title: "Crie um App no Meta for Developers",
    desc: "Acesse developers.facebook.com, faca login e clique em 'Meus Apps' > 'Criar App'. Escolha o tipo 'Business' e de um nome ao app.",
    url: "https://developers.facebook.com",
  },
  {
    num: 2,
    title: "Configure o Produto 'Marketing API'",
    desc: "No painel do app, va em 'Produtos' e adicione 'Marketing API'. Clique em 'Configurar' e siga o assistente.",
  },
  {
    num: 3,
    title: "Gere seu Access Token",
    desc: "Va em 'Ferramentas' > 'Gerador de Tokens'. Selecione o app que voce criou, escolha os permissoes necesarias (ads_management, ads_read) e gere o token de acesso.",
  },
  {
    num: 4,
    title: "Configure o Token no AdsFlow",
    desc: "Copie o token gerado e cole no campo abaixo. O AdsFlow usara ele para criar e gerenciar campanhas automaticamente.",
  },
  {
    num: 5,
    title: "Conecte sua Conta de Anuncios",
    desc: "Voce precisara do ID da conta de anuncios (ad_account_id). Va no Meta Ads Manager > Configuracoes > Informacoes da Conta para encontrar.",
  },
];

export default function MetaApiPage() {
  const [token, setToken] = useState("");
  const [accountId, setAccountId] = useState("");
  const [pixelId, setPixelId] = useState("");
  const [connected, setConnected] = useState(false);
  const [savedAccountId, setSavedAccountId] = useState("");
  const [savedPixelId, setSavedPixelId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenStatus, setTokenStatus] = useState<"idle" | "valid" | "invalid" | "checking">("idle");
  const [tokenError, setTokenError] = useState("");
  const [adAccounts, setAdAccounts] = useState<{ id: string; name: string; account_status: number; currency: string }[]>([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);

  useEffect(() => {
    fetch("/api/meta/config")
      .then((r) => r.json())
      .then(async (d) => {
        if (d.connected) {
          setConnected(true);
          setSavedAccountId(d.accountId);
          setSavedPixelId(d.pixelId || "");
          setPixelId(d.pixelId || "");
          setAccountId(d.accountId);
          setTokenStatus("checking");
          try {
            const valRes = await fetch("/api/meta/config/validate");
            const valData = await valRes.json();
            if (valData.valid) {
              setTokenStatus("valid");
            } else {
              setTokenStatus("invalid");
              setTokenError(valData.error || "Token invalido ou expirado");
            }
          } catch {
            setTokenStatus("invalid");
            setTokenError("Nao foi possivel validar o token");
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!token && !connected) {
      setError("Preencha o token de acesso");
      return;
    }
    if (!accountId && !connected) {
      setError("Preencha o ID da conta");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/meta/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token || undefined, accountId: accountId || undefined, pixelId: pixelId || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao salvar");
        setSaving(false);
        return;
      }
      setConnected(true);
      setSavedAccountId(accountId || savedAccountId);
      setSavedPixelId(pixelId);
      setSuccess(true);
      setToken("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Erro de conexao");
    }
    setSaving(false);
  }

  async function handleDisconnect() {
    await fetch("/api/meta/config", { method: "DELETE" });
    setConnected(false);
    setSavedAccountId("");
    setSavedPixelId("");
    setTokenStatus("idle");
  }

  async function fetchAdAccounts() {
    if (!token) {
      setError("Cole o token primeiro");
      return;
    }
    setFetchingAccounts(true);
    setError("");
    setAdAccounts([]);
    setFetchDone(false);
    try {
      const res = await fetch("/api/meta/ad-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao buscar contas");
      } else {
        setAdAccounts(data.accounts || []);
        setFetchDone(true);
        if (data.accounts?.length > 0) {
          setAccountId(data.accounts[0].id);
        }
      }
    } catch {
      setError("Erro ao conectar com Meta API");
    }
    setFetchingAccounts(false);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <p style={{ color: "#8C93B8", fontSize: 15 }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Configuracao Meta Ads API</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Conecte sua conta do Meta Ads para publicar campanhas automaticamente</p>
      </div>

      {connected && (
        <div style={{ background: tokenStatus === "invalid" ? "rgba(248,113,113,0.06)" : "rgba(167,139,250,0.06)", border: `1px solid ${tokenStatus === "invalid" ? "rgba(248,113,113,0.2)" : "rgba(167,139,250,0.2)"}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: tokenStatus === "invalid" ? "rgba(248,113,113,0.15)" : "rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {tokenStatus === "checking" ? "⏳" : tokenStatus === "invalid" ? "❌" : "✅"}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 17, color: tokenStatus === "invalid" ? "#F87171" : "#A78BFA", margin: 0 }}>
                  {tokenStatus === "checking" ? "Verificando token..." : tokenStatus === "invalid" ? "Token Invalido" : "Conta Conectada"}
                </p>
                <p style={{ color: "#8C93B8", fontSize: 14, margin: "4px 0 0" }}>Conta: {savedAccountId}{savedPixelId ? ` · Pixel: ${savedPixelId}` : ""}</p>
                {tokenStatus === "invalid" && tokenError && (
                  <p style={{ color: "#F87171", fontSize: 13, margin: "6px 0 0", lineHeight: 1.5 }}>{tokenError}. Gere um novo token no Meta for Developers e atualize abaixo.</p>
                )}
              </div>
            </div>
            <button onClick={handleDisconnect} style={{ padding: "10px 20px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, color: "#F87171", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Desconectar
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 36 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(139,92,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 15, fontWeight: 700, color: "#8B5CF6",
              }}>
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 24, background: "rgba(139,92,246,0.2)" }} />
              )}
            </div>
            <div style={{ paddingBottom: i < steps.length - 1 ? 24 : 0 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#F3F5FF", marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.6 }}>{step.desc}</div>
              {step.url && (
                <a href={step.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 13, color: "#A78BFA", textDecoration: "none" }}>
                  {step.url} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#F3F5FF", margin: "0 0 20px 0" }}>Suas Credenciais</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#A0A8CE", marginBottom: 6 }}>Access Token do Meta</label>
            <input
              type="password"
              placeholder="Cole seu access token aqui..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{ width: "100%", padding: "13px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" as const }}
            />
            <button
              onClick={fetchAdAccounts}
              disabled={fetchingAccounts}
              style={{ marginTop: 8, padding: "8px 16px", background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 8, color: "#60A5FA", fontSize: 13, fontWeight: 600, cursor: fetchingAccounts ? "wait" : "pointer" }}
            >
              {fetchingAccounts ? "Buscando contas..." : "🔍 Detectar minhas contas automaticamente"}
            </button>
          </div>

          {adAccounts.length > 0 && (
            <div style={{ padding: 16, background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 10 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#A0A8CE", marginBottom: 8 }}>Contas de anuncios encontradas:</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {adAccounts.map((acc) => (
                  <label key={acc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: accountId === acc.id ? "rgba(139,92,246,0.08)" : "#0C1022", border: `1px solid ${accountId === acc.id ? "rgba(139,92,246,0.3)" : "#232C52"}`, borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}>
                    <input type="radio" name="adAccount" checked={accountId === acc.id} onChange={() => setAccountId(acc.id)} style={{ accentColor: "#8B5CF6" }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#F3F5FF" }}>{acc.name}</div>
                      <div style={{ fontSize: 12, color: "#8C93B8", marginTop: 2 }}>ID: {acc.id} · Moeda: {acc.currency} · Status: {acc.account_status === 1 ? "Ativa" : `Codigo ${acc.account_status}`}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {fetchDone && adAccounts.length === 0 && (
            <div style={{ padding: 14, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 10 }}>
              <div style={{ fontSize: 14, color: "#F87171", fontWeight: 600, marginBottom: 4 }}>Nenhuma conta encontrada</div>
              <div style={{ fontSize: 13, color: "#F87171", opacity: 0.8, lineHeight: 1.5 }}>
                Verifique se: (1) O token tem permissoes ads_management, (2) O app esta em modo Live, (3) Sua conta de anuncios esta associada ao app em business.facebook.com.
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#A0A8CE", marginBottom: 6 }}>ID da Conta de Anuncios</label>
            <input
              placeholder="Ex: act_123456789"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width: "100%", padding: "13px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" as const }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#A0A8CE", marginBottom: 6 }}>Pixel do Meta (opcional)</label>
            <input
              placeholder="Ex: 1234567890 (necessario para campanhas de venda - fundo de funil)"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              style={{ width: "100%", padding: "13px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" as const }}
            />
            {!pixelId && (
              <div style={{ marginTop: 6, fontSize: 12, color: "#FBBF24", lineHeight: 1.5 }}>
                ⚠ Se nao preencher, o funil "Fundo (Vendas)" nao podera criar o conjunto de anuncios — voce precisara finalizar no Ads Manager.
              </div>
            )}
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, color: "#F87171", fontSize: 14 }}>{error}</div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "14px 0",
              background: success ? "#8B5CF6" : "linear-gradient(90deg,#8B5CF6,#A78BFA)",
              color: "#080B14",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: saving ? "wait" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {saving ? "Validando..." : success ? "✓ Salvo com sucesso!" : connected ? "Atualizar configuracoes" : "Salvar configuracoes"}
          </button>
        </div>

        <div style={{ marginTop: 20, padding: 16, background: "rgba(96,165,250,0.06)", borderRadius: 10, border: "1px solid rgba(96,165,250,0.15)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#60A5FA", marginBottom: 4 }}>Dica de seguranca</div>
          <div style={{ fontSize: 13, color: "#8C93B8", lineHeight: 1.6 }}>
            Seu token e armazenado de forma criptografada no banco de dados. Ele so e usado para criar e gerenciar campanhas no Meta Ads pela sua conta autorizada.
          </div>
        </div>
      </div>
    </div>
  );
}
