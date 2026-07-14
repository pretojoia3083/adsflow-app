"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha invalidos");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080B14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
            <svg width="64" height="64" viewBox="0 0 96 96" fill="none">
              <rect width="96" height="96" rx="20" fill="#171A21" stroke="#262B36" />
              <path d="M24 32 L40 48 L52 38 L72 60" stroke="#22B07D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 60 H72 V48" stroke="#22B07D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="32" r="4" fill="#3FCB92" />
              <circle cx="52" cy="38" r="4" fill="#3FCB92" />
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 36, display: "flex", alignItems: "baseline", gap: 1 }}>
              <span style={{ color: "#F3F5FF" }}>Ads</span>
              <span style={{ background: "linear-gradient(90deg,#22B07D,#5FD9A4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Flow</span>
            </span>
          </a>
          <p style={{ color: "#8C93B8", marginTop: 16, fontSize: 16 }}>
            Acesse seu painel de campanhas
          </p>
        </div>

        <div
          style={{
            background: "#121830",
            border: "1px solid #232C52",
            borderRadius: 18,
            padding: "40px 44px",
          }}
        >
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid #EF4444",
                borderRadius: 10,
                padding: "14px 18px",
                marginBottom: 24,
                color: "#EF4444",
                fontSize: 15,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", color: "#8C93B8", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "#080B14",
                  border: "1px solid #232C52",
                  borderRadius: 10,
                  color: "#F3F5FF",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#22B07D")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#232C52")}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", color: "#8C93B8", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
                Senha
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 18px",
                    background: "#080B14",
                    border: "1px solid #232C52",
                    borderRadius: 10,
                    color: "#F3F5FF",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#22B07D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#232C52")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6B739E",
                    fontSize: 18,
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 0",
                background: loading ? "#1a7a55" : "linear-gradient(90deg,#22B07D,#3FCB92)",
                color: "#080B14",
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 28, color: "#8C93B8", fontSize: 16 }}>
          Nao tem conta?{" "}
          <Link href="/register" style={{ color: "#22B07D", fontWeight: 600, textDecoration: "none" }}>
            Criar conta gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
