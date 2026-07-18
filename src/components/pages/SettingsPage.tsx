"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email] = useState(session?.user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [agencyLogo, setAgencyLogo] = useState("");
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
      } catch (err) {
        void err;
      }
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
      const result = e.target?.result;
      if (typeof result === "string") {
        if (type === "avatar") setAvatarUrl(result);
        else setAgencyLogo(result);
      }
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
    } catch (err) {
      void err;
    }
    setUploading(false);
  }

  const avatarBg = avatarUrl ? avatarUrl : "";
  const logoBg = agencyLogo ? agencyLogo : "";

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Configuracao</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Gerencie suas configuracoes de conta</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>

        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>Foto de Perfil</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
            <div
              onClick={() => { if (avatarInputRef.current) avatarInputRef.current.click(); }}
              style={{
                width: 100, height: 100, borderRadius: "50%",
                backgroundImage: avatarBg ? `url(${avatarBg})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: avatarBg ? "transparent" : "#22B07D",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "3px solid #232C52",
                flexShrink: 0,
              }}
            >
              {!avatarUrl && <span style={{ fontSize: 40, color: "#080B14", fontWeight: 700 }}>{name ? name.charAt(0).toUpperCase() : "?"}</span>}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { const files = e.target.files; if (files && files[0]) handleFileSelect(files[0], "avatar"); }}
            />
            <div>
              <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Sua foto</p>
              <p style={{ color: "#8C93B8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>Clique na foto para alterar. Maximo 2MB.</p>
              <button
                onClick={() => { if (avatarInputRef.current) avatarInputRef.current.click(); }}
                style={{ marginTop: 8, padding: "6px 14px", background: "rgba(34,176,125,0.1)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 8, color: "#3FCB92", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Alterar foto
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>Logo da Agencia</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
            <div
              onClick={() => { if (logoInputRef.current) logoInputRef.current.click(); }}
              style={{
                width: 120, height: 80, borderRadius: 12,
                backgroundImage: logoBg ? `url(${logoBg})` : "none",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: logoBg ? "#0C1022" : "#0C1022",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "2px dashed #232C52",
                flexShrink: 0,
              }}
            >
              {!agencyLogo && <span style={{ fontSize: 13, color: "#6B739E", textAlign: "center" }}>Logo</span>}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { const files = e.target.files; if (files && files[0]) handleFileSelect(files[0], "logo"); }}
            />
            <div>
              <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Logo da agencia</p>
              <p style={{ color: "#8C93B8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>Aparece nas presells e anuncios.</p>
              <button
                onClick={() => { if (logoInputRef.current) logoInputRef.current.click(); }}
                style={{ marginTop: 8, padding: "6px 14px", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 8, color: "#60A5FA", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Alterar logo
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>Dados da Conta</h3>

          <div style={{ marginBottom: 16 }}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Nome</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#F3F5FF", fontSize: 15, outline: "none", boxSizing: "border-box" as const }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <span style={{ color: "#8C93B8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Email</span>
            <input
              type="email"
              value={email}
              disabled
              style={{ width: "100%", padding: "12px 16px", background: "#0C1022", border: "1px solid #232C52", borderRadius: 10, color: "#6B739E", fontSize: 15, cursor: "not-allowed", boxSizing: "border-box" as const }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={uploading}
            style={{ padding: "12px 24px", background: saved ? "#3FCB92" : "linear-gradient(90deg,#22B07D,#3FCB92)", color: "#080B14", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: uploading ? "wait" : "pointer" }}
          >
            {uploading ? "Salvando..." : saved ? "Salvo!" : "Salvar alteracoes"}
          </button>
        </div>

        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 28 }}>
          <h3 style={{ color: "#F3F5FF", fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>Notificacoes</h3>

          {[
            { label: "Email de campanha ativa", desc: "Receba email quando uma campanha for publicada", checked: true },
            { label: "Alertas de orcamento", desc: "Aviso quando o orcamento diario for atingido", checked: true },
            { label: "Atualizacoes do sistema", desc: "Novidades e melhorias do AdsFlow", checked: false },
          ].map((n) => (
            <label key={n.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked={n.checked} style={{ marginTop: 3, width: 18, height: 18 }} />
              <div>
                <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 500, margin: 0 }}>{n.label}</p>
                <p style={{ color: "#8C93B8", fontSize: 13, margin: "2px 0 0" }}>{n.desc}</p>
              </div>
            </label>
          ))}
        </div>

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
