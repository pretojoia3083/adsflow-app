import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const presell = await prisma.presell.findUnique({ where: { slug } });
  if (!presell) return { title: "Pagina nao encontrada" };
  return {
    title: presell.title || presell.headline || "Presell",
    description: presell.subheadline || presell.bodyText?.slice(0, 160) || "",
    openGraph: {
      title: presell.title || presell.headline || "",
      description: presell.subheadline || "",
      type: "website",
    },
  };
}

export default async function PresellPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const presell = await prisma.presell.findUnique({ where: { slug } });

  if (!presell) notFound();

  await prisma.presell.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});

  const bg = presell.bgColor || "#080B14";
  const accent = presell.accentColor || "#8B5CF6";
  const text = presell.textColor || "#F3F5FF";

  const videoUrl = presell.customHtml?.match(/videoUrl["':\s]+([^"']+)/)?.[1] || "";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(32px, 6vw, 72px) clamp(16px, 4vw, 32px)", textAlign: "center" }}>
        {presell.network && (
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: accent, textTransform: "uppercase" as const, marginBottom: 20 }}>
            {presell.network}
          </div>
        )}

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 18 }}>
          {presell.headline || presell.title}
        </h1>

        {presell.subheadline && (
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: text + "bb", lineHeight: 1.65, marginBottom: 36, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            {presell.subheadline}
          </p>
        )}

        {presell.bodyText && (
          <div style={{ fontSize: "clamp(15px, 2vw, 17px)", color: text + "cc", lineHeight: 1.8, textAlign: "left" as const, marginBottom: 40, whiteSpace: "pre-line" }}>
            {presell.bodyText}
          </div>
        )}

        {presell.affLink && (
          <a
            href={presell.affLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "18px 48px",
              background: accent,
              color: bg,
              borderRadius: 14,
              fontSize: "clamp(16px, 2.5vw, 20px)",
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: `0 4px 24px ${accent}44`,
            }}
          >
            {presell.ctaText || "Saiba Mais"}
          </a>
        )}

        <p style={{ fontSize: 13, color: text + "44", marginTop: 48 }}>
          Powered by AdsFlow
        </p>
      </div>
    </div>
  );
}
