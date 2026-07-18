interface ScrapedAd {
  pageName: string;
  body: string;
  title: string;
  description: string;
  platforms: string[];
  startTime: string;
  daysRunning: number;
  snapshotUrl: string;
  landingUrl: string;
  isMock: boolean;
  score: number;
  scoreLabel: "top" | "bom" | "recente";
  mediaType: string;
}

const COUNTRY_DATA: Record<string, {
  name: string;
  lang: "pt" | "en" | "es" | "de" | "fr" | "it" | "ja" | "ko" | "zh";
  pages: string[];
  ctas: string[];
  formats: string[];
}> = {
  BR: { name: "Brasil", lang: "pt", pages: ["Resultados Digitais BR", "Academia Online Pro", "Vida Fit Brasil", "Mentoria Digital BR", "Startup Hub BR", "Crypto Masters BR", "SkinCare Brasil", "Investidor Inteligente BR"], ctas: ["Quero Comecar Agora", "Garantir Minha Vaga", "Acessar Agora", "Comecar Gratis", "Ver Depoimentos"], formats: [" Metodo Comprovado", " em 30 Dias", " - Aula Gratis", " Passo a Passo", " Oferta Especial"] },
  US: { name: "United States", lang: "en", pages: ["Digital Results Pro", "Fitness Academy US", "LifeStyle Premium", "Growth Marketing Co", "Crypto Trading Hub", "SkinCare US", "Health Plus USA", "Smart Investing US"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" Blueprint", " System", " Masterclass", " Toolkit", " Challenge"] },
  GB: { name: "United Kingdom", lang: "en", pages: ["Digital Results UK", "Fitness Academy UK", "LifeStyle Premium UK", "Growth Marketing UK", "Crypto Trading UK", "SkinCare UK", "Health Plus UK", "Smart Investing UK"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" Blueprint", " System", " Masterclass", " Toolkit", " Challenge"] },
  PT: { name: "Portugal", lang: "pt", pages: ["Resultados Digitais PT", "Academia Online PT", "Vida Fit Portugal", "Mentoria Digital PT", "Startup Hub PT", "Crypto Masters PT", "SkinCare Portugal", "Investidor PT"], ctas: ["Comecar Agora", "Garantir Vaga", "Aceder Agora", "Comecar Gratis", "Ver Resultados"], formats: [" Metodo Comprovado", " em 30 Dias", " Aula Gratis", " Passo a Passo", " Oferta Especial"] },
  DE: { name: "Deutschland", lang: "de", pages: ["Digital Results DE", "Fitness Akademie DE", "LifeStyle Premium DE", "Growth Marketing DE", "Crypto Trading DE", "SkinCare DE", "Health Plus DE", "Smart Investing DE"], ctas: ["Jetzt Starten", "Zugang Erhalten", "Kostenlos Beitreten", "Training Ansehen", "Ergebnisse Sehen"], formats: [" System", " Methode", " Masterclass", " Toolkit", " Challenge"] },
  FR: { name: "France", lang: "fr", pages: ["Resultats Digitaux FR", "Academie Fitness FR", "LifeStyle Premium FR", "Growth Marketing FR", "Crypto Trading FR", "SkinCare FR", "Sante Plus FR", "Investisseur FR"], ctas: ["Commencer Maintenant", "Acceder", "Rejoindre Gratuitement", "Voir la Formation", "Voir les Resultats"], formats: [" Methode", " Systeme", " Masterclass", " Boite a Outils", " Defi"] },
  ES: { name: "Espana", lang: "es", pages: ["Resultados Digitales ES", "Academia Fitness ES", "LifeStyle Premium ES", "Growth Marketing ES", "Crypto Trading ES", "SkinCare ES", "Salud Plus ES", "Inversor Inteligente ES"], ctas: ["Empezar Ahora", "Obtener Acceso", "Unirse Gratis", "Ver la Formacion", "Ver Resultados"], formats: [" Metodo", " Sistema", " Masterclass", " Kit", " Desafio"] },
  IT: { name: "Italia", lang: "it", pages: ["Risultati Digitali IT", "Accademia Fitness IT", "LifeStyle Premium IT", "Growth Marketing IT", "Crypto Trading IT", "SkinCare IT", "Salute Plus IT", "Investitore IT"], ctas: ["Inizia Ora", "Ottieni Accesso", "Unisciti Gratis", "Guarda il Corso", "Vedi i Risultati"], formats: [" Metodo", " Sistema", " Masterclass", " Kit", " Sfida"] },
  JP: { name: "Japan", lang: "ja", pages: ["Digital Results JP", "Fitness Academy JP", "LifeStyle Premium JP", "Growth Marketing JP", "Crypto Trading JP", "SkinCare JP", "Health Plus JP", "Smart Investing JP"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" System", " Method", " Masterclass", " Toolkit", " Challenge"] },
  KR: { name: "South Korea", lang: "ko", pages: ["Digital Results KR", "Fitness Academy KR", "LifeStyle Premium KR", "Growth Marketing KR", "Crypto Trading KR", "SkinCare KR", "Health Plus KR", "Smart Investing KR"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" System", " Method", " Masterclass", " Toolkit", " Challenge"] },
  MX: { name: "Mexico", lang: "es", pages: ["Resultados Digitales MX", "Academia Fitness MX", "LifeStyle Premium MX", "Growth Marketing MX", "Crypto Trading MX", "SkinCare MX", "Salud Plus MX", "Inversor MX"], ctas: ["Empezar Ahora", "Obtener Acceso", "Unirse Gratis", "Ver la Formacion", "Ver Resultados"], formats: [" Metodo", " Sistema", " Masterclass", " Kit", " Desafio"] },
  AR: { name: "Argentina", lang: "es", pages: ["Resultados Digitales AR", "Academia Fitness AR", "LifeStyle Premium AR", "Growth Marketing AR", "Crypto Trading AR", "SkinCare AR", "Salud Plus AR", "Inversor AR"], ctas: ["Empezar Ahora", "Obtener Acceso", "Unirse Gratis", "Ver la Formacion", "Ver Resultados"], formats: [" Metodo", " Sistema", " Masterclass", " Kit", " Desafio"] },
  CO: { name: "Colombia", lang: "es", pages: ["Resultados Digitales CO", "Academia Fitness CO", "LifeStyle Premium CO", "Growth Marketing CO", "Crypto Trading CO", "SkinCare CO", "Salud Plus CO", "Inversor CO"], ctas: ["Empezar Ahora", "Obtener Acceso", "Unirse Gratis", "Ver la Formacion", "Ver Resultados"], formats: [" Metodo", " Sistema", " Masterclass", " Kit", " Desafio"] },
  CA: { name: "Canada", lang: "en", pages: ["Digital Results CA", "Fitness Academy CA", "LifeStyle Premium CA", "Growth Marketing CA", "Crypto Trading CA", "SkinCare CA", "Health Plus CA", "Smart Investing CA"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" Blueprint", " System", " Masterclass", " Toolkit", " Challenge"] },
  AU: { name: "Australia", lang: "en", pages: ["Digital Results AU", "Fitness Academy AU", "LifeStyle Premium AU", "Growth Marketing AU", "Crypto Trading AU", "SkinCare AU", "Health Plus AU", "Smart Investing AU"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" Blueprint", " System", " Masterclass", " Toolkit", " Challenge"] },
  NL: { name: "Netherlands", lang: "en", pages: ["Digital Results NL", "Fitness Academy NL", "LifeStyle Premium NL", "Growth Marketing NL", "Crypto Trading NL"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" System", " Method", " Masterclass", " Toolkit", " Challenge"] },
  PL: { name: "Poland", lang: "en", pages: ["Digital Results PL", "Fitness Academy PL", "LifeStyle Premium PL", "Growth Marketing PL", "Crypto Trading PL"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" System", " Method", " Masterclass", " Toolkit", " Challenge"] },
  TR: { name: "Turkey", lang: "en", pages: ["Digital Results TR", "Fitness Academy TR", "LifeStyle Premium TR", "Growth Marketing TR", "Crypto Trading TR"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" System", " Method", " Masterclass", " Toolkit", " Challenge"] },
  ALL: { name: "Global", lang: "en", pages: ["Digital Results Global", "Fitness Academy Global", "LifeStyle Premium Global", "Growth Marketing Global", "Crypto Trading Global"], ctas: ["Start Now", "Get Access", "Join Free", "Watch Training", "See Results"], formats: [" Blueprint", " System", " Masterclass", " Toolkit", " Challenge"] },
};

const BODY_TEMPLATES: Record<string, string[]> = {
  pt: [
    "Voce quer {query}? Nosso metodo ja ajudou mais de 10.000 pessoas a alcancar resultados reais. Sem promessas falsas, so ciencia. Clique e descubra como comecar hoje mesmo.",
    "Transforme seu corpo com nosso programa de {query}. Treinos personalizados, suporte 24h e garantia de 30 dias. Comece agora e veja resultados na primeira semana.",
    "Descubra o que 1% dos mais bem-sucedidos fazem diferente. Metodo exclusivo revelado por especialistas com mais de 15 anos de experiencia em {query}. Vagas limitadas.",
    "Nossa aula gratuita sobre {query} ja foi assistida por 50.000+ pessoas. Aprenda as estrategias que funcionam de verdade. Assista agora antes que remova.",
    "Se voce esta buscando {query}, conheca nosso sistema que ja gerou mais de R$ 2M em resultados para nossos alunos. Metodos testados e aprovados.",
    "Ha 2 anos eu nao sabia nada sobre {query}. Hoje faturei mais de R$ 500K. Quero te ensinar exatamente o que fiz, passo a passo. Vagas limitadas.",
    "Nosso programa de {query} e baseado em ciencia. 21 dias de acompanhamento, plano personalizado e suporte completo. Comece hoje.",
    "Aprenda {query} do zero ao avancado com nosso metodo exclusivo. 12 modulos, 200+ aulas, suporte direto com os instrutores. Garantia de 7 dias.",
  ],
  en: [
    "Want to master {query}? Our proven method has helped 10,000+ people achieve real results. No false promises, just science. Click to start today.",
    "Transform your body with our {query} program. Personalized training, 24h support and 30-day guarantee. Start now and see results in the first week.",
    "Discover what the top 1% do differently. Exclusive method revealed by specialists with 15+ years of experience in {query}. Limited spots.",
    "Our free training on {query} has been watched by 50,000+ people. Learn strategies that actually work. Watch now before we take it down.",
    "Looking for {query}? Meet our system that has generated $2M+ in results for our students. Methods tested and proven.",
    "2 years ago I knew nothing about {query}. Today I've made over $500K. I want to teach you exactly what I did, step by step. Limited spots.",
    "Our {query} program is science-based. 21 days of coaching, personalized plan and full support. Start today.",
    "Learn {query} from zero to advanced with our exclusive method. 12 modules, 200+ lessons, direct instructor support. 7-day guarantee.",
  ],
  es: [
    "Quieres dominar {query}? Nuestro metodo comprobado ya ayudo a mas de 10.000 personas a lograr resultados reales. Sin promesas falsas, solo ciencia. Haz clic para empezar.",
    "Transforma tu cuerpo con nuestro programa de {query}. Entrenamientos personalizados, soporte 24h y garantia de 30 dias. Empieza ahora y ve resultados en la primera semana.",
    "Descubre lo que el 1% de los mas exitosos hacen diferente. Metodo exclusivo revelado por especialistas con mas de 15 anios de experiencia en {query}. Plazas limitadas.",
    "Nuestra clase gratuita sobre {query} ya fue vista por 50.000+ personas. Aprende estrategias que realmente funcionan. Mira ahora antes de que la quitemos.",
    "Si estas buscando {query}, conoce nuestro sistema que ya genero mas de $2M en resultados para nuestros alumnos. Metodos probados y aprobados.",
    "Hace 2 anios no sabia nada sobre {query}. Hoy facturo mas de $500K. Quiero ensenarte exactamente lo que hice, paso a paso. Plazas limitadas.",
    "Nuestro programa de {query} esta basado en ciencia. 21 dias de acompanamiento, plan personalizado y soporte completo. Empieza hoy.",
    "Aprende {query} desde cero hasta avanzado con nuestro metodo exclusivo. 12 modulos, 200+ clases, soporte directo. Garantia de 7 dias.",
  ],
  de: [
    "Willst du {query} meistern? Unsere bewahrte Methode hat 10.000+ Menschen geholfen, echte Ergebnisse zu erzielen. Klicke um heute zu starten.",
    "Verwandle deinen Korper mit unserem {query}-Programm. Personalisiertes Training, 24h Support und 30 Tage Garantie. Starte jetzt.",
    "Entdecke was die Top 1% anders machen. Exklusive Methode von Spezialisten mit 15+ Jahren Erfahrung in {query}. Begrenzte Plätze.",
    "Unser kostenloses Training zu {query} wurde von 50.000+ Menschen angesehen. Lerne Strategien die wirklich funktionieren. Schau jetzt rein.",
    "Suchst du nach {query}? Lerne unser System kennen das $2M+ an Ergebnissen fur unsere Schuler generiert hat. Getestete Methoden.",
    "Vor 2 Jahren wusste ich nichts uber {query}. Heute mache ich uber $500K. Ich will dir genau beibringen was ich getan habe. Begrenzte Plätze.",
    "Unser {query}-Programm basiert auf Wissenschaft. 21 Tage Coaching, personalisierter Plan und voller Support. Starte heute.",
    "Lerne {query} von Null bis Fortgeschritten mit unserer exklusiven Methode. 12 Module, 200+ Lektionen. 7 Tage Garantie.",
  ],
  fr: [
    "Vous voulez maitriser {query}? Notre methode prouvee a aide plus de 10.000 personnes a obtenir des resultats reels. Cliquez pour commencer.",
    "Transformez votre corps avec notre programme de {query}. Entrainement personnalise, support 24h et garantie de 30 jours. Commencez maintenant.",
    "Decouvrez ce que le top 1% fait differemment. Methode exclusive revelée par des specialistes avec 15+ ans d'experience en {query}. Places limitees.",
    "Notre formation gratuite sur {query} a ete regardée par 50.000+ personnes. Apprenez des strategies qui fonctionnent vraiment. Regardez maintenant.",
    "Vous cherchez {query}? Decouvrez notre systeme qui a genere plus de 2M$ de resultats pour nos eleves. Methodes testees et approuvees.",
    "Il y a 2 ans je ne savais rien sur {query}. Aujourd'hui je facture plus de 500K$. Je veux vous enseigner exactement ce que j'ai fait. Places limitees.",
    "Notre programme de {query} est base sur la science. 21 jours d'accompagnement, plan personnalise et support complet. Commencez aujourd'hui.",
    "Apprenez {query} du debut a l'avance avec notre methode exclusive. 12 modules, 200+ lecons. Garantie de 7 jours.",
  ],
  it: [
    "Vuoi padroneggiare {query}? Il nostro metodo collaudato ha aiutato oltre 10.000 persone a ottenere risultati reali. Clicca per iniziare oggi.",
    "Trasforma il tuo corpo con il nostro programma di {query}. Allenamento personalizzato, supporto 24h e garanzia di 30 giorni. Inizia ora.",
    "Scopri cosa fa diversamente il top 1%. Metodo esclusivo rivelato da specialisti con 15+ anni di esperienza in {query}. Posti limitati.",
    "Il nostro training gratuito su {query} e stato guardato da 50.000+ persone. Impara strategie che funzionano davvero. Guarda ora.",
    "Stai cercando {query}? Scopri il nostro sistema che ha generato $2M+ di risultati per i nostri studenti. Metodi testati e approvati.",
    "2 anni fa non sapevo nulla di {query}. Oggi fatturo oltre $500K. Voglio insegnarti esattamente cosa ho fatto, passo dopo passo. Posti limitati.",
    "Il nostro programma di {query} e basato sulla scienza. 21 giorni di coaching, piano personalizzato e supporto completo. Inizia oggi.",
    "Impara {query} da zero ad avanzato con il nostro metodo esclusivo. 12 moduli, 200+ lezioni. Garanzia di 7 giorni.",
  ],
  ja: [
    "{query}をマスターしたいですか？ our proven method has helped 10,000+ people. クリックして今日から始めましょう。",
    "our {query} program will transform your body. 個人トレーニング、24時間サポート、30日間保証。今すぐ始めましょう。",
  ],
  ko: [
    "{query}를 마스터하고 싶으신가요? our proven method has helped 10,000+ people. 클릭하여 오늘 시작하세요.",
    "our {query} program will transform your body. 개인 트레이닝, 24시간 지원, 30일 보증. 지금 시작하세요.",
  ],
};

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

export async function scrapeAdLibrary(
  query: string,
  country: string,
  minDays: number,
  maxDays: number,
  limit: number = 10
): Promise<{ ads: ScrapedAd[]; facebookAdLibraryUrl: string; note: string }> {
  const fbCountry = country === "ALL" ? "" : country;
  const facebookAdLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${fbCountry}&q=${encodeURIComponent(query)}`;

  const ads = generateCountryAds(query, country, minDays, maxDays, limit);

  const countryData = COUNTRY_DATA[country] || COUNTRY_DATA["ALL"];
  const note = `${ads.length} exemplos de copy — veja anuncios reais no Facebook Ad Library`;

  return { ads, facebookAdLibraryUrl, note };
}

function generateCountryAds(
  query: string,
  country: string,
  minDays: number,
  maxDays: number,
  limit: number
): ScrapedAd[] {
  const data = COUNTRY_DATA[country] || COUNTRY_DATA["ALL"];
  const bodies = BODY_TEMPLATES[data.lang] || BODY_TEMPLATES["en"];
  const rng = seededRandom(`${query}_${country}`);
  const now = Date.now();
  const msPerDay = 86400000;

  const count = Math.min(limit, data.pages.length, bodies.length);

  return Array.from({ length: count }, (_, i) => {
    const body = bodies[i % bodies.length].replace(/\{query\}/g, query);
    const daysRunning = Math.floor(rng() * (maxDays - minDays + 1)) + minDays;
    const platforms: string[] = [];
    if (rng() > 0.3) platforms.push("Facebook");
    if (rng() > 0.3) platforms.push("Instagram");
    if (rng() > 0.7) platforms.push("Messenger");
    if (platforms.length === 0) platforms.push("Facebook", "Instagram");

    const score = calcScore(daysRunning, platforms);

    return {
      pageName: data.pages[i % data.pages.length],
      body,
      title: `${query}${data.formats[i % data.formats.length]}`,
      description: data.ctas[i % data.ctas.length],
      platforms,
      startTime: new Date(now - daysRunning * msPerDay).toISOString(),
      daysRunning,
      snapshotUrl: "",
      landingUrl: "",
      isMock: true,
      score,
      scoreLabel: (score >= 70 ? "top" : score >= 40 ? "bom" : "recente") as "top" | "bom" | "recente",
      mediaType: "image",
    };
  }).sort((a, b) => b.score - a.score);
}

function calcScore(daysRunning: number, platforms: string[]): number {
  let score = 0;
  if (daysRunning >= 90) score += 60;
  else if (daysRunning >= 60) score += 50;
  else if (daysRunning >= 30) score += 40;
  else if (daysRunning >= 14) score += 25;
  else if (daysRunning >= 7) score += 15;
  else score += 5;

  score += Math.min(platforms.length * 10, 30);
  score += 10;
  return Math.min(score, 100);
}
