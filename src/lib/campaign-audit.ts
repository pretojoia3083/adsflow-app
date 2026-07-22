export interface AuditItem {
  category: string;
  label: string;
  status: "pass" | "warn" | "fail";
  score: number;
  maxScore: number;
  detail: string;
  fix?: string;
}

export interface AuditResult {
  overallScore: number;
  grade: string;
  verdict: string;
  items: AuditItem[];
  summary: { pass: number; warn: number; fail: number };
}

export function auditCampaign(data: {
  productName: string;
  description?: string;
  audience?: string;
  funnelStage: string;
  budgetPref: string;
  country: string;
  keywords: string[];
  interests: string[];
  placements: string[];
  budgetDaily?: number;
  adCopy: { headline: string; primaryText: string; description: string; cta: string };
  presell: { slug: string; title: string; headline: string; subheadline: string; affiliateLink: string };
  selectedImage?: string | null;
  creativeMode?: string | null;
  intelligence?: {
    recommendedBudget?: { min: number; suggested: number; aggressive: number };
    topCountries?: { code: string; name: string; competitionLevel: string; cpmEstimate: number }[];
  };
}): AuditResult {
  const items: AuditItem[] = [];

  // ─── COPY CHECKS ───
  const hl = data.adCopy.headline;
  items.push({
    category: "Copy",
    label: "Headline com 5-15 palavras",
    status: hl.split(/\s+/).filter(Boolean).length >= 5 && hl.split(/\s+/).filter(Boolean).length <= 15 ? "pass" : hl.length === 0 ? "fail" : "warn",
    score: hl.split(/\s+/).filter(Boolean).length >= 5 && hl.split(/\s+/).filter(Boolean).length <= 15 ? 10 : hl.length === 0 ? 0 : 5,
    maxScore: 10,
    detail: `${hl.split(/\s+/).filter(Boolean).length} palavras — ideal: 5 a 15`,
    fix: hl.length === 0 ? "Escreva um headline persuasivo" : hl.split(/\s+/).filter(Boolean).length > 15 ? "Encurte o headline para ficar mais direto" : undefined,
  });

  const pt = data.adCopy.primaryText;
  const ptWords = pt.split(/\s+/).filter(Boolean).length;
  items.push({
    category: "Copy",
    label: "Texto principal 20-60 palavras",
    status: ptWords >= 20 && ptWords <= 60 ? "pass" : ptWords < 10 ? "fail" : "warn",
    score: ptWords >= 20 && ptWords <= 60 ? 10 : ptWords < 10 ? 0 : 5,
    maxScore: 10,
    detail: `${ptWords} palavras — ideal: 20 a 60`,
    fix: ptWords < 10 ? "O texto principal esta muito curto" : ptWords > 60 ? "Texto longo pode reduzir engajamento" : undefined,
  });

  const urgencyWords = ["agora", "hoje", "ultima", "garanta", "gratuito", "gratis", "oferta", "desconto", "limitado", "exclusivo", "novo", "descubra", "secreto"];
  const hasUrgency = urgencyWords.some((w) => pt.toLowerCase().includes(w) || hl.toLowerCase().includes(w));
  items.push({
    category: "Copy",
    label: "Gatilho de urgencia/escassez",
    status: hasUrgency ? "pass" : "warn",
    score: hasUrgency ? 8 : 3,
    maxScore: 8,
    detail: hasUrgency ? "Encontrou palavras de urgencia" : "Nenhum gatilho de urgencia detectado",
    fix: !hasUrgency ? "Adicione palavras como 'agora', 'limitado', 'ultima chance'" : undefined,
  });

  const ctaGood = ["compre", "comprar", "saiba mais", "quero", "garanta", "comece", "assine", "testar", "descubra", "acessar"];
  const hasGoodCta = ctaGood.some((c) => data.adCopy.cta.toLowerCase().includes(c));
  items.push({
    category: "Copy",
    label: "CTA forte e direcionado",
    status: data.adCopy.cta.length > 0 ? (hasGoodCta ? "pass" : "warn") : "fail",
    score: data.adCopy.cta.length > 0 ? (hasGoodCta ? 8 : 4) : 0,
    maxScore: 8,
    detail: `CTA atual: "${data.adCopy.cta}"`,
    fix: !hasGoodCta ? "Use um CTA direto como 'Saiba Mais', 'Compre Agora', 'Quero Testar'" : undefined,
  });

  // ─── FUNNEL CHECKS ───
  const stageCtaMap: Record<string, string[]> = {
    topo: ["conhecer", "descubra", "saiba mais", "assista"],
    meio: ["compare", "avalia", "teste", "baixe"],
    fundo: ["compre", "garanta", "assine", "comece"],
  };
  const expectedCta = stageCtaMap[data.funnelStage] || [];
  const ctaMatchStage = expectedCta.some((c) => data.adCopy.cta.toLowerCase().includes(c));
  items.push({
    category: "Funil",
    label: "CTA alinhado com etapa do funil",
    status: ctaMatchStage ? "pass" : "warn",
    score: ctaMatchStage ? 10 : 4,
    maxScore: 10,
    detail: `Funil: ${data.funnelStage} — CTA: "${data.adCopy.cta}"`,
    fix: !ctaMatchStage ? `Para ${data.funnelStage}, use CTA como: ${expectedCta.join(", ")}` : undefined,
  });

  items.push({
    category: "Funil",
    label: "Descricao do produto presente",
    status: data.description && data.description.length > 10 ? "pass" : "fail",
    score: data.description && data.description.length > 10 ? 8 : 0,
    maxScore: 8,
    detail: data.description ? `"${data.description.substring(0, 60)}..."` : "Sem descricao do produto",
    fix: !data.description ? "Adicione uma descricao clara do produto" : undefined,
  });

  // ─── TARGETING CHECKS ───
  items.push({
    category: "Segmentacao",
    label: "Publico-alvo definido",
    status: data.audience && data.audience.length > 5 ? "pass" : "fail",
    score: data.audience && data.audience.length > 5 ? 10 : 0,
    maxScore: 10,
    detail: data.audience ? `"${data.audience}"` : "Nenhum publico definido",
    fix: !data.audience ? "Defina quem e seu publico-alvo" : undefined,
  });

  items.push({
    category: "Segmentacao",
    label: "Interesses selecionados",
    status: data.interests.length >= 3 ? "pass" : data.interests.length > 0 ? "warn" : "fail",
    score: data.interests.length >= 5 ? 10 : data.interests.length >= 3 ? 7 : data.interests.length > 0 ? 4 : 0,
    maxScore: 10,
    detail: `${data.interests.length} interesses selecionados`,
    fix: data.interests.length < 3 ? "Adicione pelo menos 3-5 interesses relevantes" : undefined,
  });

  items.push({
    category: "Segmentacao",
    label: "3+ placements selecionados",
    status: data.placements.length >= 3 ? "pass" : data.placements.length > 0 ? "warn" : "fail",
    score: data.placements.length >= 3 ? 8 : data.placements.length > 0 ? 4 : 0,
    maxScore: 8,
    detail: `${data.placements.length} placements: ${data.placements.join(", ") || "nenhum"}`,
    fix: data.placements.length < 3 ? "Selecione mais placements para ampliar alcance" : undefined,
  });

  items.push({
    category: "Segmentacao",
    label: "Pais de destino selecionado",
    status: data.country && data.country !== "" ? "pass" : "fail",
    score: data.country && data.country !== "" ? 8 : 0,
    maxScore: 8,
    detail: data.country ? `Pais: ${data.country}` : "Nenhum pais selecionado",
    fix: !data.country ? "Selecione o pais de destino" : undefined,
  });

  // ─── BUDGET CHECKS ───
  const budget = data.budgetDaily || 30;
  const rec = data.intelligence?.recommendedBudget;
  if (rec) {
    const inRange = budget >= rec.min && budget <= rec.aggressive;
    const belowMin = budget < rec.min;
    items.push({
      category: "Orcamento",
      label: "Orcamento dentro da faixa recomendada",
      status: inRange ? "pass" : belowMin ? "warn" : "pass",
      score: inRange ? 10 : belowMin ? 4 : 10,
      maxScore: 10,
      detail: `R$${budget}/dia — recomendado: R$${rec.min}-${rec.aggressive}/dia`,
      fix: belowMin ? `Considere aumentar para R$${rec.min}/dia minimo` : undefined,
    });
  } else {
    items.push({
      category: "Orcamento",
      label: "Orcamento definido",
      status: budget >= 10 ? "pass" : "warn",
      score: budget >= 10 ? 8 : 4,
      maxScore: 8,
      detail: `R$${budget}/dia`,
      fix: budget < 10 ? "Orcamento muito baixo pode nao gerar dados suficientes" : undefined,
    });
  }

  // ─── CREATIVE CHECKS ───
  items.push({
    category: "Criativo",
    label: "Imagem selecionada",
    status: data.selectedImage ? "pass" : "warn",
    score: data.selectedImage ? 10 : 3,
    maxScore: 10,
    detail: data.selectedImage ? "Imagem configurada" : "Nenhuma imagem selecionada",
    fix: !data.selectedImage ? "Gere ou selecione uma imagem para o anuncio" : undefined,
  });

  items.push({
    category: "Criativo",
    label: "Modo de criativo definido",
    status: data.creativeMode ? "pass" : "warn",
    score: data.creativeMode ? 5 : 2,
    maxScore: 5,
    detail: data.creativeMode === "ai" ? "IA (DALL-E)" : data.creativeMode === "template" ? "Template Banner" : "Nao definido",
    fix: !data.creativeMode ? "Escolha entre IA ou Template para o criativo" : undefined,
  });

  // ─── PRESELL CHECKS ───
  items.push({
    category: "Presell",
    label: "Slug configurado",
    status: data.presell.slug && data.presell.slug.length > 2 ? "pass" : "fail",
    score: data.presell.slug && data.presell.slug.length > 2 ? 6 : 0,
    maxScore: 6,
    detail: data.presell.slug ? `/${data.presell.slug}` : "Sem slug",
    fix: !data.presell.slug ? "Defina um slug para a presell" : undefined,
  });

  items.push({
    category: "Presell",
    label: "Headline da presell",
    status: data.presell.headline && data.presell.headline.length > 5 ? "pass" : "warn",
    score: data.presell.headline && data.presell.headline.length > 5 ? 6 : 2,
    maxScore: 6,
    detail: data.presell.headline ? `"${data.presell.headline.substring(0, 40)}"` : "Sem headline",
    fix: !data.presell.headline ? "Adicione uma headline persuasiva na presell" : undefined,
  });

  items.push({
    category: "Presell",
    label: "Link de afiliado presente",
    status: data.presell.affiliateLink && data.presell.affiliateLink.startsWith("http") ? "pass" : "fail",
    score: data.presell.affiliateLink && data.presell.affiliateLink.startsWith("http") ? 10 : 0,
    maxScore: 10,
    detail: data.presell.affiliateLink ? "Link configurado" : "LINK OBRIGATORIO AUSENTE",
    fix: !data.presell.affiliateLink ? "Adicione o link de afiliado — sem ele a presell nao converte" : undefined,
  });

  // ─── COMPETITION CONTEXT ───
  if (data.intelligence?.topCountries?.length) {
    const targetCountry = data.intelligence.topCountries.find((c) => c.code === data.country);
    if (targetCountry) {
      const competitionOk = targetCountry.competitionLevel !== "alta";
      items.push({
        category: "Competicao",
        label: `Competicao em ${targetCountry.name}`,
        status: competitionOk ? "pass" : "warn",
        score: competitionOk ? 8 : 4,
        maxScore: 8,
        detail: `Nivel: ${targetCountry.competitionLevel} — CPM: $${targetCountry.cpmEstimate}`,
        fix: !competitionOk ? "Competicao alta: invista em copy diferenciado e presell de alta conversao" : undefined,
      });
    }
  }

  // ─── KEYWORDS ───
  items.push({
    category: "Copy",
    label: "Palavras-chave relevantes",
    status: data.keywords.length >= 3 ? "pass" : data.keywords.length > 0 ? "warn" : "fail",
    score: data.keywords.length >= 5 ? 8 : data.keywords.length >= 3 ? 6 : data.keywords.length > 0 ? 3 : 0,
    maxScore: 8,
    detail: `${data.keywords.length} palavras-chave: ${data.keywords.slice(0, 5).join(", ")}${data.keywords.length > 5 ? "..." : ""}`,
    fix: data.keywords.length < 3 ? "Adicione pelo menos 3 palavras-chave relevantes" : undefined,
  });

  // ─── CALCULATE SCORES ───
  const totalScore = items.reduce((s, i) => s + i.score, 0);
  const totalMax = items.reduce((s, i) => s + i.maxScore, 0);
  const overallScore = Math.round((totalScore / totalMax) * 100);

  const summary = {
    pass: items.filter((i) => i.status === "pass").length,
    warn: items.filter((i) => i.status === "warn").length,
    fail: items.filter((i) => i.status === "fail").length,
  };

  let grade: string;
  let verdict: string;
  if (overallScore >= 85) {
    grade = "A";
    verdict = "Campanha forte — pronta para rodar";
  } else if (overallScore >= 70) {
    grade = "B";
    verdict = "Boa, mas ajuste os pontos de attention antes de publicar";
  } else if (overallScore >= 50) {
    grade = "C";
    verdict = "Mediana — corrija os problemas antes de investir";
  } else {
    grade = "D";
    verdict = "Fraca — precisa de melhorias significativas";
  }

  return { overallScore, grade, verdict, items, summary };
}
