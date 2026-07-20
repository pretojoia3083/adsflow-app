export interface SimulatedCampaign {
  id: string;
  name: string;
  niche: string;
  countryCode: string;
  funnelStage: "topo" | "meio" | "fundo";
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  budgetDaily: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  revenue: number;
  roas: number;
  link: string;
}

interface SimBase {
  id: string;
  name: string;
  niche: string;
  countryCode: string;
  funnelStage: "topo" | "meio" | "fundo";
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  budgetDaily: number;
  baseImpressions: number;
  baseClicks: number;
  baseConversions: number;
  baseSpent: number;
  baseRevenue: number;
  link: string;
  impPerSec: number;
  clickPerSec: number;
  convPerSec: number;
  spendPerSec: number;
  revPerSec: number;
}

const CAMPAIGNS: SimBase[] = [
  {
    id: "sim_01", name: "Suplemento Keto Gold", niche: "Saude & Fitness", countryCode: "BR",
    funnelStage: "fundo", status: "ACTIVE", budgetDaily: 150, link: "/p/keto-gold",
    baseImpressions: 584200, baseClicks: 18700, baseConversions: 892, baseSpent: 4230, baseRevenue: 26760,
    impPerSec: 8, clickPerSec: 0.3, convPerSec: 0.015, spendPerSec: 0.06, revPerSec: 0.35,
  },
  {
    id: "sim_02", name: "Curso Dropshipping PRO", niche: "Educacao", countryCode: "BR",
    funnelStage: "meio", status: "ACTIVE", budgetDaily: 200, link: "/p/drop-pro",
    baseImpressions: 823500, baseClicks: 24100, baseConversions: 634, baseSpent: 5890, baseRevenue: 19020,
    impPerSec: 11, clickPerSec: 0.4, convPerSec: 0.01, spendPerSec: 0.08, revPerSec: 0.25,
  },
  {
    id: "sim_03", name: "E-book Emagrecimento", niche: "Saude", countryCode: "BR",
    funnelStage: "topo", status: "ACTIVE", budgetDaily: 80, link: "/p/emagrecer-12s",
    baseImpressions: 412800, baseClicks: 14900, baseConversions: 1247, baseSpent: 2160, baseRevenue: 6235,
    impPerSec: 6, clickPerSec: 0.25, convPerSec: 0.02, spendPerSec: 0.03, revPerSec: 0.08,
  },
  {
    id: "sim_04", name: "Cadeira Gamer Titan", niche: "Gaming", countryCode: "MX",
    funnelStage: "fundo", status: "ACTIVE", budgetDaily: 120, link: "/p/titan-chair",
    baseImpressions: 498200, baseClicks: 11200, baseConversions: 247, baseSpent: 3840, baseRevenue: 17290,
    impPerSec: 7, clickPerSec: 0.2, convPerSec: 0.005, spendPerSec: 0.05, revPerSec: 0.22,
  },
  {
    id: "sim_05", name: "Skin Care Coreana", niche: "Beleza", countryCode: "US",
    funnelStage: "fundo", status: "PAUSED", budgetDaily: 180, link: "/p/kbeauty",
    baseImpressions: 934500, baseClicks: 27800, baseConversions: 892, baseSpent: 6120, baseRevenue: 22300,
    impPerSec: 0, clickPerSec: 0, convPerSec: 0, spendPerSec: 0, revPerSec: 0,
  },
  {
    id: "sim_06", name: "App Meditacao Zen", niche: "Saude Mental", countryCode: "PT",
    funnelStage: "meio", status: "ACTIVE", budgetDaily: 60, link: "/p/zenapp",
    baseImpressions: 234500, baseClicks: 8900, baseConversions: 534, baseSpent: 1680, baseRevenue: 2670,
    impPerSec: 4, clickPerSec: 0.15, convPerSec: 0.008, spendPerSec: 0.025, revPerSec: 0.04,
  },
  {
    id: "sim_07", name: "Fone Bluetooth Air", niche: "Eletronicos", countryCode: "BR",
    funnelStage: "topo", status: "COMPLETED", budgetDaily: 100, link: "/p/airsound",
    baseImpressions: 456700, baseClicks: 13200, baseConversions: 423, baseSpent: 3000, baseRevenue: 8460,
    impPerSec: 0, clickPerSec: 0, convPerSec: 0, spendPerSec: 0, revPerSec: 0,
  },
  {
    id: "sim_08", name: "Plano Financas VIP", niche: "Financeiro", countryCode: "BR",
    funnelStage: "meio", status: "ACTIVE", budgetDaily: 250, link: "/p/financas360",
    baseImpressions: 1023400, baseClicks: 31200, baseConversions: 789, baseSpent: 7500, baseRevenue: 23670,
    impPerSec: 14, clickPerSec: 0.5, convPerSec: 0.012, spendPerSec: 0.1, revPerSec: 0.32,
  },
  {
    id: "sim_09", name: "Kit Ferramentas DIY", niche: "Casa & Jardim", countryCode: "CO",
    funnelStage: "fundo", status: "PAUSED", budgetDaily: 90, link: "/p/toolmaster",
    baseImpressions: 345600, baseClicks: 8700, baseConversions: 198, baseSpent: 2700, baseRevenue: 5940,
    impPerSec: 0, clickPerSec: 0, convPerSec: 0, spendPerSec: 0, revPerSec: 0,
  },
  {
    id: "sim_10", name: "Consulta Online Nutri", niche: "Saude", countryCode: "BR",
    funnelStage: "topo", status: "ACTIVE", budgetDaily: 70, link: "/p/nutriexpress",
    baseImpressions: 278900, baseClicks: 10100, baseConversions: 612, baseSpent: 1890, baseRevenue: 3060,
    impPerSec: 5, clickPerSec: 0.18, convPerSec: 0.01, spendPerSec: 0.02, revPerSec: 0.05,
  },
];

let tickSeconds = 0;

export function tickSimulation(): void {
  tickSeconds++;
}

export function getSimulatedCampaigns(): SimulatedCampaign[] {
  const t = tickSeconds;
  return CAMPAIGNS.map((b) => {
    const impressions = Math.round(b.baseImpressions + b.impPerSec * t + Math.sin(t * 0.1) * b.impPerSec * 2);
    const clicks = Math.round(b.baseClicks + b.clickPerSec * t + Math.sin(t * 0.15) * 3);
    const conversions = Math.round(b.baseConversions + b.convPerSec * t);
    const spent = +(b.baseSpent + b.spendPerSec * t).toFixed(2);
    const revenue = +(b.baseRevenue + b.revPerSec * t).toFixed(2);
    const ctr = impressions > 0 ? +((clicks / impressions) * 100).toFixed(2) : 0;
    const cpc = clicks > 0 ? +(spent / clicks).toFixed(2) : 0;
    const cpm = impressions > 0 ? +((spent / impressions) * 1000).toFixed(2) : 0;
    const roas = spent > 0 ? +(revenue / spent).toFixed(2) : 0;
    return { ...b, impressions, clicks, conversions, spent, revenue, ctr, cpc, cpm, roas };
  });
}

export function getOverallStats(campaigns: SimulatedCampaign[]) {
  const active = campaigns.filter((c) => c.status === "ACTIVE");
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: active.length,
    totalSpent,
    totalRevenue,
    totalProfit: totalRevenue - totalSpent,
    totalImpressions,
    totalClicks,
    totalConversions,
    avgCtr: totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : 0,
    avgCpc: totalClicks > 0 ? +(totalSpent / totalClicks).toFixed(2) : 0,
    avgCpm: totalImpressions > 0 ? +((totalSpent / totalImpressions) * 1000).toFixed(2) : 0,
    avgRoas: totalSpent > 0 ? +(totalRevenue / totalSpent).toFixed(2) : 0,
  };
}
