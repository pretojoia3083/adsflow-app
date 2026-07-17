"use client";

import { useState, useEffect, useCallback } from "react";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true);

  useEffect(() => {
    if (isStandalone) return;
    const dismissed = localStorage.getItem("adsflow_install_dismissed_v2");
    if (dismissed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    const onInstalled = () => {
      setShow(false);
      localStorage.setItem("adsflow_install_dismissed_v2", "1");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isStandalone]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem("adsflow_install_dismissed_v2", "1");
    }
    setShow(false);
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem("adsflow_install_dismissed_v2", "1");
  }, []);

  if (isStandalone || !show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: "linear-gradient(135deg, #0f1728 0%, #162040 100%)",
        borderTop: "2px solid #22B07D",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
        animation: "slideUp 0.4s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, #22B07D, #3FCB92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
            <path d="M8 20C8 13.4 13.4 8 20 8" stroke="#080B14" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M16 20L8 20L8 12" stroke="#080B14" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: "#F3F5FF", margin: 0 }}>
            Instale o AdsFlow
          </p>
          <p style={{ fontSize: 12, color: "#8C93B8", margin: "2px 0 0" }}>
            Acesso rapido na tela inicial
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={dismiss}
          style={{
            padding: "10px 14px",
            background: "transparent",
            border: "1px solid #232C52",
            borderRadius: 8,
            color: "#8C93B8",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Depois
        </button>
        <button
          onClick={handleInstall}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(90deg, #22B07D, #3FCB92)",
            border: "none",
            borderRadius: 8,
            color: "#080B14",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Instalar
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
