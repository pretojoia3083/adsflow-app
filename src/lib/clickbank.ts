export interface ClickBankProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  commission: number;
  commissionPercent: number;
  gravity: number;
  country: string;
  image: string;
  vendor: string;
  recurring: boolean;
  refundRate: number;
  tags: string[];
  affiliateUrl: string;
  lastUpdated: string;
}

const CB_CATEGORIES: Record<string, string> = {
  "arts-entertainment": "Arte & Entretenimento",
  "assemblies": "Assembleias",
  "business-investing": "Investimentos",
  "computers-internet": "Tecnologia",
  "cooking-food-wine": "Alimentacao",
  "ebusiness-ecommerce": "E-commerce",
  "education": "Educacao",
  "employment-jobs": "Emprego",
  "games": "Jogos",
  "green-products": "Produtos Verdes",
  "health-fitness": "Saude & Fitness",
  "home-garden": "Casa & Jardim",
  "languages": "Idiomas",
  "mobile": "Mobile",
  "parenting-families": "Familia",
  "politics-opinions": "Politica",
  "reference": "Referencia",
  "self-help": "Autoajuda",
  "software-services": "Software",
  "spirituality-new-age": "Espiritualidade",
  "sports": "Esportes",
  "travel": "Viagem",
};

const CATEGORY_MAP: Record<string, string> = {
  "arts-entertainment": "entertainment",
  "business-investing": "finance",
  "computers-internet": "tech",
  "cooking-food-wine": "food",
  "ebusiness-ecommerce": "finance",
  "education": "education",
  "games": "entertainment",
  "green-products": "home",
  "health-fitness": "health",
  "home-garden": "home",
  "mobile": "tech",
  "parenting-families": "home",
  "self-help": "health",
  "spirituality-new-age": "finance",
  "sports": "fitness",
  "travel": "travel",
  "software-services": "tech",
  "languages": "education",
  "employment-jobs": "finance",
  "reference": "education",
  "politics-opinions": "entertainment",
  "assemblies": "entertainment",
};

const TOP_CB_PRODUCTS: ClickBankProduct[] = [
  {
    id: "cb-001", name: "Java Burn", vendor: "javaburn",
    description: "Suplemento termogenico que acelera o metabolismo quando misturado com cafe. Comissao alta e taxa de refund baixa. Landing page otimizada para conversao com video de vendas de 40min.",
    category: "health", price: 149.00, commission: 119.20, commissionPercent: 80,
    gravity: 587.32, country: "US", image: "🔥", recurring: true, refundRate: 4.2,
    tags: ["perda de peso", "suplemento", "recurring", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=javaburn&vendor=javaburn",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-002", name: "Ikaria Lean Belly Juice", vendor: "ikarialean",
    description: "Formula em po para emagrecimento baseada em ingredientes naturais da ilha grega de Ikaria. Alto ticket e boa taxa de conversao em mobile.",
    category: "health", price: 129.00, commission: 96.75, commissionPercent: 75,
    gravity: 432.18, country: "US", image: "🧪", recurring: false, refundRate: 5.8,
    tags: ["perda de peso", "natural", "juice", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=ikarialean",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-003", name: "Crypto Quantum Leap", vendor: "cryptoquantum",
    description: "Curso completo de investimento em criptomoedas para iniciantes. Aprenda a comprar, armazenar e investir em BTC e altcoins. Comissao alta por venda.",
    category: "finance", price: 197.00, commission: 118.20, commissionPercent: 60,
    gravity: 289.45, country: "US", image: "₿", recurring: false, refundRate: 3.1,
    tags: ["crypto", "curso", "investimento", "finance"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=cryptoquantum",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-004", name: "Puravive", vendor: "puravive",
    description: "Suporte a perda de peso com ingredientes tropicais que visam Brown Adipose Tissue (BAT). Um dos produtos com maior gravity do ClickBank em 2024/2025.",
    category: "health", price: 139.00, commission: 104.25, commissionPercent: 75,
    gravity: 521.64, country: "US", image: "🌴", recurring: false, refundRate: 5.1,
    tags: ["emagrecimento", "tropical", "BAT", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=puravive",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-005", name: "ProDentim", vendor: "prodentim",
    description: "Probiotico para saude bucal. 3.5 bilhoes de CFUs e 3 ingredientes Naturais para dentes e gengivas saudaveis. Produto evergreen com recorrencia.",
    category: "health", price: 69.00, commission: 51.75, commissionPercent: 75,
    gravity: 478.31, country: "US", image: "🦷", recurring: true, refundRate: 3.8,
    tags: ["saude bucal", "probiotico", "dentes", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=prodentim",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-006", name: "Alpilean", vendor: "alpilean",
    description: "Suplemento para perda de peso baseado na ciencia da temperatura interna do corpo. Ingredientes alpinos. Um dos top sellers historicos do ClickBank.",
    category: "health", price: 159.00, commission: 119.25, commissionPercent: 75,
    gravity: 612.90, country: "US", image: "⛰️", recurring: false, refundRate: 5.4,
    tags: ["emagrecimento", "alpino", "temperatura", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=alpilean",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-007", name: "Exipure", vendor: "exipure",
    description: "Suplemento focado em Brown Adipose Tissue (BAT) para promover perda de peso de forma natural. Recorrencia disponivel.",
    category: "health", price: 159.00, commission: 119.25, commissionPercent: 75,
    gravity: 365.87, country: "US", image: "🍃", recurring: true, refundRate: 6.3,
    tags: ["perda de peso", "BAT", "natural", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=exipure",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-008", name: "Numerologist", vendor: "numerologist",
    description: "Plataforma de numerologia personalizada. Relatorios diarios, analise de mapa numerologico e orientacao de vida. Recorrencia alta.",
    category: "finance", price: 49.00, commission: 36.75, commissionPercent: 75,
    gravity: 156.90, country: "US", image: "🔮", recurring: true, refundRate: 2.9,
    tags: ["numerologia", "espiritualidade", "recurring", "spirituality"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=numerologist",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-009", name: "SynoGut", vendor: "synogut",
    description: "Suplemento natural para saude digestiva. Combina probioticos, fibras e extratos botanicos. Baixa taxa de reembolso.",
    category: "health", price: 69.00, commission: 51.75, commissionPercent: 75,
    gravity: 198.23, country: "US", image: "🦠", recurring: false, refundRate: 4.7,
    tags: ["saude digestiva", "probioticos", "natural", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=synogut",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-010", name: "Quietum Plus", vendor: "quietumplus",
    description: "Suplemento natural para zumbido no ouvido. Ingredientes que nutrem e repararam o sistema auditivo.",
    category: "health", price: 69.00, commission: 51.75, commissionPercent: 75,
    gravity: 142.56, country: "US", image: "👂", recurring: false, refundRate: 4.9,
    tags: ["zumbido", "audiacao", "natural", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=quietumplus",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-011", name: "The Smoothie Diet", vendor: "smoothiediet",
    description: "Programa de 21 dias com receitas de smoothies para perda de peso rapida e saudavel. Ebook digital com alto volume de vendas.",
    category: "fitness", price: 37.00, commission: 25.90, commissionPercent: 70,
    gravity: 234.78, country: "US", image: "🥤", recurring: false, refundRate: 2.1,
    tags: ["dieta", "smoothie", "21 dias", "fitness"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=smoothiediet",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-012", name: "Kerassentials", vendor: "kerassentials",
    description: "Oleo natural para tratamento de fungos nos pes e unhas. Formula com 9 ingredientes naturais. Nicheo evergreen.",
    category: "health", price: 69.00, commission: 51.75, commissionPercent: 75,
    gravity: 187.43, country: "US", image: "🦶", recurring: false, refundRate: 3.5,
    tags: ["fungos", "unhas", "oleo natural", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=kerassentials",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-013", name: "Emperor's Vigor Tonic", vendor: "emperorvigor",
    description: "Tonico de saude masculina com ingredientes naturais focados em vigor e energia. Nicho masculino com alto ticket.",
    category: "health", price: 149.00, commission: 111.75, commissionPercent: 75,
    gravity: 312.50, country: "US", image: "💪", recurring: false, refundRate: 4.5,
    tags: ["saude masculina", "tonico", "vigor", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=emperorvigor",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-014", name: "GlucoTrust", vendor: "glucotrust",
    description: "Suplemento para controle de glicose. Formula natural que suporta niveis saudaveis de acucar no sangue. Nicheo diabete/type2 enorme.",
    category: "health", price: 179.00, commission: 134.25, commissionPercent: 75,
    gravity: 456.78, country: "US", image: "🩸", recurring: false, refundRate: 4.0,
    tags: ["glicose", "diabetes", "suplemento", "health"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=glucotrust",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-015", name: "Wealth DNA Code", vendor: "wealthdna",
    description: "Programa de mindset financeiro baseado em audio. Utiliza o conceito de 'DNA da riqueza' para reprogramar subconsciente.",
    category: "finance", price: 39.00, commission: 27.30, commissionPercent: 70,
    gravity: 178.34, country: "US", image: "🧬", recurring: false, refundRate: 3.2,
    tags: ["mindset", "riqueza", "audio", "finance"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=wealthdna",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "cb-016", name: "Billionaire Brain Wave", vendor: "billionairebrain",
    description: "Audio de frequencia theta para atrair abundancia e riqueza. Produto digital de alta conversao no nicho de manifestacao.",
    category: "finance", price: 49.00, commission: 34.30, commissionPercent: 70,
    gravity: 267.89, country: "US", image: "🧠", recurring: false, refundRate: 2.8,
    tags: ["manifestacao", "audio", "frequencia", "spirituality"],
    affiliateUrl: "https://hop.clickbank.net/?affiliate=default&vendor=billionairebrain",
    lastUpdated: new Date().toISOString(),
  },
];

export function getAllProducts(): ClickBankProduct[] {
  return TOP_CB_PRODUCTS;
}

export function getProductsByCategory(category: string): ClickBankProduct[] {
  if (category === "all") return TOP_CB_PRODUCTS;
  return TOP_CB_PRODUCTS.filter((p) => p.category === category);
}

export function searchProducts(query: string): ClickBankProduct[] {
  const q = query.toLowerCase();
  return TOP_CB_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getTrendingProducts(minGravity: number = 300): ClickBankProduct[] {
  return TOP_CB_PRODUCTS.filter((p) => p.gravity >= minGravity)
    .sort((a, b) => b.gravity - a.gravity);
}

export function getTopCommissionProducts(limit: number = 10): ClickBankProduct[] {
  return [...TOP_CB_PRODUCTS]
    .sort((a, b) => b.commission - a.commission)
    .slice(0, limit);
}

export function getProductStats() {
  const products = TOP_CB_PRODUCTS;
  const trending = products.filter((p) => p.gravity > 400).length;
  const avgCommission = products.reduce((s, p) => s + p.commissionPercent, 0) / products.length;
  const avgGravity = products.reduce((s, p) => s + p.gravity, 0) / products.length;
  const categories = [...new Set(products.map((p) => p.category))];
  return {
    total: products.length,
    trending,
    avgCommission: avgCommission.toFixed(1),
    avgGravity: avgGravity.toFixed(0),
    categories: categories.length,
  };
}
