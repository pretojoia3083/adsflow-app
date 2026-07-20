"use client";

export default function IaPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>IA — Inteligencia Artificial</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>O que a IA faz por voce no AdsFlow</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { icon: "🎯", title: "Segmentacao automatica", desc: "Analisa seu produto e gera interesses, palavras-chave e posicionamentos ideais para seu publico." },
          { icon: "✍️", title: "Copy de anuncios", desc: "Gera headline, texto principal, descricao e CTA otimizados para conversao." },
          { icon: "📊", title: "Analise de mercado", desc: "Estima CPM, nivel de competicao e saturacao do nicho no pais selecionado." },
          { icon: "🌐", title: "Presell inteligente", desc: "Cria pagina de pre-venda com cores e textos baseados no nicho do produto." },
          { icon: "💰", title: "Orcamento sugerido", desc: "Recomenda orcamento diario com base no CPM estimado e objetivos da campanha." },
          { icon: "🔄", title: "Otimizacao continua", desc: "Sugere melhorias nas campanhas baseado nos dados de desempenho (em breve)." },
        ].map((item) => (
          <div key={item.title} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#F3F5FF", marginBottom: 8 }}>{item.title}</div>
            <div style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: 24, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#8B5CF6", marginBottom: 8 }}>Como funciona</div>
        <div style={{ fontSize: 14, color: "#8C93B8", lineHeight: 1.7 }}>
          A IA do AdsFlow analisa as informacoes do seu produto (nome, descricao, publico, pais) e utiliza modelos de linguagem para gerar automaticamente todo o conteudo da campanha — desde a segmentacao ate o copy do anuncio. Tudo em segundos, sem precisar de especialista em trafego pago.
        </div>
      </div>
    </div>
  );
}
