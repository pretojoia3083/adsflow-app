"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdsFlowWizard } from "@/components/AdsFlowWizard";
import Link from "next/link";

interface Campaign {
  id: string;
  productName: string;
  country: string;
  countryCode: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [view, setView] = useState<"list" | "create">("list");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/campaigns")
        .then((res) => res.json())
        .then((data) => {
          setCampaigns(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-[100dvh] bg-[#0B0F17] text-gray-100 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!session) return null;

  const statusColors: Record<string, string> = {
    DRAFT: "text-gray-400 bg-gray-500/15 border-gray-500",
    READY: "text-blue-400 bg-blue-500/15 border-blue-500",
    ACTIVE: "text-green-400 bg-green-500/15 border-green-500",
    PAUSED: "text-amber-400 bg-amber-500/15 border-amber-500",
    COMPLETED: "text-purple-400 bg-purple-500/15 border-purple-500",
  };

  const statusLabels: Record<string, string> = {
    DRAFT: "Rascunho",
    READY: "Pronta",
    ACTIVE: "Ativa",
    PAUSED: "Pausada",
    COMPLETED: "Concluida",
  };

  return (
    <div className="min-h-[100dvh] bg-[#0B0F17] text-gray-100 p-4 sm:p-7">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-xs font-bold text-indigo-500 tracking-wider">
              ADSFLOW
            </div>
            <h1 className="text-xl font-extrabold mt-1">Dashboard</h1>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-400 hidden sm:inline">
              {session.user?.name || session.user?.email}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              Sair
            </Link>
          </div>
        </div>

        {view === "list" && (
          <>
            <button
              onClick={() => setView("create")}
              className="bg-indigo-500 border-none text-white font-bold text-sm px-6 py-3 rounded-[9px] hover:bg-indigo-600 transition-colors mb-6"
            >
              + Nova campanha
            </button>

            {loading ? (
              <div className="text-gray-400 text-sm">Carregando campanhas...</div>
            ) : campaigns.length === 0 ? (
              <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-8 sm:p-10 text-center">
                <div className="text-4xl mb-3">📋</div>
                <div className="font-bold text-lg mb-2">
                  Nenhuma campanha ainda
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  Crie sua primeira campanha em poucos passos com ajuda da IA.
                </div>
                <button
                  onClick={() => setView("create")}
                  className="bg-indigo-500 border-none text-white font-bold text-sm px-6 py-3 rounded-[9px] hover:bg-indigo-600"
                >
                  Criar primeira campanha
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#121826] border border-[#232D40] rounded-[14px] p-4 flex items-center gap-4 hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{c.productName}</div>
                      <div className="text-sm text-gray-400">
                        {c.countryCode} ·{" "}
                        {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                        statusColors[c.status] || statusColors.DRAFT
                      }`}
                    >
                      {statusLabels[c.status] || c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === "create" && (
          <>
            <button
              onClick={() => setView("list")}
              className="bg-transparent border-none text-gray-400 text-sm font-semibold mb-3"
            >
              ← Voltar para lista
            </button>
            <AdsFlowWizard />
          </>
        )}
      </div>
    </div>
  );
}
