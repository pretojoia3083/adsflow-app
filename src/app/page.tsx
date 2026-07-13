export default function Home() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#080B14", minHeight: "100vh", color: "#E2E8F0", margin: 0, padding: 0 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #080B14; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      ` }} />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          zIndex: 9999,
          textDecoration: "none",
          transition: "transform 0.2s",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Sticky Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(8,11,20,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#22B07D"/>
              <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "#FFFFFF" }}>
              AdsFlow
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[
              { label: "Recursos", href: "#recursos" },
              { label: "Como funciona", href: "#como-funciona" },
              { label: "Preços", href: "#precos" },
              { label: "Depoimentos", href: "#depoimentos" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/login"
              style={{
                color: "#E2E8F0",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 8,
                transition: "background 0.2s",
              }}
            >
              Entrar
            </a>
            <a
              href="/register"
              style={{
                background: "#22B07D",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: 8,
                transition: "background 0.2s",
              }}
            >
              Criar conta grátis
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left side */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(34,176,125,0.1)",
                border: "1px solid rgba(34,176,125,0.2)",
                borderRadius: 999,
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22B07D", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#5FD9A4", fontSize: 13, fontWeight: 600 }}>
                Otimizando campanhas em tempo real
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#FFFFFF",
                marginBottom: 20,
              }}
            >
              Suas campanhas de Meta Ads no piloto automático
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "#94A3B8",
                lineHeight: 1.6,
                marginBottom: 32,
                maxWidth: 480,
              }}
            >
              Automatize a criação, otimização e gestão das suas campanhas no Facebook e Instagram com inteligência artificial. Gaste menos,结果os melhores.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <a
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#22B07D",
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "14px 28px",
                  borderRadius: 10,
                  transition: "background 0.2s",
                }}
              >
                Começar agora
                <span style={{ fontSize: 18 }}>→</span>
              </a>
              <a
                href="#como-funciona"
                style={{
                  color: "#94A3B8",
                  fontSize: 16,
                  fontWeight: 500,
                  textDecoration: "none",
                  padding: "14px 20px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "border-color 0.2s",
                }}
              >
                Ver como funciona
              </a>
            </div>

            <p style={{ color: "#64748B", fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: "#22B07D" }}>✓</span> Sem cartão de crédito · <span style={{ color: "#22B07D" }}>✓</span> Configuração em 5 minutos
            </p>
          </div>

          {/* Right side - Dashboard mockup */}
          <div
            style={{
              background: "#0F1524",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                Dashboard
              </span>
              <span style={{ fontSize: 12, color: "#64748B" }}>Últimos 30 dias</span>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  background: "rgba(34,176,125,0.08)",
                  border: "1px solid rgba(34,176,125,0.15)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>ROAS</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: "#22B07D" }}>
                  4.2x
                </div>
              </div>
              <div
                style={{
                  background: "rgba(95,217,164,0.08)",
                  border: "1px solid rgba(95,217,164,0.15)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>Custo por lead</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: "#5FD9A4" }}>
                  R$6.80
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>Performance semanal</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
                {[60, 80, 45, 90, 70, 95, 85].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div
                      style={{
                        width: "100%",
                        height: h,
                        background: i === 5 ? "#22B07D" : "rgba(34,176,125,0.2)",
                        borderRadius: 4,
                      }}
                    />
                    <span style={{ fontSize: 10, color: "#64748B" }}>
                      {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign List */}
            <div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>Campanhas ativas</div>
              {[
                { name: "Conversão - Lookalike", status: "Otimizando", color: "#22B07D" },
                { name: "Retargeting - Carrinho", status: "Ativa", color: "#3FCB92" },
                { name: "Topo - Brand Awareness", status: "Pausada", color: "#F72585" },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#E2E8F0" }}>{c.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: c.color }}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        style={{
          background: "rgba(34,176,125,0.05)",
          borderTop: "1px solid rgba(34,176,125,0.1)",
          borderBottom: "1px solid rgba(34,176,125,0.1)",
          padding: "40px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
          {[
            { value: "+1.200", label: "Contas conectadas" },
            { value: "R$ 40M+", label: "Verba otimizada" },
            { value: "3.9x", label: "ROAS médio" },
            { value: "24/7", label: "Otimização" },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: "#22B07D", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: "#94A3B8" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Campaigns Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 48,
          }}
        >
          Suas campanhas do Meta Ads, organizadas em um só lugar
        </h2>

        {/* Browser Mockup */}
        <div
          style={{
            background: "#0F1524",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Browser bar */}
          <div
            style={{
              background: "#161D2E",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F72585" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22B07D" }} />
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 6,
                padding: "6px 12px",
                marginLeft: 12,
                fontSize: 12,
                color: "#64748B",
              }}
            >
              app.adsflow.com/campanhas
            </div>
          </div>

          {/* Table */}
          <div style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Campanha", "Status", "Orçamento", "ROAS", "Leads"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#64748B",
                        textTransform: "uppercase" as const,
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Black Friday - Conversão", status: "Ativa", statusColor: "#22B07D", budget: "R$ 150/dia", roas: "5.1x", leads: "1.247" },
                  { name: "Stories Remarketing", status: "Otimizando", statusColor: "#5FD9A4", budget: "R$ 80/dia", roas: "3.8x", leads: "892" },
                  { name: "Topo de funil - Branding", status: "Pausada", statusColor: "#F72585", budget: "R$ 200/dia", roas: "2.4x", leads: "3.156" },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "16px 20px", fontSize: 14, color: "#E2E8F0", fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: row.statusColor,
                          background: `${row.statusColor}15`,
                          padding: "4px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#94A3B8" }}>{row.budget}</td>
                    <td style={{ padding: "16px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#22B07D", fontWeight: 600 }}>{row.roas}</td>
                    <td style={{ padding: "16px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#94A3B8" }}>{row.leads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24, fontWeight: 500 }}>Integra com suas plataformas favoritas</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          {["Hotmart", "Kiwify", "ClickBank", "Eduzz", "Webvork"].map((name) => (
            <div
              key={name}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "16px 28px",
                fontSize: 15,
                fontWeight: 600,
                color: "#94A3B8",
              }}
            >
              {name}
            </div>
          ))}
          <div
            style={{
              background: "rgba(34,176,125,0.08)",
              border: "1px solid rgba(34,176,125,0.2)",
              borderRadius: 12,
              padding: "16px 28px",
              fontSize: 15,
              fontWeight: 600,
              color: "#22B07D",
            }}
          >
            +20 plataformas
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#22B07D", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" as const }}>
            Recursos
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Tudo que você precisa em uma plataforma
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            {
              title: "Criação automática",
              desc: "Gere campanhas completas com segmentação, criativos e orçamento em segundos com IA.",
              icon: "⚡",
            },
            {
              title: "Otimização com IA",
              desc: "A inteligência artificial ajusta lances, públicos e criativos para maximizar seus resultados.",
              icon: "🧠",
            },
            {
              title: "Testes A/B",
              desc: "Teste variações de anúncios automaticamente e escale os vencedores.",
              icon: "🔬",
            },
            {
              title: "Relatórios em tempo real",
              desc: "Acompanhe métricas como ROAS, CPA e conversões em dashboards atualizados.",
              icon: "📊",
            },
            {
              title: "Alertas inteligentes",
              desc: "Receba notificações quando algo precisar de atenção: orçamento, CTR, frequência.",
              icon: "🔔",
            },
            {
              title: "Multi-contas",
              desc: "Gerencie várias contas de anúncios e projetos em um único painel centralizado.",
              icon: "👥",
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: "#0D1220",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: 28,
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{feature.icon}</div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#22B07D", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" as const }}>
            Como funciona
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Pronto em 3 passos simples
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {[
            {
              step: "01",
              title: "Conecte sua conta Meta Ads",
              desc: "Autorize o acesso seguro à sua conta de anúncios com um clique. Seus dados estão protegidos.",
            },
            {
              step: "02",
              title: "Defina suas metas",
              desc: "Informe seu orçamento, público-alvo e objetivos. A IA cuida do resto.",
            },
            {
              step: "03",
              title: "Deixe a automação otimizar",
              desc: "A IA ajusta campanhas 24/7, reduzindo custo e aumentando resultados automaticamente.",
            },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(34,176,125,0.1)",
                  border: "1px solid rgba(34,176,125,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#22B07D",
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginBottom: 10,
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#22B07D", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" as const }}>
            Preços
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Planos para cada fase do seu negócio
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, margin: "0 auto" }}>
          {/* Start Plan */}
          <div
            style={{
              background: "#0D1220",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: 36,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8", marginBottom: 8 }}>Start</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, color: "#FFFFFF" }}>R$99</span>
              <span style={{ fontSize: 14, color: "#64748B" }}>/mês</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "1 conta Meta Ads",
                "Otimização automática com IA",
                "Relatórios em tempo real",
                "Integração com plataformas",
                "Suporte por e-mail",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94A3B8" }}>
                  <span style={{ color: "#22B07D", fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/register"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 28,
                padding: "12px 0",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              Começar grátis
            </a>
          </div>

          {/* Pro Plan */}
          <div
            style={{
              background: "#0D1220",
              border: "1px solid rgba(34,176,125,0.3)",
              borderRadius: 20,
              padding: 36,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#22B07D",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 14px",
                borderRadius: 999,
                textTransform: "uppercase" as const,
                letterSpacing: 0.5,
              }}
            >
              Mais popular
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#22B07D", marginBottom: 8 }}>Pro</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, color: "#FFFFFF" }}>R$149</span>
              <span style={{ fontSize: 14, color: "#64748B" }}>/mês</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "5 contas Meta Ads",
                "Testes A/B automatizados",
                "Alertas inteligentes",
                "Regras personalizadas",
                "+20 plataformas integradas",
                "Suporte prioritário",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94A3B8" }}>
                  <span style={{ color: "#22B07D", fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/register"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 28,
                padding: "12px 0",
                borderRadius: 10,
                background: "#22B07D",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              Começar agora
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#22B07D", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" as const }}>
            Depoimentos
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Quem já usa, recomenda
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            {
              name: "Rafael Martins",
              role: "Infoprodutor",
              text: "Reduzi meu CPA em 40% no primeiro mês. A automação da AdsFlow é absurdamente boa. Não perco mais tempo ajustando campanha manualmente.",
            },
            {
              name: "Camila Souza",
              role: "Gestora de Tráfego",
              text: "Gerencio 12 contas de clientes e a AdsFlow salvou minha vida. Os relatórios em tempo real e os alertas inteligentes são incríveis.",
            },
            {
              name: "Thiago Lima",
              role: "E-commercer",
              text: "Meu ROAS subiu de 2.1x para 4.5x em 45 dias. A IA realmente entende o que funciona para cada público. Ferramenta indispensável.",
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                background: "#0D1220",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: 28,
              }}
            >
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: "#F59E0B", fontSize: 16 }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(34,176,125,0.15), rgba(247,37,133,0.08))",
            border: "1px solid rgba(34,176,125,0.2)",
            borderRadius: 24,
            padding: "60px 48px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Pronto para colocar suas campanhas no automático?
          </h2>
          <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
            Comece gratuitamente e veja a diferença que a automação inteligente faz nos seus resultados.
          </p>
          <a
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#22B07D",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: 10,
              transition: "background 0.2s",
            }}
          >
            Criar conta grátis
            <span style={{ fontSize: 18 }}>→</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#22B07D"/>
                <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#FFFFFF" }}>
                AdsFlow
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, maxWidth: 280 }}>
              Automatize suas campanhas de Meta Ads com inteligência artificial. Gaste menos,结果os melhores.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 16 }}>Produto</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Recursos", "Preços", "Integrações", "Como funciona"].map((link) => (
                <a key={link} href="#" style={{ fontSize: 14, color: "#64748B", textDecoration: "none" }}>{link}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 16 }}>Conta</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Entrar", "Criar conta", "Dashboard"].map((link) => (
                <a key={link} href="#" style={{ fontSize: 14, color: "#64748B", textDecoration: "none" }}>{link}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 16 }}>Suporte</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Central de ajuda", "Contato", "Termos de uso", "Privacidade"].map((link) => (
                <a key={link} href="#" style={{ fontSize: 14, color: "#64748B", textDecoration: "none" }}>{link}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "40px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#475569" }}>
            © 2025 AdsFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
