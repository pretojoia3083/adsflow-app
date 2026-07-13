import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PresellPage({ params }: Props) {
  const { slug } = await params;

  const presell = await prisma.presell.findUnique({
    where: { slug },
  });

  if (!presell || !presell.published) {
    notFound();
  }

  await prisma.presell.update({
    where: { id: presell.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div
      dangerouslySetInnerHTML={{ __html: presell.customHtml || "" }}
      suppressHydrationWarning
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const presell = await prisma.presell.findUnique({
    where: { slug },
    select: { title: true, headline: true },
  });

  if (!presell) {
    return { title: "Pagina nao encontrada" };
  }

  return {
    title: presell.title,
    description: presell.headline || presell.title,
  };
}
