export interface SimulatedCampaign {
  id: string;
  name: string;
  product: string;
  niche: string;
  country: string;
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
  startDate: string;
  createdAt: string;
}

const BASE_CAMPAIGNS: SimulatedCampaign[] = [
  {
    id: "sim_01",
    name: "Suplemento Keto Gold",
    product: "Keto Gold Brasil",
    niche: "Saude & Fitness",
    country: "Brasil",
    countryCode: "BR",
    funnelStage: "fundo",
    status: "ACTIVE",
    budgetDaily: 150,
    spent: 4230,
    impressions: 584200,
    clicks: 18700,
    ctr: 3.2,
    cpc: 0.23,
    cpm: 7.24,
    conversions: 892,
    revenue: 26760,
    roas: 6.33,
    link: "https://adsflow-app-ten.vercel.app/p/keto-gold",
    startDate: "2026-06-15",
    createdAt: "2026-06-15T10:30:00Z",
  },
  {
    id: "sim_02",
    name: "Curso Dropshipping PRO",
    product: "Dropshipping PRO 2026",
    niche: "Educacao",
    country: "Brasil",
    countryCode: "BR",
    funnelStage: "meio",
    status: "ACTIVE",
    budgetDaily: 200,
    spent: 5890,
    impressions: 823500,
    clicks: 24100,
    ctr: 2.93,
    cpc: 0.24,
    cpm: 7.15,
    conversions: 634,
    revenue: 19020,
    roas: 3.23,
    link: "https://adsflow-app-ten.vercel.app/p/drop-pro",
    startDate: "2026-06-20",
    createdAt: "2026-06-20T14:15:00Z",
  },
  {
    id: "sim_03",
    name: "E-book Emagrecimento",
    product: "12 Semanas para Emagrecer",
    niche: "Saude",
    country: "Brasil",
    countryCode: "BR",
    funnelStage: "topo",
    status: "ACTIVE",
    budgetDaily: 80,
    spent: 2160,
    impressions: 412800,
    clicks: 14900,
    ctr: 3.61,
    cpc: 0.15,
    cpm: 5.23,
    conversions: 1247,
    revenue: 6235,
    roas: 2.89,
    link: "https://adsflow-app-ten.vercel.app/p/emagrecer-12s",
    startDate: "2026-07-01",
    createdAt: "2026-07-01T08:00:00Z",
  },
  {
    id: "sim_04",
    name: "Cadeira Gamer Titan",
    product: "Titan Chair Pro",
    niche: "Gaming",
    country: "Mexico",
    countryCode: "MX",
    funnelStage: "fundo",
    status: "ACTIVE",
    budgetDaily: 120,
    spent: 3840,
    impressions: 498200,
    clicks: 11200,
    ctr: 2.25,
    cpc: 0.34,
    cpm: 7.71,
    conversions: 247,
    revenue: 17290,
    roas: 4.50,
    link: "https://adsflow-app-ten.vercel.app/p/titan-chair",
    startDate: "2026-06-10",
    createdAt: "2026-06-10T16:45:00Z",
  },
  {
    id: "sim_05",
    name: "Skin Care Coreana",
    product: "7 Steps K-Beauty Kit",
    niche: "Beleza",
    country: "Estados Unidos",
    countryCode: "US",
    funnelStage: "fundo",
    status: "PAUSED",
    budgetDaily: 180,
    spent: 6120,
    impressions: 934500,
    clicks: 27800,
    ctr: 2.97,
    cpc: 0.22,
    cpm: 6.55,
    conversions: 892,
    revenue: 22300,
    roas: 3.64,
    link: "https://adsflow-app-ten.vercel.app/p/kbeauty",
    startDate: "2026-05-28",
    createdAt: "2026-05-28T09:20:00Z",
  },
  {
    id: "sim_06",
    name: "App Meditacao Zen",
    product: "ZenApp Premium",
    niche: "Saude Mental",
    country: "Portugal",
    countryCode: "PT",
    funnelStage: "meio",
    status: "ACTIVE",
    budgetDaily: 60,
    spent: 1680,
    impressions: 234500,
    clicks: 8900,
    ctr: 3.8,
    cpc: 0.19,
    cpm: 7.16,
    conversions: 534,
    revenue: 2670,
    roas: 1.59,
    link: "https://adsflow-app-ten.vercel.app/p/zenapp",
    startDate: "2026-07-05",
    createdAt: "2026-07-05T11:30:00Z",
  },
  {
    id: "sim_07",
    name: "Fone Bluetooth Air",
    product: "AirSound Pro Max",
    niche: "Eletronicos",
    country: "Brasil",
    countryCode: "BR",
    funnelStage: "topo",
    status: "COMPLETED",
    budgetDaily: 100,
    spent: 3000,
    impressions: 456700,
    clicks: 13200,
    ctr: 2.89,
    cpc: 0.23,
    cpm: 6.57,
    conversions: 423,
    revenue: 8460,
    roas: 2.82,
    link: "https://adsflow-app-ten.vercel.app/p/airsound",
    startDate: "2026-06-01",
    createdAt: "2026-06-01T07:00:00Z",
  },
  {
    id: "sim_08",
    name: "Plano Financas VIP",
    product: "Financas 360",
    niche: "Financeiro",
    country: "Brasil",
    countryCode: "BR",
    funnelStage: "meio",
    status: "ACTIVE",
    budgetDaily: 250,
    spent: 7500,
    impressions: 1023400,
    clicks: 31200,
    ctr: 3.05,
    cpc: 0.24,
    cpm: 7.33,
    conversions: 789,
    revenue: 23670,
    roas: 3.16,
    link: "https://adsflow-app-ten.vercel.app/p/financas360",
    startDate: "2026-06-22",
    createdAt: "2026-06-22T13:00:00Z",
  },
  {
    id: "sim_09",
    name: "Kit Ferramentas DIY",
    product: "ToolMaster 200pcs",
    niche: "Casa & Jardim",
    country: "Colombia",
    countryCode: "CO",
    funnelStage: "fundo",
    status: "PAUSED",
    budgetDaily: 90,
    spent: 2700,
    impressions: 345600,
    clicks: 8700,
    ctr: 2.52,
    cpc: 0.31,
    cpm: 7.81,
    conversions: 198,
    revenue: 5940,
    roas: 2.20,
    link: "https://adsflow-app-ten.vercel.app/p/toolmaster",
    startDate: "2026-06-05",
    createdAt: "2026-06-05T15:30:00Z",
  },
  {
    id: "sim_10",
    name: "Consulta Online Nutri",
    product: "NutriOnline Express",
    niche: "Saude",
    country: "Brasil",
    countryCode: "BR",
    funnelStage: "topo",
    status: "ACTIVE",
    budgetDaily: 70,
    spent: 1890,
    impressions: 278900,
    clicks: 10100,
    ctr: 3.62,
    cpc: 0.19,
    cpm: 6.78,
    conversions: 612,
    revenue: 3060,
    roas: 1.62,
    link: "https://adsflow-app-ten.vercel.app/p/nutriexpress",
    startDate: "2026-07-10",
    createdAt: "2026-07-10T10:00:00Z",
  },
];

function jitter(value: number, percent: number): number {
  const delta = value * (percent / 100);
  return Math.round(value + (Math.random() * 2 - 1) * delta);
}

export function getSimulatedCampaigns(): SimulatedCampaign[] {
  const now = Date.now();
  return BASE_CAMPAIGNS.map((base) => {
    const elapsed = (now - new Date(base.startDate).getTime()) / (1000 * 60 * 60 * 24);
    const timeFactor = Math.min(elapsed / 30, 1);

    const impressions = jitter(base.impressions * (0.5 + timeFactor * 0.5), 3);
    const clicks = jitter(base.clicks * (0.5 + timeFactor * 0.5), 4);
    const conversions = jitter(base.conversions * (0.5 + timeFactor * 0.5), 5);
    const spent = jitter(base.spent * (0.5 + timeFactor * 0.5), 3);
    const revenue = jitter(base.revenue * (0.5 + timeFactor * 0.5), 5);

    const ctr = impressions > 0 ? +((clicks / impressions) * 100).toFixed(2) : 0;
    const cpc = clicks > 0 ? +(spent / clicks).toFixed(2) : 0;
    const cpm = impressions > 0 ? +((spent / impressions) * 1000).toFixed(2) : 0;
    const roas = spent > 0 ? +(revenue / spent).toFixed(2) : 0;

    return {
      ...base,
      impressions,
      clicks,
      conversions,
      spent,
      revenue,
      ctr,
      cpc,
      cpm,
      roas,
    };
  });
}

export function getOverallStats(campaigns: SimulatedCampaign[]) {
  const active = campaigns.filter((c) => c.status === "ACTIVE");
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const totalBudget = campaigns.reduce((s, c) => s + c.budgetDaily, 0);

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
    dailyBudget: totalBudget,
  };
}
