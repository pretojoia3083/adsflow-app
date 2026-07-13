const s = {
  /* ───────── tokens ───────── */
  bg: "#080B14",
  card: "#121830",
  border: "#232C52",
  green1: "#22B07D",
  green2: "#5FD9A4",
  green3: "#3FCB92",
  pink: "#F72585",
  text: "#F3F5FF",
  muted: "#8C93B8",
  dim: "#5B628A",

  /* ───────── base ───────── */
  page: {
    background: "#080B14",
    color: "#F3F5FF",
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    overflowX: "hidden" as const,
  },
  section: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "clamp(48px, 8vw, 96px) clamp(16px, 4vw, 24px)",
  },
  h2: (extra?: React.CSSProperties): React.CSSProperties => ({
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 700,
    color: "#F3F5FF",
    marginBottom: 16,
    textAlign: "center" as const,
    ...extra,
  }),
  subtitle: (extra?: React.CSSProperties): React.CSSProperties => ({
    fontSize: "clamp(15px, 1.6vw, 18px)",
    color: "#8C93B8",
    textAlign: "center" as const,
    maxWidth: 620,
    margin: "0 auto 48px",
    lineHeight: 1.6,
    ...extra,
  }),
  btn: (
    bg: string,
    color: string,
    extra?: React.CSSProperties
  ): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 28px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "opacity .2s",
    ...extra,
    background: bg,
    color,
  }),
  card: (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "#121830",
    border: "1px solid #232C52",
    borderRadius: 16,
    padding: 28,
    ...extra,
  }),
} as const;

/* ================================================================== */
/*  SVG ICONS (inline)                                                */
/* ================================================================== */
const LogoIcon = ({ size = 32 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 96 96"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <rect width="96" height="96" rx="20" fill="#171A21" stroke="#262B36" />
    <path d="M24 32 L40 48 L52 38 L72 60" stroke="#22B07D" stroke-width="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 60 H72 V48" stroke="#22B07D" stroke-width="5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="32" r="4" fill="#3FCB92" />
    <circle cx="52" cy="38" r="4" fill="#3FCB92" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: 4 }}>
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ================================================================== */
/*  PAGE                                                              */
/* ================================================================== */
export default function Home() {
  return (
    <div style={s.page}>
      {/* ───────── HEADER ───────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(8,11,20,.82)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid #232C52",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px clamp(16px, 4vw, 24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <LogoIcon />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                display: "flex",
                alignItems: "baseline",
                gap: 1,
              }}
            >
              <span style={{ color: "#F3F5FF" }}>Ads</span>
              <span
                style={{
                  background: "linear-gradient(90deg,#22B07D,#5FD9A4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Flow
              </span>
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#5B628A",
                borderLeft: "1px solid #232C52",
                paddingLeft: 10,
                marginLeft: 4,
                lineHeight: 1.3,
                display: "inline-block",
              }}
            >
              Meta Ads<br />Automation
            </span>
          </a>

          {/* nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 32px)", flexWrap: "wrap" }}>
            {(
              [
                ["Recursos", "#recursos"],
                ["Como funciona", "#como-funciona"],
                ["Preços", "#precos"],
                ["Depoimentos", "#depoimentos"],
              ] as const
            ).map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{ color: "#8C93B8", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color .2s" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* auth buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/login"
              style={{
                ...s.btn("transparent", "#8C93B8", { border: "1px solid #232C52", padding: "10px 20px" }),
              }}
            >
              Entrar
            </a>
            <a
              href="/register"
              style={{
                ...s.btn("linear-gradient(90deg,#22B07D,#3FCB92)", "#080B14", { padding: "10px 22px" }),
              }}
            >
              Criar conta grátis
            </a>
          </div>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section style={{ ...s.section, paddingTop: "clamp(56px, 10vw, 100px)", paddingBottom: "clamp(56px, 10vw, 100px)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(32px, 5vw, 64px)",
            flexWrap: "wrap",
          }}
        >
          {/* left */}
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            {/* badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(34,176,125,.1)",
                border: "1px solid rgba(34,176,125,.25)",
                borderRadius: 999,
                padding: "6px 16px",
                fontSize: 13,
                color: "#5FD9A4",
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22B07D",
                  animation: "pulse 2s infinite",
                }}
              />
              Otimizando campanhas em tempo real
            </div>

            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#F3F5FF",
                marginBottom: 20,
              }}
            >
              Suas campanhas de{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#22B07D,#5FD9A4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Meta Ads
              </span>{" "}
              no piloto automático
            </h1>

            <p
              style={{
                fontSize: "clamp(15px, 1.6vw, 18px)",
                color: "#8C93B8",
                lineHeight: 1.7,
                marginBottom: 32,
                maxWidth: 520,
              }}
            >
              Automatize a criação, otimização e análise das suas campanhas no
              Meta Ads com inteligência artificial. Gaste menos tempo e gere mais
              resultados.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              <a
                href="/register"
                style={{
                  ...s.btn("linear-gradient(90deg,#22B07D,#3FCB92)", "#080B14", {
                    padding: "14px 32px",
                    fontSize: 16,
                  }),
                }}
              >
                Começar agora
              </a>
              <a
                href="#como-funciona"
                style={{
                  ...s.btn("transparent", "#F3F5FF", {
                    border: "1px solid #232C52",
                    padding: "14px 32px",
                    fontSize: 16,
                  }),
                }}
              >
                Ver como funciona
              </a>
            </div>

            <p style={{ fontSize: 13, color: "#5B628A" }}>
              ✓ Sem cartão de crédito · ✓ Configuração em 5 minutos
            </p>
          </div>

          {/* right – dashboard mock */}
          <div style={{ flex: "1 1 420px", minWidth: 300 }}>
            <div
              style={{
                ...s.card({ padding: 0, overflow: "hidden", border: "1px solid #232C52" }),
              }}
            >
              {/* top bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "14px 20px",
                  borderBottom: "1px solid #232C52",
                  background: "rgba(18,24,48,.6)",
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F72585" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F0A500" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22B07D" }} />
                <span style={{ fontSize: 12, color: "#5B628A", marginLeft: 12 }}>Painel de Campanhas</span>
              </div>

              <div style={{ padding: "24px 20px" }}>
                {/* kpi row */}
                <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                  {/* ROAS */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 120,
                      background: "rgba(34,176,125,.08)",
                      border: "1px solid rgba(34,176,125,.2)",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#8C93B8", marginBottom: 4 }}>ROAS</p>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#22B07D",
                      }}
                    >
                      4.2x
                    </p>
                  </div>
                  {/* CPL */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 120,
                      background: "rgba(34,176,125,.08)",
                      border: "1px solid rgba(34,176,125,.2)",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#8C93B8", marginBottom: 4 }}>Custo por lead</p>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#5FD9A4",
                      }}
                    >
                      R$6.80
                    </p>
                  </div>
                </div>

                {/* bar chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginBottom: 24 }}>
                  {[60, 45, 80, 55, 95, 70, 85].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: 6,
                        background: `linear-gradient(180deg,${i === 4 ? "#F72585" : "#22B07D"},${i === 4 ? "rgba(247,37,133,.3)" : "rgba(34,176,125,.2)"})`,
                        transition: "height .4s",
                      }}
                    />
                  ))}
                </div>

                {/* campaign rows */}
                {[
                  { name: "Black Friday - Conversão", status: "Ativa", color: "#22B07D" },
                  { name: "Lançamento Curso IA", status: "Ativa", color: "#22B07D" },
                  { name: "Retargeting - Site", status: "Pausada", color: "#F0A500" },
                ].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderTop: i > 0 ? "1px solid #232C52" : "none",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#F3F5FF" }}>{c.name}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: c.color,
                        background: `${c.color}18`,
                        padding: "4px 10px",
                        borderRadius: 999,
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* pulse keyframe */}
        <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}`}</style>
      </section>

      {/* ───────── STATS BAR ───────── */}
      <section style={{ borderTop: "1px solid #232C52", borderBottom: "1px solid #232C52" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 48px) clamp(16px, 4vw, 24px)",
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "+1.200", label: "Contas conectadas" },
            { value: "R$ 40M+", label: "Verba otimizada" },
            { value: "3.9x", label: "ROAS médio" },
            { value: "24/7", label: "Otimização" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", flex: "1 1 140px" }}>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 40px)",
                  fontWeight: 700,
                  background: "linear-gradient(90deg,#22B07D,#5FD9A4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 4,
                }}
              >
                {item.value}
              </p>
              <p style={{ fontSize: 14, color: "#8C93B8" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CAMPAIGNS BROWSER ───────── */}
      <section style={s.section}>
        <h2 style={s.h2()}>Suas campanhas do Meta Ads, organizadas em um só lugar</h2>
        <p style={s.subtitle()}>Visualize, gerencie e otimize todas as suas campanhas em uma interface simples e poderosa.</p>

        <div
          style={{
            ...s.card({ padding: 0, overflow: "hidden", maxWidth: 900, margin: "0 auto" }),
          }}
        >
          {/* browser top */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid #232C52",
              background: "rgba(18,24,48,.7)",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F72585" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F0A500" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22B07D" }} />
            <div
              style={{
                marginLeft: 12,
                flex: 1,
                background: "#080B14",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                color: "#5B628A",
              }}
            >
              app.adsflow.com/campanhas
            </div>
          </div>

          {/* table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
              gap: 12,
              padding: "12px 20px",
              fontSize: 12,
              fontWeight: 600,
              color: "#5B628A",
              borderBottom: "1px solid #232C52",
              textTransform: "uppercase" as const,
              letterSpacing: ".5px",
            }}
          >
            <span>Campanha</span>
            <span>Status</span>
            <span>Gasto</span>
            <span>ROAS</span>
            <span style={{ textAlign: "right" }}>Ação</span>
          </div>

          {/* rows */}
          {[
            { name: "Black Friday - Conversão", status: "Ativa", statusColor: "#22B07D", spend: "R$ 4.230", roas: "4.8x" },
            { name: "Lançamento Curso IA", status: "Ativa", statusColor: "#22B07D", spend: "R$ 2.870", roas: "3.6x" },
            { name: "Retargeting - Site", status: "Pausada", statusColor: "#F0A500", spend: "R$ 1.120", roas: "2.1x" },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                gap: 12,
                padding: "14px 20px",
                fontSize: 14,
                color: "#F3F5FF",
                borderTop: "1px solid #232C52",
                alignItems: "center",
              }}
            >
              <span>{r.name}</span>
              <span style={{ color: r.statusColor, fontWeight: 600, fontSize: 13 }}>{r.status}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{r.spend}</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "#22B07D",
                  fontWeight: 600,
                }}
              >
                {r.roas}
              </span>
              <span
                style={{
                  textAlign: "right",
                  fontSize: 12,
                  color: "#5FD9A4",
                  cursor: "pointer",
                }}
              >
                Ver detalhes
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── INTEGRATIONS ───────── */}
      <section style={{ borderTop: "1px solid #232C52", borderBottom: "1px solid #232C52" }}>
        <div style={{ ...s.section, padding: "clamp(40px, 6vw, 72px) clamp(16px, 4vw, 24px)" }}>
          <p
            style={{
              fontSize: 14,
              color: "#5B628A",
              textAlign: "center",
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              fontWeight: 600,
              marginBottom: 32,
            }}
          >
            Integra com as melhores plataformas
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 16,
              alignItems: "center",
            }}
          >
            {["Hotmart", "Kiwify", "ClickBank", "Eduzz", "Webvork"].map((name) => (
              <div
                key={name}
                style={{
                  ...s.card({ padding: "14px 28px", textAlign: "center", minWidth: 130 }),
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#F3F5FF",
                }}
              >
                {name}
              </div>
            ))}
            <div
              style={{
                ...s.card({ padding: "14px 28px", textAlign: "center", minWidth: 130 }),
                fontSize: 15,
                fontWeight: 600,
                color: "#5FD9A4",
                borderStyle: "dashed",
              }}
            >
              +20 plataformas
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section id="recursos" style={s.section}>
        <h2 style={s.h2()}>Tudo que você precisa para escalar seus anúncios</h2>
        <p style={s.subtitle()}>Ferramentas poderosas para automatizar e otimizar suas campanhas do Meta Ads.</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {[
            { icon: "⚡", title: "Criação automática", desc: "Gere criativos, copy e segmentação automaticamente com IA treinada em milhares de campanhas de alta performance." },
            { icon: "🎯", title: "Otimização IA", desc: "Algoritmo inteligente ajusta orçamento, bid e segmentação em tempo real para maximizar resultados." },
            { icon: "🧪", title: "Testes A/B", desc: "Crie e gerencie testes A/B automatizados para encontrar a melhor combinação de criativos e públicos." },
            { icon: "📈", title: "Relatórios", desc: "Dashboards em tempo real com métricas que importam: ROAS, CPL, CTR, conversões e muito mais." },
            { icon: "🔔", title: "Alertas", desc: "Receba notificações instantâneas quando uma campanha precisar de atenção ou atingir um objetivo." },
            { icon: "🔗", title: "Multi-contas", desc: "Gerencie múltiplas contas do Meta Ads em um só lugar. Ideal para agências e gestores de tráfego." },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                ...s.card({ transition: "border-color .2s, transform .2s" }),
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#22B07D";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#232C52";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(34,176,125,.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 16,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#F3F5FF",
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section id="como-funciona" style={{ borderTop: "1px solid #232C52", borderBottom: "1px solid #232C52" }}>
        <div style={s.section}>
          <h2 style={s.h2()}>Como funciona</h2>
          <p style={s.subtitle()}>Três passos simples para colocar suas campanhas no automático.</p>

          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              {
                step: "01",
                title: "Conecte sua conta do Meta Ads",
                desc: "Integração segura via API oficial do Meta. Seus dados estão protegidos e nunca são compartilhados.",
              },
              {
                step: "02",
                title: "Defina suas metas",
                desc: "Informe seu orçamento, público-alvo e objetivos. Nossa IA faz o resto trabalhar por você.",
              },
              {
                step: "03",
                title: "Deixe a automação otimizar",
                desc: "A AdsFlow monitora e ajusta suas campanhas 24/7, entregando os melhores resultados possíveis.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  ...s.card({ flex: "1 1 280px", maxWidth: 360, textAlign: "center", position: "relative" }),
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 48,
                    fontWeight: 700,
                    background: "linear-gradient(180deg,rgba(34,176,125,.25),transparent)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 8,
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#F3F5FF",
                    marginBottom: 12,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PRICING ───────── */}
      <section id="precos" style={s.section}>
        <h2 style={s.h2()}>Planos simples, sem surpresas</h2>
        <p style={s.subtitle()}>Escolha o plano ideal para o tamanho do seu negócio.</p>

        <div
          style={{
            display: "flex",
            gap: 24,
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          {/* Start */}
          <div
            style={{
              ...s.card({
                flex: "1 1 300px",
                maxWidth: 400,
                display: "flex",
                flexDirection: "column",
              }),
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: "#5B628A", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 8 }}>
              Start
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 700, color: "#F3F5FF" }}>
                R$99
              </span>
              <span style={{ fontSize: 16, color: "#5B628A" }}>/mês</span>
            </div>
            {[
              "Até 3 campanhas ativas",
              "Criação automática de criativos",
              "Relatórios semanais",
              "Suporte por e-mail",
              "1 conta Meta Ads",
            ].map((feat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ color: "#22B07D", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 14, color: "#8C93B8" }}>{feat}</span>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <a
              href="/register"
              style={{
                ...s.btn("transparent", "#F3F5FF", {
                  border: "1px solid #232C52",
                  marginTop: 24,
                  padding: "14px 0",
                  width: "100%",
                }),
              }}
            >
              Começar agora
            </a>
          </div>

          {/* Pro */}
          <div
            style={{
              ...s.card({
                flex: "1 1 300px",
                maxWidth: 400,
                display: "flex",
                flexDirection: "column",
                border: "2px solid #22B07D",
                position: "relative",
              }),
            }}
          >
            {/* badge */}
            <div
              style={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(90deg,#22B07D,#3FCB92)",
                color: "#080B14",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: 1,
                padding: "4px 16px",
                borderRadius: 999,
              }}
            >
              MAIS COMPLETO
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#22B07D", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 8, marginTop: 8 }}>
              Pro
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 700, color: "#F3F5FF" }}>
                R$149
              </span>
              <span style={{ fontSize: 16, color: "#5B628A" }}>/mês</span>
            </div>
            {[
              "Campanhas ilimitadas",
              "Criação automática de criativos",
              "Otimização IA em tempo real",
              "Testes A/B automatizados",
              "Relatórios diários + alertas",
              "Suporte prioritário via WhatsApp",
            ].map((feat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ color: "#22B07D", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 14, color: "#8C93B8" }}>{feat}</span>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <a
              href="/register"
              style={{
                ...s.btn("linear-gradient(90deg,#22B07D,#3FCB92)", "#080B14", {
                  marginTop: 24,
                  padding: "14px 0",
                  width: "100%",
                }),
              }}
            >
              Começar agora
            </a>
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section id="depoimentos" style={{ borderTop: "1px solid #232C52", borderBottom: "1px solid #232C52" }}>
        <div style={s.section}>
          <h2 style={s.h2()}>O que nossos clientes dizem</h2>
          <p style={s.subtitle()}>Gestores e empresas que já estão escalando com a AdsFlow.</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                name: "Rafael Martins",
                role: "Gestor de tráfego",
                text: "A AdsFlow revolucionou minha rotina. Consigo gerenciar 15 contas de clientes com a metade do tempo e os resultados melhoraram significativamente.",
              },
              {
                name: "Camila Souza",
                role: "E-commerce",
                text: "Nosso ROAS aumentou de 2.5x para 4.8x em apenas 2 meses. A otimização automática é absurdamente eficaz para quem vende online.",
              },
              {
                name: "Thiago Lima",
                role: "Infoprodutor",
                text: "Finalmente uma ferramenta que entende o que infoprodutor precisa. A criação automática de criativos me economiza horas por semana.",
              },
            ].map((t, i) => (
              <div key={i} style={s.card()}>
                {/* stars */}
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} style={{ color: "#F0A500", fontSize: 16 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.7, marginBottom: 20 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#22B07D,#3FCB92)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#080B14",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#F3F5FF" }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "#5B628A" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA BANNER ───────── */}
      <section style={{ ...s.section, textAlign: "center" }}>
        <div
          style={{
            background: "linear-gradient(135deg,rgba(34,176,125,.15),rgba(63,203,146,.08))",
            border: "1px solid rgba(34,176,125,.2)",
            borderRadius: 20,
            padding: "clamp(40px, 6vw, 72px) clamp(24px, 4vw, 48px)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 700,
              color: "#F3F5FF",
              marginBottom: 16,
            }}
          >
            Pronto para colocar suas campanhas no automático?
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "#8C93B8",
              marginBottom: 32,
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Comece gratuitamente e veja a diferença que a automação inteligente faz nos seus resultados.
          </p>
          <a
            href="/register"
            style={{
              ...s.btn("linear-gradient(90deg,#22B07D,#3FCB92)", "#080B14", {
                padding: "16px 40px",
                fontSize: 17,
              }),
            }}
          >
            Criar minha conta grátis
          </a>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer style={{ borderTop: "1px solid #232C52" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 24px)",
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {/* brand */}
          <div style={{ flex: "1 1 260px", minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <LogoIcon />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 1,
                }}
              >
                <span style={{ color: "#F3F5FF" }}>Ads</span>
                <span
                  style={{
                    background: "linear-gradient(90deg,#22B07D,#5FD9A4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Flow
                </span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.7, maxWidth: 280 }}>
              Automação inteligente de campanhas para Meta Ads. Otimize seus anúncios com o poder da inteligência artificial.
            </p>
          </div>

          {/* Produto */}
          <div style={{ minWidth: 140 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#F3F5FF", marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: 1 }}>
              Produto
            </p>
            {["Recursos", "Preços", "Como funciona", "Integrações"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                style={{ display: "block", fontSize: 14, color: "#8C93B8", textDecoration: "none", marginBottom: 10 }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Conta */}
          <div style={{ minWidth: 140 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#F3F5FF", marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: 1 }}>
              Conta
            </p>
            {["Entrar", "Criar conta", "Esqueci a senha"].map((l) => (
              <a
                key={l}
                href="/login"
                style={{ display: "block", fontSize: 14, color: "#8C93B8", textDecoration: "none", marginBottom: 10 }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Suporte */}
          <div style={{ minWidth: 180 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#F3F5FF", marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: 1 }}>
              Suporte
            </p>
            <a
              href="mailto:suporte@adsflow.com.br"
              style={{ display: "block", fontSize: 14, color: "#8C93B8", textDecoration: "none", marginBottom: 10 }}
            >
              suporte@adsflow.com.br
            </a>
            <a
              href="https://wa.me/5519988087838"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", fontSize: 14, color: "#8C93B8", textDecoration: "none", marginBottom: 10 }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div
          style={{
            borderTop: "1px solid #232C52",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px clamp(16px, 4vw, 24px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: "#5B628A" }}>© 2026 AdsFlow. Todos os direitos reservados.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={{ fontSize: 13, color: "#5B628A", textDecoration: "none" }}>Termos de uso</a>
            <a href="#" style={{ fontSize: 13, color: "#5B628A", textDecoration: "none" }}>Privacidade</a>
          </div>
        </div>
      </footer>

      {/* ───────── WHATSAPP FLOAT ───────── */}
      <a
        href="https://wa.me/5519988087838"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#22B07D,#3FCB92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(34,176,125,.4)",
          zIndex: 999,
          transition: "transform .2s",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#080B14">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
