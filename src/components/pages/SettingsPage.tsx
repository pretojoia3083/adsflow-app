"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email] = useState(session?.user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(session?.user?.image || "");
  const [agencyLogo, setAgencyLogo] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.user) {
          if (data.user.avatarUrl) setAvatarUrl(data.user.avatarUrl);
          if (data.user.agencyLogo) setAgencyLogo(data.user.agencyLogo);
          if (data.user.name) setName(data.user.name);
        }
      } catch {}
    }
    loadProfile();
  }, []);

  function handleFileSelect(file: File, type: "avatar" | "logo") {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Arquivo muito grande. Maximo 2MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Apenas imagens sao aceitas.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (type === "avatar") setAvatarUrl(base64);
      else setAgencyLogo(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setUploading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: avatarUrl, agencyLogo }),
      });
      if (res.ok) {
        await update({ name });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {}
    setUploading(false);
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Configuracao</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Gerencie suas configuracoes de conta</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
        {/* Foto de Perfil */}
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px }}>Foto de Perfil</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
            <div
              onClick={() => avatarInputRef.current?.click()}
              style={{
                width: 100, height: 100, borderRadius: "50%",
                background: avatarUrl ? `url(${avatarUrl}) center/cover` : "linear-gradient(135deg, #22B07D, #3FCB92)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "3px solid #232C52", transition: "border-color 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#22B07D"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#232C52"}
            >
              {!avatarUrl && <span style={{ fontSize: 40, color: "#080B14", fontWeight: 700 }}>{name?.charAt(0)?.toUpperCase() || "?"}</span>}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "avatar")}
            />
            <div>
              <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Sua foto</p>
              <p style={{ color: "#8C93B8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>Clique na foto para alterar. Maximo 2MB.</p>
              <button
                onClick={() => avatarInputRef.current?.click()}
                style={{ marginTop: 8, padding: "6px 14px", background: "rgba(34,176,125,0.1)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 8, color: "#3FCB92", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Alterar foto
              </button>
            </div>
          </div>
        </div>

        {/* Logo da Agencia */}
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px }}>Logo da Agencia</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
            <div
              onClick={() => logoInputRef.current?.click()}
              style={{
                width: 120, height: 80, borderRadius: 12,
                background: agencyLogo ? `url(${agencyLogo}) center/contain no-repeat #0C1022` : "#0C1022",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "2px dashed #232C52", transition: "border-color 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#22B07D"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#232C52"}
            >
              {!agencyLogo && <span style={{ fontSize: 13, color: "#6B739E", textAlign: "center" }}>Logo</span>}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "logo")}
            />
            <div>
              <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Logo da agencia</p>
              <p style={{ color: "#8C93B8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>Aparece nas presells e anuncios.</p>
              <button
                onClick={() => logoInputRef.current?.click()}
                style={{ marginTop: 8, padding: "6px 14px", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 8, color: "#60A5FA", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Alterar logo
              </button>
            </div>
          </div>
        </div>

        {/* Dados da Conta */}
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px }}>Dados da Conta</h3>

          <label style={{ display: "block", marginBottom: 16 }}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Nome</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Email</span>
            <input
              type="email"
              value={email}
              disabled
              style={{ width: "100%", padding: "12px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#6B739E", fontSize: 15, cursor: "not-allowed", boxSizing: "border-box" }}
            />
          </label>

          <button
            onClick={handleSave}
            disabled={uploading}
            style={{ padding: "12px 24px", background: saved ? "#3FCB92" : "linear-gradient(90deg,#22B07D,#3FCB92)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}
          >
            {uploading ? "Salvando..." : saved ? "Salvo!" : "Salvar alteracoes"}
          </button>
        </div>

        {/* Notificacoes */}
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>Notificacoes</h3>

          {[
            { label: "Email de campanha ativa", desc: "Receba email quando uma campanha for publicada", checked: true },
            { label: "Alertas de orcamento", desc: "Aviso quando o orcamento diario for atingido", checked: true },
            { label: "Atualizacoes do sistema", desc: "Novidades e melhorias do AdsFlow", checked: false },
          ].map((n) => (
            <label key={n.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked={n.checked} style={{ marginTop: 3, accentColor: "#22B07D", width: 18, height: 18 }} />
              <div>
                <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 500, margin: 0 }}>{n.label}</p>
                <p style={{ color: "#8C93B8", fontSize: 13, margin: "2px 0 0" }}>{n.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Zona de Perigo */}
        <div style={{ background: "#121830", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F87171", fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>Zona de Perigo</h3>
          <p style={{ color: "#8C93B8", fontSize: 14, marginBottom: 20 }}>Acoes irreversiveis para sua conta.</p>
          <button
            style={{ padding: "10px 20px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, color: "#F87171", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Excluir conta
          </button>
        </div>
      </div>
    </div>
  );
}
