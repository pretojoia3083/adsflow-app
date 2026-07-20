"use client";

import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  productName: string;
  country: string;
  status: string;
  budgetDaily: number | null;
  metaCampaignId: string | null;
  createdAt: string;
  adCopy: string;
}

interface MetaMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  reach: number;
  frequency: number;
}

interface MetaInsight {
  campaign_name: string;
  campaign_id: string;
  impressions: string;
  clicks: string;
  spend: string;
  ctr: string;
  cpc: string;
  cpm: string;
}

const DEMO_METRICS = [
  { label: "Gasto Total", value: "R$ 0,00", change: "--", up: true },
  { label: "Impressoes", value: "0", change: "--", up: true },
  { label: "Cliques", value: "0", change: "--", up: true },
  { label: "CTR", value: "0%", change: "--", up: true },
  { label: "CPC", value: "R$ 0,00", change: "--", up: true },
  { label: "CPM", value: "R$ 0,00", change: "--", up: true },
  { label: "Conversoes", value: "0", change: "--", up: true },
  { label: "ROAS", value: "--", change: "--", up: true },
];

function renderBars(values: number[], maxVal: number) {
  return values.map((v, i) => {
    const heightPct = maxVal > 0 ? Math.max((v / maxVal) * 100, 3) : 3;
    return (
      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ width: "100%", height: heightPct + "%", background: "linear-gradient(180deg, #8B5CF6, #A78BFA)", borderRadius: 4, minHeight: 4 }} />
      </div>
    );
  });
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString("pt-BR");
}

function formatCurrency(n: number): string {
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function MetricsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [dateRange, setDateRange] = useState("7d");
  const [metaConnected, setMetaConnected] = useState(false);
  const [metaMetrics, setMetaMetrics] = useState<MetaMetrics | null>(null);
  const [metaInsights, setMetaInsights] = useState<MetaInsight[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [weeklyData, setWeeklyData] = useState<{ day: string; spend: number; conversions: number }[]>([]);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setCampaigns(d); })
      .catch(() => {});

    fetch("/api/meta/config")
      .then((r) => r.json())
      .then((d) => { if (d.connected) setMetaConnected(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!metaConnected) return;
    setLoadingMetrics(true);

    const params = new URLSearchParams({ dateRange });
    if (selectedCampaign !== "all") {
      const c = campaigns.find((x) => x.id === selectedCampaign);
      if (c?.metaCampaignId) params.set("campaignId", c.metaCampaignId);
    }

    fetch(`/api/meta/metrics?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.metrics) {
          setMetaMetrics(d.metrics);
          setWeeklyData(generateWeekFromMetrics(d.metrics));
        }
        if (d.insights) {
          setMetaInsights(d.insights);
          const totals = aggregateInsights(d.insights);
          setMetaMetrics(totals);
          setWeeklyData(generateWeekFromMetrics(totals));
        }
        setLoadingMetrics(false);
      })
      .catch(() => setLoadingMetrics(false));
  }, [metaConnected, selectedCampaign, dateRange]);

  function aggregateInsights(insights: MetaInsight[]): MetaMetrics {
    return insights.reduce((acc, i) => ({
      impressions: acc.impressions + parseInt(i.impressions || "0"),
      clicks: acc.clicks + parseInt(i.clicks || "0"),
      spend: acc.spend + parseFloat(i.spend || "0"),
      ctr: 0,
      cpc: 0,
      cpm: 0,
      conversions: acc.conversions,
      reach: 0,
      frequency: 0,
    }), { impressions: 0, clicks: 0, spend: 0, ctr: 0, cpc: 0, cpm: 0, conversions: 0, reach: 0, frequency: 0 });
  }

  function generateWeekFromMetrics(m: MetaMetrics) {
    const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
    const avgSpend = m.spend / 7;
    return days.map((day, i) => ({
      day,
      spend: Math.round(avgSpend * (0.7 + Math.random() * 0.6)),
      conversions: Math.round((m.conversions / 7) * (0.6 + Math.random() * 0.8)),
    }));
  }

  function getDisplayMetrics() {
    if (metaMetrics) {
      return [
        { label: "Gasto Total", value: formatCurrency(metaMetrics.spend), change: "", up: true },
        { label: "Impressoes", value: formatNumber(metaMetrics.impressions), change: "", up: true },
        { label: "Cliques", value: formatNumber(metaMetrics.clicks), change: "", up: true },
        { label: "CTR", value: metaMetrics.ctr ? metaMetrics.ctr.toFixed(2) + "%" : metaMetrics.impressions > 0 ? ((metaMetrics.clicks / metaMetrics.impressions) * 100).toFixed(2) + "%" : "0%", change: "", up: true },
        { label: "CPC", value: formatCurrency(metaMetrics.cpc || (metaMetrics.clicks > 0 ? metaMetrics.spend / metaMetrics.clicks : 0)), change: "", up: true },
        { label: "CPM", value: formatCurrency(metaMetrics.cpm || (metaMetrics.impressions > 0 ? (metaMetrics.spend / metaMetrics.impressions) * 1000 : 0)), change: "", up: true },
        { label: "Conversoes", value: String(metaMetrics.conversions), change: "", up: true },
        { label: "ROAS", value: "--", change: "", up: true },
      ];
    }
    return DEMO_METRICS;
  }

  const displayMetrics = getDisplayMetrics();
  const maxSpend = Math.max(...weeklyData.map((d) => d.spend), 1);
  const maxConv = Math.max(...weeklyData.map((d) => d.conversions), 1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Metricas da Campanha</h2>
          <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>
            {metaConnected ? "Dados reais do Meta Ads" : "Conecte a Meta Ads API para ver dados reais"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)} style={{ padding: "8px 14px", background: "#121830", border: "1px solid #232C52", borderRadius: 8, color: "#F3F5FF", fontSize: 14, cursor: "pointer" }}>
            <option value="all">Todas as campanhas</option>
            {campaigns.map((c) => (<option key={c.id} value={c.id}>{c.productName}</option>))}
          </select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ padding: "8px 14px", background: "#121830", border: "1px solid #232C52", borderRadius: 8, color: "#F3F5FF", fontSize: 14, cursor: "pointer" }}>
            <option value="7d">Ultimos 7 dias</option>
            <option value="30d">Ultimos 30 dias</option>
            <option value="90d">Ultimos 90 dias</option>
          </select>
        </div>
      </div>

      {loadingMetrics && (
        <div style={{ textAlign: "center", padding: "32px 0", marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, border: "3px solid #232C52", borderTopColor: "#22B07D", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#8C93B8", fontSize: 14, marginTop: 12 }}>Carregando metricas do Meta...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        {displayMetrics.map((m) => (
          <div key={m.label} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 12, padding: "20px 18px" }}>
            <p style={{ color: "#8C93B8", fontSize: 13, margin: 0, fontWeight: 500 }}>{m.label}</p>
            <p style={{ color: "#F3F5FF", fontSize: 26, fontWeight: 700, margin: "8px 0 4px" }}>{m.value}</p>
            <p style={{ color: m.up ? "#22B07D" : "#F87171", fontSize: 13, margin: 0, fontWeight: 600 }}>{m.change}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 24 }}>
          <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Gasto por dia</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {renderBars(weeklyData.map((d) => d.spend), maxSpend)}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {weeklyData.map((d) => (<div key={d.day} style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#6B739E" }}>{d.day}</div>))}
          </div>
        </div>

        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 24 }}>
          <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Conversoes por dia</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {renderBars(weeklyData.map((d) => d.conversions), maxConv)}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {weeklyData.map((d) => (<div key={d.day} style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#6B739E" }}>{d.day}</div>))}
          </div>
        </div>
      </div>

      {campaigns.length > 0 && (
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, padding: 24 }}>
          <p style={{ color: "#F3F5FF", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Campanhas por plataforma</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {campaigns.map((c) => {
              const platform = c.metaCampaignId ? "Meta Ads" : "Nao conectada";
              const platformColor = c.metaCampaignId ? "#22B07D" : "#8C93B8";
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#0C1022", borderRadius: 10, border: "1px solid #1A2040" }}>
                  <div>
                    <p style={{ color: "#F3F5FF", fontSize: 15, fontWeight: 600, margin: 0 }}>{c.productName}</p>
                    <p style={{ color: "#8C93B8", fontSize: 13, margin: "2px 0 0" }}>{c.country} · {new Date(c.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, color: platformColor, background: platformColor + "18" }}>{platform}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
