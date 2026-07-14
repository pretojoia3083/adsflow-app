"use client";

interface CountryIntel {
  name: string;
  code: string;
  searchVolume: number;
  competitionLevel: "baixa" | "media" | "alta";
  cpmEstimate: number;
  avgSpendPerDay: number;
  activeAds: number;
  successProbability: number;
  flag: string;
}

interface CompetitorAd {
  advertiser: string;
  headline: string;
  cta: string;
  estimatedSpend: string;
  platform: string;
  daysRunning: number;
}

interface IntelligenceData {
  productName: string;
  platform?: string;
  platformFocus?: string;
  platformCommission?: string;
  totalSearchVolume: number;
  globalCompetition: string;
  recommendedBudget: { min: number; suggested: number; aggressive: number };
  topCountries: CountryIntel[];
  competitors: CompetitorAd[];
  insights: string[];
  bestTimeToLaunch: string;
  estimatedRoi: string;
}

interface Props {
  data: IntelligenceData;
  C: Record<string, string>;
}

const COMP_COLORS: Record<string, { color: string; bg: string }> = {
  baixa: { color: "#3FCB92", bg: "rgba(63,203,146,0.12)" },
  media: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  alta: { color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

export default function MarketIntelligence({ data, C }: Props) {
  const maxVolume = Math.max(...data.topCountries.map((c) => c.searchVolume));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Banner da plataforma */}
      {data.platform && (
        <div style={{ background: "rgba(96,165,250,0.06)", borderRadius: 14, padding: 20, border: "1px solid rgba(96,165,250,0.15)", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(96,165,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🔗</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{data.platform}</div>
            <div style={{ fontSize: 14, color: C.muted }}>{data.platformFocus}</div>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontSize: 13, color: C.dim }}>Comissao media</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.green2, fontFamily: "'Space Grotesk', sans-serif" }}>{data.platformCommission}</div>
          </div>
        </div>
      )}

      {/* Resumo rapido */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Busca total", value: data.totalSearchVolume.toLocaleString(), icon: "🔍" },
          { label: "Concorrentes ativos", value: `${data.topCountries.reduce((a, c) => a + c.activeAds, 0).toLocaleString()}`, icon: "🎯" },
          { label: "Orcamento ideal", value: `R$ ${data.recommendedBudget.suggested}/dia`, icon: "💰" },
          { label: "ROI estimado", value: data.estimatedRoi.split(" e ")[0], icon: "📈" },
        ].map((item) => (
          <div key={item.label} style={{ background: C.bg, borderRadius: 12, padding: "18px 16px", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Mapa de calor - Volume de busca por pais */}
      <div style={{ background: C.bg, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>Volume de busca por pais</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Onde as pessoas mais pesquisam sobre seu produto</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.topCountries.slice(0, 8).map((country, i) => {
            const pct = maxVolume > 0 ? (country.searchVolume / maxVolume) * 100 : 0;
            const barColor = i === 0 ? C.green1 : i < 3 ? "#3B82F6" : "#4A5078";
            return (
              <div key={country.code} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22, width: 30, textAlign: "center" as const }}>{country.flag}</span>
                <span style={{ fontSize: 14, color: C.text, width: 110, fontWeight: i < 3 ? 600 : 400 }}>{country.name}</span>
                <div style={{ flex: 1, height: 24, background: "rgba(75,85,120,0.12)", borderRadius: 6, overflow: "hidden", position: "relative" as const }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 6, transition: "width 0.6s ease", minWidth: pct > 2 ? 0 : 4 }} />
                </div>
                <span style={{ fontSize: 14, color: C.muted, width: 60, textAlign: "right" as const, fontFamily: "monospace" }}>{country.searchVolume.toLocaleString()}</span>
                <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, color: COMP_COLORS[country.competitionLevel].color, background: COMP_COLORS[country.competitionLevel].bg, whiteSpace: "nowrap" }}>
                  {country.competitionLevel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quanto concorrentes investem */}
      <div style={{ background: C.bg, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>Quanto concorrentes investem</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Gastos estimados de anunciantes ativos no Meta Ads</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {data.competitors.map((comp, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{comp.advertiser}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.green2, fontFamily: "monospace" }}>{comp.estimatedSpend}</div>
              </div>
              <div style={{ fontSize: 14, color: C.muted, marginBottom: 8 }}>&quot;{comp.headline}&quot;</div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.dim }}>
                <span>CTA: {comp.cta}</span>
                <span>{comp.platform}</span>
                <span>{comp.daysRunning} dias ativo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendacao de investimento */}
      <div style={{ background: "rgba(34,176,125,0.06)", borderRadius: 14, padding: 24, border: `1px solid rgba(34,176,125,0.2)` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.green1, marginBottom: 16 }}>Recomendacao de investimento</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { label: "Minimo (teste)", value: `R$ ${data.recommendedBudget.min}`, desc: "7 dias para validar" },
            { label: "Ideal (recomendado)", value: `R$ ${data.recommendedBudget.suggested}`, desc: "14 dias para escalar" },
            { label: "Agressivo", value: `R$ ${data.recommendedBudget.aggressive}`, desc: "Dominar o nicho rapido" },
          ].map((item) => (
            <div key={item.label} style={{ background: C.bg, borderRadius: 12, padding: 18, border: `1px solid ${C.border}`, textAlign: "center" as const }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.dim, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: 1 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>/dia</div>
              <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights da IA */}
      <div style={{ background: C.bg, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Insights da IA</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.insights.map((insight, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: C.green1, fontSize: 16, flexShrink: 0, marginTop: 2 }}>→</span>
              <span style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{insight}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "14px 18px", background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, display: "flex", gap: 20, fontSize: 13 }}>
          <span><strong style={{ color: C.text }}>Melhor horario:</strong> <span style={{ color: C.muted }}>{data.bestTimeToLaunch}</span></span>
        </div>
      </div>
    </div>
  );
}
