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
  { name: "Brasil", code: "BR", language: "pt", currency: "BRL", flag: "🇧🇷" },
  { name: "Estados Unidos", code: "US", language: "en", currency: "USD", flag: "🇺🇸" },
  { name: "Portugal", code: "PT", language: "pt", currency: "EUR", flag: "🇵🇹" },
  { name: "Moçambique", code: "MZ", language: "pt", currency: "MZN", flag: "🇲🇿" },
  { name: "Angola", code: "AO", language: "pt", currency: "AOA", flag: "🇦🇴" },
  { name: "Cabo Verde", code: "CV", language: "pt", currency: "CVE", flag: "🇨🇻" },
  { name: "Guiné-Bissau", code: "GW", language: "pt", currency: "XOF", flag: "🇬🇼" },
  { name: "São Tomé e Príncipe", code: "ST", language: "pt", currency: "STN", flag: "🇸🇹" },
  { name: "Timor-Leste", code: "TL", language: "pt", currency: "USD", flag: "🇹🇱" },
  { name: "Espanha", code: "ES", language: "es", currency: "EUR", flag: "🇪🇸" },
  { name: "Argentina", code: "AR", language: "es", currency: "ARS", flag: "🇦🇷" },
  { name: "Colômbia", code: "CO", language: "es", currency: "COP", flag: "🇨🇴" },
  { name: "México", code: "MX", language: "es", currency: "MXN", flag: "🇲🇽" },
  { name: "Chile", code: "CL", language: "es", currency: "CLP", flag: "🇨🇱" },
  { name: "Reino Unido", code: "GB", language: "en", currency: "GBP", flag: "🇬🇧" },
  { name: "Canadá", code: "CA", language: "en", currency: "CAD", flag: "🇨🇦" },
  { name: "Austrália", code: "AU", language: "en", currency: "AUD", flag: "🇦🇺" },
  { name: "Alemanha", code: "DE", language: "de", currency: "EUR", flag: "🇩🇪" },
  { name: "França", code: "FR", language: "fr", currency: "EUR", flag: "🇫🇷" },
  { name: "Itália", code: "IT", language: "it", currency: "EUR", flag: "🇮🇹" },
  { name: "Japão", code: "JP", language: "ja", currency: "JPY", flag: "🇯🇵" },
  { name: "Índia", code: "IN", language: "hi", currency: "INR", flag: "🇮🇳" },
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
