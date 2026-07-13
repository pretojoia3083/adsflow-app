export interface PresellConfig {
  title: string;
  headline: string;
  subheadline?: string;
  bodyText: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  template: "advertorial" | "quiz" | "comparacao" | "depoimentos" | "contagem";
  language: string;
}

export function generatePresellHtml(config: PresellConfig): string {
  const baseStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: ${config.bgColor};
      color: ${config.textColor};
      min-height: 100vh;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .headline {
      font-size: 28px;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 16px;
    }
    .subheadline {
      font-size: 18px;
      font-weight: 500;
      opacity: 0.8;
      margin-bottom: 24px;
    }
    .body-text {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .cta-button {
      display: inline-block;
      background: ${config.accentColor};
      color: white;
      font-size: 18px;
      font-weight: 700;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      text-align: center;
      width: 100%;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    .badge {
      display: inline-block;
      background: ${config.accentColor}22;
      color: ${config.accentColor};
      font-size: 12px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 999px;
      margin-bottom: 16px;
    }
    .timer {
      background: rgba(0,0,0,0.2);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      margin: 24px 0;
    }
    .timer-value {
      font-size: 32px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
  `;

  let content = "";

  switch (config.template) {
    case "advertorial":
      content = `
        <div class="badge">Artigo Patrocinado</div>
        <h1 class="headline">${config.headline}</h1>
        ${config.subheadline ? `<p class="subheadline">${config.subheadline}</p>` : ""}
        <div class="body-text">${config.bodyText}</div>
        <a href="${config.ctaLink}" class="cta-button">${config.ctaText}</a>
      `;
      break;

    case "quiz":
      content = `
        <div class="badge">Teste Descoberta</div>
        <h1 class="headline">${config.headline}</h1>
        ${config.subheadline ? `<p class="subheadline">${config.subheadline}</p>` : ""}
        <div class="body-text">${config.bodyText}</div>
        <div id="quiz-container">
          <a href="${config.ctaLink}" class="cta-button">${config.ctaText}</a>
        </div>
      `;
      break;

    case "comparacao":
      content = `
        <div class="badge">Comparação</div>
        <h1 class="headline">${config.headline}</h1>
        ${config.subheadline ? `<p class="subheadline">${config.subheadline}</p>` : ""}
        <div class="body-text">${config.bodyText}</div>
        <a href="${config.ctaLink}" class="cta-button">${config.ctaText}</a>
      `;
      break;

    case "depoimentos":
      content = `
        <div class="badge">Depoimentos Reais</div>
        <h1 class="headline">${config.headline}</h1>
        ${config.subheadline ? `<p class="subheadline">${config.subheadline}</p>` : ""}
        <div class="body-text">${config.bodyText}</div>
        <a href="${config.ctaLink}" class="cta-button">${config.ctaText}</a>
      `;
      break;

    case "contagem":
      content = `
        <div class="badge">Oferta por Tempo Limitado</div>
        <h1 class="headline">${config.headline}</h1>
        ${config.subheadline ? `<p class="subheadline">${config.subheadline}</p>` : ""}
        <div class="timer">
          <div style="font-size:12px;opacity:0.7;margin-bottom:8px;">Oferta expira em:</div>
          <div class="timer-value" id="countdown">23:59:59</div>
        </div>
        <div class="body-text">${config.bodyText}</div>
        <a href="${config.ctaLink}" class="cta-button">${config.ctaText}</a>
        <script>
          let time = 23*3600 + 59*60 + 59;
          setInterval(() => {
            if(time <= 0) return;
            time--;
            const h = String(Math.floor(time/3600)).padStart(2,'0');
            const m = String(Math.floor((time%3600)/60)).padStart(2,'0');
            const s = String(time%60).padStart(2,'0');
            document.getElementById('countdown').textContent = h+':'+m+':'+s;
          }, 1000);
        </script>
      `;
      break;

    default:
      content = `
        <h1 class="headline">${config.headline}</h1>
        ${config.subheadline ? `<p class="subheadline">${config.subheadline}</p>` : ""}
        <div class="body-text">${config.bodyText}</div>
        <a href="${config.ctaLink}" class="cta-button">${config.ctaText}</a>
      `;
  }

  return `<!DOCTYPE html>
<html lang="${config.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>`;
}

export function parseCpm(str: string): { min: number; max: number } {
  const nums = (str || "").match(/[\d.]+/g);
  if (!nums || nums.length === 0) return { min: 3, max: 8 };
  if (nums.length === 1) return { min: +nums[0], max: +nums[0] * 1.6 };
  return { min: +nums[0], max: +nums[1] };
}

export function suggestBudget(
  cpmStr: string,
  funnelStage: string,
  budgetPref: string
): { daily: number; reasoning: string } {
  const { min, max } = parseCpm(cpmStr);
  const avgCpm = (min + max) / 2;
  const funnelMultiplier =
    { topo: 1.4, meio: 1.0, fundo: 0.7 }[funnelStage] || 1;
  const prefMultiplier =
    { baixo: 0.6, medio: 1, alto: 1.8 }[budgetPref] || 1;
  const impressionsTarget = 8000;
  const daily = Math.max(
    15,
    ((avgCpm * impressionsTarget) / 1000) * funnelMultiplier * prefMultiplier
  );

  return {
    daily: Math.round(daily),
    reasoning:
      funnelStage === "topo"
        ? "Topo de funil precisa de mais alcance pra gerar reconhecimento, por isso a verba é mais alta."
        : funnelStage === "fundo"
        ? "Fundo de funil já é público qualificado (retargeting), então a verba pode ser mais enxuta."
        : "Meio de funil equilibra alcance e qualificação.",
  };
}

export function deviceSplit(funnelStage: string) {
  if (funnelStage === "topo")
    return { desktop: 15, mobile: 75, tablet: 10 };
  if (funnelStage === "fundo")
    return { desktop: 35, mobile: 55, tablet: 10 };
  return { desktop: 22, mobile: 68, tablet: 10 };
}
