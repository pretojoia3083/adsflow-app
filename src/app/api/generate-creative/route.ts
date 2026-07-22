import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productName, description, audience, style } = body;

    if (!productName) {
      return NextResponse.json({ error: "productName obrigatorio" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { openaiApiKey: true },
    });

    const apiKey = user?.openaiApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key nao configurada." }, { status: 400 });
    }

    const prompt = buildPrompt(productName, description, audience, style);

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `HTTP ${res.status}`;
      let hint = "";
      if (msg.includes("rate_limit")) hint = " Limite atingido. Aguarde 1 min.";
      else if (msg.includes("insufficient")) hint = " Creditos insuficientes.";
      else if (msg.includes("content_policy")) hint = " Prompt violou politicas.";
      return NextResponse.json({ error: `${msg}${hint}` }, { status: 500 });
    }

    const data = await res.json();
    const item = data.data?.[0];
    if (!item) {
      return NextResponse.json({ error: "Nao foi possivel gerar imagem." }, { status: 500 });
    }

    if (item.url) {
      return NextResponse.json({
        success: true,
        images: [{ url: item.url, revisedPrompt: item.revised_prompt }],
      });
    }

    if (item.b64_json) {
      const buf = Buffer.from(item.b64_json, "base64");
      const mime = buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg" : "image/png";
      return new NextResponse(buf, {
        status: 200,
        headers: { "Content-Type": mime },
      });
    }

    return NextResponse.json({ error: "Nao foi possivel gerar imagem." }, { status: 500 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar criativo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildPrompt(productName: string, description?: string, audience?: string, style?: string): string {
  const base = `Create a professional, high-converting Facebook/Instagram ad image for "${productName}".`;
  const desc = description ? ` The product is: ${description}.` : "";
  const aud = audience ? ` Target audience: ${audience}.` : "";
  const styleMap: Record<string, string> = {
    modern: "Use a clean, modern, minimalist design with bold typography and vibrant colors.",
    bold: "Use bold, attention-grabbing colors with strong contrast and dynamic composition.",
    elegant: "Use an elegant, premium design with sophisticated colors and refined typography.",
    playful: "Use a fun, colorful, playful design with friendly shapes and warm tones.",
    corporate: "Use a professional, trustworthy corporate design with blue tones and clean layout.",
  };
  const sty = styleMap[style || "modern"] || styleMap.modern;
  return `${base}${desc}${aud} ${sty} The image should work as a social media advertisement. No text or watermarks in the image. Professional quality, high resolution look. 1:1 aspect ratio composition.`;
}
