export interface CampaignData {
  productName: string;
  description?: string;
  audience?: string;
  funnelStage: string;
  budgetPref: string;
  country: string;
  countryCode: string;
  language: string;
  estimatedCpm?: string;
  networkId?: string;
  networkName?: string;
  affLink?: string;
  affiliateLink?: string;
  presellSlug?: string;
  keywords: string[];
  interests: string[];
  placements: string[];
  budgetDaily?: number;
  deviceSplit: Record<string, number>;
  adCopy: AdCopy;
  tone?: string;
}

export interface AdCopy {
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
}

export interface MarketAnalysis {
  score: number;
  competition: string;
  saturation: string;
  opportunity: string;
  cpmEstimate: string;
  audienceSize: string;
  recommendations: string[];
}

export interface PresellData {
  slug: string;
  title: string;
  headline: string;
  subheadline?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  bgColor?: string;
  accentColor?: string;
  textColor?: string;
  customHtml?: string;
  template: string;
}

export const COUNTRIES = [
  { name: "Brasil", code: "BR", language: "pt", currency: "BRL" },
  { name: "Estados Unidos", code: "US", language: "en", currency: "USD" },
  { name: "Portugal", code: "PT", language: "pt", currency: "EUR" },
  { name: "Moçambique", code: "MZ", language: "pt", currency: "MZN" },
  { name: "Angola", code: "AO", language: "pt", currency: "AOA" },
  { name: "Cabo Verde", code: "CV", language: "pt", currency: "CVE" },
  { name: "Guiné-Bissau", code: "GW", language: "pt", currency: "XOF" },
  { name: "São Tomé e Príncipe", code: "ST", language: "pt", currency: "STN" },
  { name: "Timor-Leste", code: "TL", language: "pt", currency: "USD" },
  { name: "Espanha", code: "ES", language: "es", currency: "EUR" },
  { name: "Argentina", code: "AR", language: "es", currency: "ARS" },
  { name: "Colômbia", code: "CO", language: "es", currency: "COP" },
  { name: "México", code: "MX", language: "es", currency: "MXN" },
  { name: "Chile", code: "CL", language: "es", currency: "CLP" },
] as const;

export const FUNNEL_STAGES = [
  { value: "topo", label: "Topo de funil (Reconhecimento)" },
  { value: "meio", label: "Meio de funil (Consideração)" },
  { value: "fundo", label: "Fundo de funil (Conversão)" },
] as const;

export const BUDGET_PREFS = [
  { value: "baixo", label: "Baixo (R$10-30/dia)" },
  { value: "medio", label: "Médio (R$30-100/dia)" },
  { value: "alto", label: "Alto (R$100+/dia)" },
] as const;

export const PLACEMENTS = [
  "Feed do Facebook",
  "Stories do Facebook",
  "Reels do Facebook",
  "Feed do Instagram",
  "Stories do Instagram",
  "Reels do Instagram",
  "Audience Network",
  "Messenger",
] as const;

export const CTA_OPTIONS = [
  "Saiba Mais",
  "Compre Agora",
  "Cadastre-se",
  "Baixar Grátis",
  "Comece Agora",
  "Assine Agora",
  "Experimente Grátis",
] as const;
