"use client";

import { useState } from "react";

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
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Configuracao Meta Ads API</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Conecte sua conta do Meta Ads para publicar campanhas automaticamente</p>
      </div>

      {/* Passo a passo */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 36 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(34,176,125,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 15, fontWeight: 700, color: "#22B07D",
              }}>
                {step.num}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 24, background: "rgba(34,176,125,0.2)" }} />
              )}
            </div>
            <div style={{ paddingBottom: i < steps.length - 1 ? 24 : 0 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#F3F5FF", marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.6 }}>{step.desc}</div>
              {step.url && (
                <a href={step.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 13, color: "#3FCB92", textDecoration: "none" }}>
                  {step.url} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de configuracao */}
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
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#A0A8CE", marginBottom: 6 }}>ID da Conta de Anuncios</label>
            <input
              placeholder="Ex: act_123456789"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width: "100%", padding: "13px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" as const }}
            />
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: "14px 0",
              background: saved ? "#22B07D" : "linear-gradient(90deg,#22B07D,#3FCB92)",
              color: "#080B14",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {saved ? "✓ Salvo com sucesso!" : "Salvar configuracoes"}
          </button>
        </div>

        <div style={{ marginTop: 20, padding: 16, background: "rgba(96,165,250,0.06)", borderRadius: 10, border: "1px solid rgba(96,165,250,0.15)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#60A5FA", marginBottom: 4 }}>Dica de seguranca</div>
          <div style={{ fontSize: 13, color: "#8C93B8", lineHeight: 1.6 }}>
            Seu token e armazenado de forma criptografada. Ele so e usado para criar e gerenciar campanhas no Meta Ads pela sua conta autorizada.
          </div>
        </div>
      </div>
    </div>
  );
}
