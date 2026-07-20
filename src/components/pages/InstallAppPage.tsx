"use client";

import { useState, useEffect } from "react";

export default function InstallAppPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    }
  }

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = typeof navigator !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Instalar App</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Instale o AdsFlow no seu computador ou celular</p>
      </div>

      {isInstalled || isStandalone ? (
        <div style={{ background: "#121830", border: "1px solid #A78BFA", borderRadius: 16, padding: "48px 40px", textAlign: "center" }}>
          <p style={{ fontSize: 48, margin: "0 0 16px" }}>✅</p>
          <p style={{ fontWeight: 700, fontSize: 22, color: "#A78BFA", margin: "0 0 10px" }}>App ja instalado!</p>
          <p style={{ color: "#8C93B8", fontSize: 15 }}>O AdsFlow esta instalado neste dispositivo.</p>
        </div>
      ) : (
        <>
          {deferredPrompt && (
            <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "40px", marginBottom: 20, textAlign: "center" }}>
              <p style={{ fontSize: 40, margin: "0 0 12px" }}>💻</p>
              <p style={{ fontWeight: 700, fontSize: 20, color: "#F3F5FF", margin: "0 0 8px" }}>Instalar no computador</p>
              <p style={{ color: "#8C93B8", fontSize: 15, marginBottom: 20 }}>Clique no botao abaixo para instalar o AdsFlow como um app no seu PC.</p>
              <button
                onClick={handleInstall}
                style={{ padding: "14px 32px", background: "linear-gradient(90deg,#8B5CF6,#A78BFA)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
              >
                Instalar agora
              </button>
            </div>
          )}

          {isIOS && (
            <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "40px", marginBottom: 20, textAlign: "center" }}>
              <p style={{ fontSize: 40, margin: "0 0 12px" }}>📱</p>
              <p style={{ fontWeight: 700, fontSize: 20, color: "#F3F5FF", margin: "0 0 8px" }}>Instalar no iPhone/iPad</p>
              <p style={{ color: "#8C93B8", fontSize: 15, marginBottom: 12 }}>
                1. Abra no <strong style={{ color: "#F3F5FF" }}>Safari</strong><br />
                2. Toque no botao <strong style={{ color: "#F3F5FF" }}>Compartilhar</strong> (quadrado com seta)<br />
                3. Selecione <strong style={{ color: "#F3F5FF" }}>Adicionar a Tela de Inicio</strong>
              </p>
            </div>
          )}

          {!deferredPrompt && !isIOS && (
            <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "40px", textAlign: "center" }}>
              <p style={{ fontSize: 40, margin: "0 0 12px" }}>📱</p>
              <p style={{ fontWeight: 700, fontSize: 20, color: "#F3F5FF", margin: "0 0 8px" }}>Instalar via navegador</p>
              <p style={{ color: "#8C93B8", fontSize: 15, marginBottom: 12 }}>
                No Chrome/Edge, clique no <strong style={{ color: "#F3F5FF" }}>ícone de instalar</strong> na barra de endereco, ou va em <strong style={{ color: "#F3F5FF" }}>Menu → Instalar App</strong>.
              </p>
            </div>
          )}

          <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "32px 40px", marginTop: 20 }}>
            <p style={{ fontWeight: 600, fontSize: 17, color: "#F3F5FF", margin: "0 0 16px" }}>Por que instalar?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "⚡", title: "Acesso rapido", desc: "Abra o AdsFlow com um clique na tela inicial" },
                { icon: "🔔", title: "Notificacoes", desc: "Receba alertas sobre suas campanhas" },
                { icon: "🚀", title: "Mais performace", desc: "Carregamento mais rapido e experiencia nativa" },
                { icon: "🖥️", title: "Tela cheia", desc: "Sem barra de endereco — espaco total para trabalhar" },
              ].map((f) => (
                <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: 0 }}>{f.title}</p>
                    <p style={{ color: "#8C93B8", fontSize: 14, margin: "2px 0 0" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
