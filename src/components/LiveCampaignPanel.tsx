"use client";

import { useEffect, useState } from "react";
import { getSimulatedCampaigns, getOverallStats, tickSimulation, SimulatedCampaign } from "@/lib/simulated-campaigns";

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  ACTIVE: { color: "#22B07D", bg: "rgba(34,176,125,0.12)" },
  PAUSED: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  COMPLETED: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  COMPLETED: "Concluida",
};

export default function LiveCampaignPanel() {
  const [campaigns, setCampaigns] = useState<SimulatedCampaign[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getOverallStats> | null>(null);

  useEffect(() => {
    function update() {
      tickSimulation();
      const c = getSimulatedCampaigns();
      setCampaigns(c);
      setStats(getOverallStats(c));
    }
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "24px 20px" }}>
      {/* KPIs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {stats && [
          { label: "ROAS", value: `${stats.avgRoas.toFixed(1)}x`, color: "#22B07D" },
          { label: "Custo por lead", value: `R$${stats.avgCpc.toFixed(2)}`, color: "#8B5CF6" },
        ].map((kpi, i) => (
          <div key={i} style={{ flex: 1, minWidth: 110, background: "rgba(139,92,246,.08)", border: "1px solid rgba(139,92,246,.2)", borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 11, color: "#8C93B8", marginBottom: 4 }}>{kpi.label}</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginBottom: 20 }}>
        {[60, 45, 80, 55, 95, 70, 85].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h + Math.sin(Date.now() / 2000 + i) * 5}%`, borderRadius: 4, background: `linear-gradient(180deg,${i === 4 ? "#F97316" : "#8B5CF6"},${i === 4 ? "rgba(249,115,22,.2)" : "rgba(139,92,246,.15)"})`, transition: "height .6s" }} />
        ))}
      </div>

      {/* Campaign rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {campaigns.slice(0, 5).map((c, i) => {
          const st = STATUS_COLORS[c.status] || STATUS_COLORS.ACTIVE;
          const isLive = c.status === "ACTIVE";
          return (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: i > 0 ? "1px solid #232C52" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {isLive && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22B07D", animation: "pulse 1.5s ease-in-out infinite" }} />}
                <span style={{ fontSize: 13, color: "#F3F5FF", fontWeight: 500 }}>{c.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontFamily: "monospace", color: c.roas >= 3 ? "#22B07D" : "#F59E0B", fontWeight: 600 }}>{c.roas.toFixed(1)}x</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "4px 10px", borderRadius: 999 }}>{STATUS_LABELS[c.status]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
