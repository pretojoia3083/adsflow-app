import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { headline, subheadline, ctaText, bgColor, accentColor, textColor, format, productName } = body;

    const width = format === "stories" ? 1080 : format === "link" ? 1200 : 1080;
    const height = format === "stories" ? 1920 : format === "link" ? 628 : 1080;

    const html = generateBannerHTML({
      headline: headline || "Oferta Especial",
      subheadline: subheadline || "",
      ctaText: ctaText || "Saiba Mais",
      bgColor: bgColor || "#080B14",
      accentColor: accentColor || "#8B5CF6",
      textColor: textColor || "#F3F5FF",
      productName: productName || "",
      width,
      height,
    });

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return NextResponse.json({ error: "Erro ao gerar banner" }, { status: 500 });
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function generateBannerHTML(opts: {
  headline: string;
  subheadline: string;
  ctaText: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  productName: string;
  width: number;
  height: number;
}): string {
  const { headline, subheadline, ctaText, bgColor, accentColor, textColor, productName, width, height } = opts;
  const isStories = height > width;
  const orbSize1 = isStories ? 400 : 300;
  const orbSize2 = isStories ? 300 : 200;
  const pad = isStories ? "80px 40px" : "40px 60px";
  const badgeFontSize = isStories ? 14 : 12;
  const h1FontSize = isStories ? 48 : Math.min(56, Math.round(width * 0.06));
  const subFontSize = isStories ? 22 : 18;
  const subMaxWidth = Math.round(width * 0.7);
  const ctaPad = isStories ? "20px 48px" : "16px 40px";
  const bottomPos = isStories ? 40 : 20;
  const rightPos = isStories ? 40 : 24;
  const marginBottom = isStories ? 32 : 20;

  const accentBg = hexToRgba(accentColor, 0.13);
  const accentBorder = hexToRgba(accentColor, 0.27);
  const textDim = hexToRgba(textColor, 0.6);
  const textFaint = hexToRgba(textColor, 0.27);

  return [
    '<!DOCTYPE html>',
    '<html><head><meta charset="utf-8"><style>',
    '*{margin:0;padding:0;box-sizing:border-box}',
    `body{width:${width}px;height:${height}px;background:${bgColor};font-family:'Segoe UI',system-ui,-apple-system,sans-serif;overflow:hidden;position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:${pad}}`,
    '.gradient-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.3}',
    `.orb1{width:${orbSize1}px;height:${orbSize1}px;background:${accentColor};top:${isStories ? '-10%' : '-20%'};right:${isStories ? '-20%' : '-10%'}}`,
    `.orb2{width:${orbSize2}px;height:${orbSize2}px;background:${accentColor};bottom:${isStories ? '10%' : '-15%'};left:-10%;opacity:.2}`,
    `.content{position:relative;z-index:2;max-width:${Math.round(width * 0.85)}px}`,
    `.badge{display:inline-block;padding:8px 20px;background:${accentBg};border:1px solid ${accentBorder};border-radius:20px;font-size:${badgeFontSize}px;font-weight:600;color:${accentColor};letter-spacing:2px;text-transform:uppercase;margin-bottom:${marginBottom}px}`,
    `h1{font-size:${h1FontSize}px;font-weight:800;color:${textColor};line-height:1.1;margin-bottom:${isStories ? 24 : 16}px;letter-spacing:-1px}`,
    `.sub{font-size:${subFontSize}px;color:${textDim};line-height:1.5;margin-bottom:${isStories ? 48 : 32}px;max-width:${subMaxWidth}px}`,
    `.cta{display:inline-block;padding:${ctaPad};background:${accentColor};color:${bgColor};font-size:${subFontSize}px;font-weight:700;border-radius:12px;letter-spacing:0.5px}`,
    `.brand{position:absolute;bottom:${bottomPos}px;right:${rightPos}px;font-size:11px;color:${textFaint};font-weight:600;letter-spacing:2px}`,
    '</style></head><body>',
    '<div class="gradient-orb orb1"></div>',
    '<div class="gradient-orb orb2"></div>',
    '<div class="content">',
    `<div class="badge">${escapeHtml(productName)}</div>`,
    `<h1>${escapeHtml(headline)}</h1>`,
    subheadline ? `<p class="sub">${escapeHtml(subheadline)}</p>` : '',
    `<div class="cta">${escapeHtml(ctaText)}</div>`,
    '</div>',
    '<div class="brand">ADSFLOW</div>',
    '</body></html>',
  ].join('\n');
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
