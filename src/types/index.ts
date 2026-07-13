export interface Product {
  name: string;
  description?: string;
  audience?: string;
  budget: string;
  funnelStage: string;
}

export interface Country {
  country: string;
  countryCode: string;
  flag: string;
  demandScore: number;
  competitionLevel: "baixa" | "media" | "alta";
  suggestedLanguage: string;
  estimatedCpm: string;
  reasoning: string;
}

export interface PresellSetup {
  networkId: string;
  networkName: string;
  affLink: string;
  trackingId?: string;
  domainSlug: string;
  templateId: string;
  templateLabel: string;
}

export interface AdCopy {
  label: string;
  headline: string;
  body: string;
  cta: string;
  imageStyle: string;
  colors: {
    background: string;
    accent: string;
    text: string;
  };
}

export interface CampaignSetup {
  keywords: string[];
  interests: string[];
  placements: string[];
  budgetDaily: number;
  deviceSplit: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export type Step = 1 | 2 | 3 | 4 | 5;

export const FUNNEL_STAGES = [
  { id: "topo", label: "Topo de funil", desc: "Descoberta" },
  { id: "meio", label: "Meio de funil", desc: "Consideração" },
  { id: "fundo", label: "Fundo de funil", desc: "Decisão" },
] as const;

export const AFFILIATE_NETWORKS = [
  { id: "hotmart", name: "Hotmart", tag: "Infoproduto" },
  { id: "kiwify", name: "Kiwify", tag: "Infoproduto" },
  { id: "eduzz", name: "Eduzz", tag: "Infoproduto" },
  { id: "monetizze", name: "Monetizze", tag: "Infoproduto/Fisico" },
  { id: "braip", name: "Braip", tag: "Recorrencia/Fisico" },
  { id: "ticto", name: "Ticto", tag: "Infoproduto premium" },
  { id: "herospark", name: "Herospark", tag: "Infoproduto" },
  { id: "clickbank", name: "ClickBank", tag: "Global" },
  { id: "digistore24", name: "Digistore24", tag: "Europa" },
  { id: "awin", name: "Awin", tag: "Rede global" },
  { id: "cj", name: "CJ Affiliate", tag: "E-commerce" },
  { id: "webvork", name: "Webvork", tag: "CPA Nutra" },
  { id: "maxbounty", name: "MaxBounty", tag: "CPA generalista" },
  { id: "drcash", name: "DrCash", tag: "CPA Nutra" },
  { id: "amazon", name: "Amazon Associados", tag: "E-commerce" },
  { id: "shopee", name: "Shopee Afiliados", tag: "E-commerce" },
] as const;

export const TEMPLATES = {
  topo: [
    {
      id: "advertorial",
      label: "Advertorial / Noticia",
      desc: "Formato de materia, alto engajamento em descoberta",
    },
    {
      id: "quiz",
      label: "Quiz interativo",
      desc: "Engaja e qualifica antes de mostrar a oferta",
    },
  ],
  meio: [
    {
      id: "comparacao",
      label: "Comparacao",
      desc: "Produto vs concorrentes / vs metodo antigo",
    },
    {
      id: "depoimentos",
      label: "Depoimentos",
      desc: "Prova social pra vencer objecoes",
    },
  ],
  fundo: [
    {
      id: "contagem",
      label: "Contagem regressiva",
      desc: "Urgencia/escassez pra fechar a venda",
    },
    {
      id: "depoimentos",
      label: "Depoimentos",
      desc: "Reforco de confianca antes do checkout",
    },
  ],
} as const;
