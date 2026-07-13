"use client";

import { useState } from "react";
import Stepper from "@/components/Stepper";
import {
  COUNTRIES,
  CTA_OPTIONS,
  type CampaignData,
  type AdCopy,
  type MarketAnalysis,
} from "@/types";

const TOTAL_STEPS = 5;

const INPUT =
  "w-full bg-[#0F1322] border border-[#2A3358] rounded-lg px-4 py-3 text-[#F3F5FF] placeholder-[#56607A] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 focus:border-[#6366F1] transition-all";
const LABEL = "block text-sm font-medium text-[#9CA3C0] mb-1.5";
const CARD = "bg-[#121830] border border-[#1E2540] rounded-xl p-6";

export default function AdsFlowWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    audience: "",
    country: "BR",
    language: "pt",
  });

  const [market, setMarket] = useState<MarketAnalysis | null>(null);

  const [adCopy, setAdCopy] = useState<AdCopy>({
    headline: "",
    primaryText: "",
    description: "",
    cta: "Saiba Mais",
  });

  const [presell, setPresell] = useState({
    slug: "",
    title: "",
    headline: "",
    ctaText: "Saiba Mais",
    bgColor: "#080B14",
    accentColor: "#6366F1",
    textColor: "#F3F5FF",
  });

  const [launch, setLaunch] = useState({
    budgetDaily: 30,
    deviceSplit: { desktop: 30, mobile: 70 },
  });

  async function fetchMarket() {
    setLoading(true);
    try {
      const res = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          audience: product.audience,
          country: product.country,
          language: product.language,
        }),
      });
      const data = await res.json();
      setMarket(data);
    } catch {
      setMarket(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCopy() {
    setLoading(true);
    try {
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.productName,
          audience: product.audience,
          country: product.country,
          funnelStage: "meio",
        }),
      });
      const data = await res.json();
      setAdCopy(data);
    } catch {
      // keep existing
    } finally {
      setLoading(false);
    }
  }

  async function handleLaunch() {
    setLoading(true);
    try {
      const payload: CampaignData = {
        productName: product.productName,
        description: product.description,
        audience: product.audience,
        funnelStage: "meio",
        budgetPref: "medio",
        country: product.country,
        countryCode: product.country,
        language: product.language,
        estimatedCpm: market?.cpmEstimate,
        keywords: [],
        interests: [],
        placements: ["Feed do Facebook", "Feed do Instagram"],
        budgetDaily: launch.budgetDaily,
        deviceSplit: launch.deviceSplit,
        adCopy,
      };

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStep(6);
      }
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step === 1) fetchMarket();
    if (step === 2) fetchCopy();
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const countryObj = COUNTRIES.find((c) => c.code === product.country);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#F3F5FF]">
            AdsFlow Wizard
          </h1>
          <p className="text-[#56607A] mt-1 text-sm">
            Configure sua campanha em poucos passos
          </p>
        </div>

        {step <= TOTAL_STEPS && <Stepper steps={TOTAL_STEPS} currentStep={step} />}

        <div className={CARD}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#F3F5FF] mb-4">
                Produto & Mercado
              </h2>
              <div>
                <label className={LABEL}>Nome do Produto</label>
                <input
                  className={INPUT}
                  placeholder="Ex: Curso de Tráfego Pago"
                  value={product.productName}
                  onChange={(e) =>
                    setProduct({ ...product, productName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Descrição</label>
                <textarea
                  className={INPUT + " min-h-[80px] resize-y"}
                  placeholder="Descreva brevemente o produto ou serviço..."
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Público-Alvo</label>
                <input
                  className={INPUT}
                  placeholder="Ex: Empreendedores, 25-45 anos"
                  value={product.audience}
                  onChange={(e) =>
                    setProduct({ ...product, audience: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>País</label>
                  <select
                    className={INPUT}
                    value={product.country}
                    onChange={(e) => {
                      const code = e.target.value;
                      const c = COUNTRIES.find((x) => x.code === code);
                      setProduct({
                        ...product,
                        country: code,
                        language: c?.language ?? "en",
                      });
                    }}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Idioma</label>
                  <input
                    className={INPUT}
                    value={countryObj?.language === "pt" ? "Português" : countryObj?.language === "es" ? "Espanhol" : "Inglês"}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#F3F5FF] mb-4">
                Análise de Mercado
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : market ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#0F1322] rounded-lg p-4 text-center">
                      <div
                        className={`text-3xl font-bold ${
                          market.score >= 80
                            ? "text-emerald-400"
                            : market.score >= 65
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {market.score}
                      </div>
                      <div className="text-xs text-[#56607A] mt-1">Score</div>
                    </div>
                    <div className="bg-[#0F1322] rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-[#6366F1]">
                        {market.cpmEstimate}
                      </div>
                      <div className="text-xs text-[#56607A] mt-1">
                        CPM Est.
                      </div>
                    </div>
                    <div className="bg-[#0F1322] rounded-lg p-4 text-center">
                      <div className="text-xl font-bold text-[#F3F5FF]">
                        {market.audienceSize}
                      </div>
                      <div className="text-xs text-[#56607A] mt-1">
                        Audiência
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#0F1322] rounded-lg p-3">
                      <div className="text-xs text-[#56607A]">Competição</div>
                      <div className="text-sm font-medium text-[#F3F5FF] mt-1">
                        {market.competition}
                      </div>
                    </div>
                    <div className="bg-[#0F1322] rounded-lg p-3">
                      <div className="text-xs text-[#56607A]">Saturação</div>
                      <div className="text-sm font-medium text-[#F3F5FF] mt-1">
                        {market.saturation}
                      </div>
                    </div>
                    <div className="bg-[#0F1322] rounded-lg p-3">
                      <div className="text-xs text-[#56607A]">Oportunidade</div>
                      <div className="text-sm font-medium text-[#F3F5FF] mt-1">
                        {market.opportunity}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0F1322] rounded-lg p-4">
                    <div className="text-xs text-[#56607A] mb-2">
                      Recomendações
                    </div>
                    <ul className="space-y-1">
                      {market.recommendations.map((r, i) => (
                        <li
                          key={i}
                          className="text-sm text-[#9CA3C0] flex gap-2"
                        >
                          <span className="text-[#6366F1]">→</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-[#56607A] text-center py-8">
                  Erro ao carregar análise.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#F3F5FF]">
                  Ad Copy
                </h2>
                <button
                  onClick={fetchCopy}
                  disabled={loading}
                  className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors disabled:opacity-50"
                >
                  {loading ? "Gerando..." : "Gerar novamente"}
                </button>
              </div>
              <div>
                <label className={LABEL}>Headline</label>
                <input
                  className={INPUT}
                  value={adCopy.headline}
                  onChange={(e) =>
                    setAdCopy({ ...adCopy, headline: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Texto Principal</label>
                <textarea
                  className={INPUT + " min-h-[100px] resize-y"}
                  value={adCopy.primaryText}
                  onChange={(e) =>
                    setAdCopy({ ...adCopy, primaryText: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Descrição</label>
                <input
                  className={INPUT}
                  value={adCopy.description}
                  onChange={(e) =>
                    setAdCopy({ ...adCopy, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>CTA</label>
                <select
                  className={INPUT}
                  value={adCopy.cta}
                  onChange={(e) =>
                    setAdCopy({ ...adCopy, cta: e.target.value })
                  }
                >
                  {CTA_OPTIONS.map((cta) => (
                    <option key={cta} value={cta}>
                      {cta}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#F3F5FF] mb-4">
                Presell
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Slug</label>
                  <input
                    className={INPUT}
                    placeholder="meu-produto"
                    value={presell.slug}
                    onChange={(e) =>
                      setPresell({
                        ...presell,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                  />
                </div>
                <div>
                  <label className={LABEL}>Título</label>
                  <input
                    className={INPUT}
                    value={presell.title}
                    onChange={(e) =>
                      setPresell({ ...presell, title: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className={LABEL}>Headline da Página</label>
                <input
                  className={INPUT}
                  value={presell.headline}
                  onChange={(e) =>
                    setPresell({ ...presell, headline: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Texto do CTA</label>
                <input
                  className={INPUT}
                  value={presell.ctaText}
                  onChange={(e) =>
                    setPresell({ ...presell, ctaText: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={LABEL}>Cor de Fundo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[#2A3358] cursor-pointer bg-transparent"
                      value={presell.bgColor}
                      onChange={(e) =>
                        setPresell({ ...presell, bgColor: e.target.value })
                      }
                    />
                    <input
                      className={INPUT + " flex-1"}
                      value={presell.bgColor}
                      onChange={(e) =>
                        setPresell({ ...presell, bgColor: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Cor Destaque</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[#2A3358] cursor-pointer bg-transparent"
                      value={presell.accentColor}
                      onChange={(e) =>
                        setPresell({ ...presell, accentColor: e.target.value })
                      }
                    />
                    <input
                      className={INPUT + " flex-1"}
                      value={presell.accentColor}
                      onChange={(e) =>
                        setPresell({ ...presell, accentColor: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Cor do Texto</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[#2A3358] cursor-pointer bg-transparent"
                      value={presell.textColor}
                      onChange={(e) =>
                        setPresell({ ...presell, textColor: e.target.value })
                      }
                    />
                    <input
                      className={INPUT + " flex-1"}
                      value={presell.textColor}
                      onChange={(e) =>
                        setPresell({ ...presell, textColor: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#F3F5FF] mb-4">
                Lançamento
              </h2>
              <div className="bg-[#0F1322] rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#56607A]">Produto</span>
                  <span className="text-[#F3F5FF] font-medium">
                    {product.productName || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#56607A]">País</span>
                  <span className="text-[#F3F5FF] font-medium">
                    {countryObj?.name ?? product.country}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#56607A]">Score</span>
                  <span className="text-[#F3F5FF] font-medium">
                    {market?.score ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#56607A]">Headline</span>
                  <span className="text-[#F3F5FF] font-medium">
                    {adCopy.headline || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#56607A]">CTA</span>
                  <span className="text-[#F3F5FF] font-medium">
                    {adCopy.cta || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#56607A]">Presell</span>
                  <span className="text-[#F3F5FF] font-medium">
                    {presell.slug || "—"}
                  </span>
                </div>
              </div>
              <div>
                <label className={LABEL}>
                  Orçamento Diário (R$)
                </label>
                <input
                  type="number"
                  className={INPUT}
                  min={5}
                  value={launch.budgetDaily}
                  onChange={(e) =>
                    setLaunch({
                      ...launch,
                      budgetDaily: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Split de Dispositivos</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0F1322] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#6366F1]">
                      {launch.deviceSplit.mobile}%
                    </div>
                    <div className="text-xs text-[#56607A]">Mobile</div>
                  </div>
                  <div className="bg-[#0F1322] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#6366F1]">
                      {launch.deviceSplit.desktop}%
                    </div>
                    <div className="text-xs text-[#56607A]">Desktop</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#F3F5FF]">
                Campanha Criada!
              </h2>
              <p className="text-[#56607A] text-sm">
                Sua campanha foi salva como rascunho. Você pode editá-la no
                painel.
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  setMarket(null);
                }}
                className="mt-4 px-6 py-2.5 bg-[#6366F1] hover:bg-[#5558E6] text-white rounded-lg text-sm font-medium transition-colors"
              >
                Criar outra campanha
              </button>
            </div>
          )}
        </div>

        {step <= TOTAL_STEPS && (
          <div className="flex justify-between mt-6">
            <button
              onClick={back}
              disabled={step === 1}
              className="px-5 py-2.5 text-sm font-medium text-[#9CA3C0] hover:text-[#F3F5FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Voltar
            </button>
            <button
              onClick={step === TOTAL_STEPS ? handleLaunch : next}
              disabled={
                loading || (step === 1 && !product.productName)
              }
              className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#5558E6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </span>
              ) : step === TOTAL_STEPS ? (
                "Lançar Campanha"
              ) : (
                "Próximo →"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
