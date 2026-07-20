"use client";

export default function SupportPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Suporte</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Precisa de ajuda? Estamos aqui para voce.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { icon: "💬", title: "Chat ao vivo", desc: "Fale com nossa equipe em tempo real. Disponivel de segunda a sexta, 9h as 18h.", action: "Iniciar chat" },
          { icon: "📧", title: "E-mail", desc: "Envie sua duvida para suporte@adsflow.com.br e retornamos em ate 24h.", action: "Enviar e-mail" },
          { icon: "📚", title: "Base de conhecimento", desc: "Artigos, tutoriais e FAQs para te ajudar a usar o AdsFlow.", action: "Ver artigos" },
          { icon: "🎥", title: "Videoaulas", desc: "Assista nossos videos explicativos sobre cada funcionalidade.", action: "Ver videos" },
        ].map((item) => (
          <div key={item.title} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: "22px 24px", display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#F3F5FF", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
            <button style={{ padding: "10px 20px", background: "transparent", border: "1px solid #232C52", borderRadius: 10, color: "#A78BFA", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
