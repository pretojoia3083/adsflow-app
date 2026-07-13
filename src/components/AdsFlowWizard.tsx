"use client";

import React, { useState } from "react";
import { Stepper } from "./Stepper";
import { ScoreRing } from "./ScoreRing";
import { Spinner } from "./Spinner";
import {
  FUNNEL_STAGES,
  AFFILIATE_NETWORKS,
  TEMPLATES,
} from "@/types";
import type { Country, AdCopy, CampaignSetup } from "@/types";

export function AdsFlowWizard() {
  const [step, setStep] = useState(1);

  // Step 1
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("medio");
  const [funnelStage, setFunnelStage] = useState("meio");

  // Step 2
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState("");
  const [marketResults, setMarketResults] = useState<{
    countries: Country[];
    summary: string;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Step 3
  const [networkId, setNetworkId] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [affLink, setAffLink] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [domainSlug, setDomainSlug] = useState("");
  const [presellLang, setPresellLang] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templateLabel, setTemplateLabel] = useState("");

  // Step 4
  const [tone, setTone] = useState("confiante");
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [variations, setVariations] = useState<AdCopy[] | null>(null);

  // Step 5
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState("");
  const [campaignData, setCampaignData] = useState<CampaignSetup | null>(null);
  const [activated, setActivated] = useState(false);

  const analyzeMarkets = async () => {
    if (!product.trim()) {
      setMarketError("Descreva o produto antes de analisar.");
      return;
    }
    setMarketError("");
    setMarketLoading(true);
    setMarketResults(null);
    setSelectedCountry(null);

    try {
      const res = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          description,
          audience,
          budget,
          funnelStage,
        }),
      });

      if (!res.ok) throw new Error("Erro na API");
      const data = await res.json();
      setMarketResults(data);
    } catch {
      setMarketError("Nao consegui analisar agora. Tenta de novo em alguns segundos.");
    } finally {
      setMarketLoading(false);
    }
  };

  const pickCountry = (c: Country) => {
    setSelectedCountry(c);
    setPresellLang(c.suggestedLanguage);
    setStep(3);
  };

  const goToAds = () => {
    if (!networkId || !templateId) return;
    setStep(4);
  };

  const generateCopy = async () => {
    setCopyError("");
    setCopyLoading(true);
    setVariations(null);

    try {
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          description,
          audience,
          tone,
          country: selectedCountry?.country,
          countryCode: selectedCountry?.countryCode,
          language: presellLang,
          template: templateLabel,
          funnelStage,
        }),
      });

      if (!res.ok) throw new Error("Erro na API");
      const data = await res.json();
      setVariations(data.variations || []);
    } catch {
      setCopyError("Nao consegui gerar os anuncios agora. Tenta de novo.");
    } finally {
      setCopyLoading(false);
    }
  };

  const goToCampaign = async () => {
    setStep(5);
    setCampaignLoading(true);
    setCampaignError("");
    setCampaignData(null);
    setActivated(false);

    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          description,
          audience,
          country: selectedCountry?.country,
          language: presellLang,
          funnelStage,
          networkName,
        }),
      });

      if (!res.ok) throw new Error("Erro na API");
      const data = await res.json();
      setCampaignData(data);
    } catch {
      setCampaignError("Nao consegui montar a campanha agora. Tenta de novo.");
    } finally {
      setCampaignLoading(false);
    }
  };

  const slug =
    domainSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-") || "seu-produto";

  const inputClass =
    "w-full mt-1.5 bg-[#1A2333] border border-[#232D40] rounded-lg px-3 py-2.5 text-sm text-gray-100 outline-none focus:border-indigo-500 transition-colors";

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 p-7">
      <div className="max-w-[820px] mx-auto">
        <div className="mb-4">
          <div className="text-xs font-bold text-indigo-500 tracking-wider">
            ADSFLOW
          </div>
          <h1 className="text-xl font-extrabold mt-1">
            Produto → Mercado → Presell → Anuncio → Campanha
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Fluxo completo de criacao de campanha.
          </p>
        </div>

        <Stepper step={step} />

        {step === 1 && (
          <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5 flex flex-col gap-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-400">
                Produto *
              </label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Ex: capsulas emagrecedoras naturais"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400">
                Descricao (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Diferenciais, faixa de preco, para quem e indicado..."
                rows={2}
                className={`${inputClass} resize-y`}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-gray-400">
                  Publico-alvo (opcional)
                </label>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Ex: mulheres 30-50 anos"
                  className={inputClass}
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-semibold text-gray-400">
                  Orcamento de midia
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={inputClass}
                >
                  <option value="baixo">Baixo</option>
                  <option value="medio">Medio</option>
                  <option value="alto">Alto</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400">
                Estagio de funil
              </label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {FUNNEL_STAGES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFunnelStage(f.id)}
                    className={`flex-1 min-w-[150px] text-left rounded-[9px] px-3 py-2.5 border transition-colors ${
                      funnelStage === f.id
                        ? "bg-indigo-500/15 border-indigo-500 text-gray-100"
                        : "bg-[#1A2333] border-[#232D40] text-gray-100"
                    }`}
                  >
                    <div className="font-bold text-sm">{f.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {f.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                setStep(2);
                analyzeMarkets();
              }}
              disabled={marketLoading}
              className="bg-indigo-500 border-none text-white font-bold text-sm py-3 rounded-[9px] mt-1 hover:bg-indigo-600 transition-colors disabled:opacity-70"
            >
              Analisar mercados →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => setStep(1)}
                className="bg-transparent border-none text-gray-400 text-sm font-semibold"
              >
                ← Editar produto
              </button>
              {!marketLoading && marketResults && (
                <button
                  onClick={analyzeMarkets}
                  className="bg-transparent border-none text-indigo-500 text-sm font-semibold"
                >
                  Reanalisar
                </button>
              )}
            </div>

            {marketLoading && (
              <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-6">
                <Spinner label="Analisando mercados globais..." />
              </div>
            )}

            {marketError && (
              <div className="text-red-400 text-sm">{marketError}</div>
            )}

            {marketResults && (
              <>
                <div className="bg-indigo-500/15 border border-indigo-500 rounded-[10px] px-4 py-3 text-sm mb-3.5 text-indigo-200">
                  {marketResults.summary}
                </div>
                <div className="text-xs text-gray-400 mb-2 font-semibold">
                  Escolha um pais:
                </div>
                <div className="flex flex-col gap-2.5">
                  {marketResults.countries
                    ?.slice()
                    .sort((a, b) => b.demandScore - a.demandScore)
                    .map((c, i) => {
                      const compColor =
                        c.competitionLevel === "baixa"
                          ? "#22C55E"
                          : c.competitionLevel === "media"
                          ? "#F59E0B"
                          : "#F87171";
                      const compLabel =
                        c.competitionLevel === "baixa"
                          ? "Baixa concorrencia"
                          : c.competitionLevel === "media"
                          ? "Concorrencia media"
                          : "Alta concorrencia";

                      return (
                        <button
                          key={i}
                          onClick={() => pickCountry(c)}
                          className="bg-[#121826] border border-[#232D40] rounded-xl p-4 flex gap-3.5 items-center text-left hover:border-indigo-500 transition-colors"
                        >
                          <ScoreRing score={c.demandScore} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-extrabold">
                                {c.flag} {c.country}
                              </span>
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  color: compColor,
                                  background: `${compColor}22`,
                                }}
                              >
                                {compLabel}
                              </span>
                            </div>
                            <div className="text-[13px] text-gray-400 my-1.5">
                              {c.reasoning}
                            </div>
                            <div className="flex gap-3.5 text-xs text-gray-300">
                              <span>🗣 {c.suggestedLanguage}</span>
                              <span>💵 CPM {c.estimatedCpm}</span>
                            </div>
                          </div>
                          <span className="text-indigo-500 text-lg">→</span>
                        </button>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && selectedCountry && (
          <div>
            <button
              onClick={() => setStep(2)}
              className="bg-transparent border-none text-gray-400 text-sm font-semibold mb-3"
            >
              ← Trocar pais
            </button>

            <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400">
                  Rede de afiliados
                </label>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 mt-1.5">
                  {AFFILIATE_NETWORKS.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        setNetworkId(n.id);
                        setNetworkName(n.name);
                      }}
                      className={`text-left rounded-lg px-2.5 py-2 border transition-colors ${
                        networkId === n.id
                          ? "bg-indigo-500/15 border-indigo-500 text-gray-100"
                          : "bg-[#1A2333] border-[#232D40] text-gray-100"
                      }`}
                    >
                      <div className="font-bold text-[13px]">{n.name}</div>
                      <div className="text-[10px] text-gray-400">{n.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {networkId && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-400">
                      Link de afiliado ({networkName})
                    </label>
                    <input
                      value={affLink}
                      onChange={(e) => setAffLink(e.target.value)}
                      placeholder="Cole aqui o link da oferta original"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-[180px]">
                      <label className="text-xs font-semibold text-gray-400">
                        ID de tracking (opcional)
                      </label>
                      <input
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Ex: adsflow_camp01"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex-1 min-w-[180px]">
                      <label className="text-xs font-semibold text-gray-400">
                        Idioma da presell
                      </label>
                      <input
                        value={presellLang}
                        onChange={(e) => setPresellLang(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400">
                      Dominio da presell
                    </label>
                    <input
                      value={domainSlug}
                      onChange={(e) => setDomainSlug(e.target.value)}
                      placeholder="nome-do-produto"
                      className={inputClass}
                    />
                    <div className="mt-1.5 text-[13px] text-indigo-500 font-mono">
                      {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/p/{slug}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Link da presell hospedada.
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400">
                      Template da presell (estagio &quot;{funnelStage}&quot;)
                    </label>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {(TEMPLATES[funnelStage as keyof typeof TEMPLATES] || []).map(
                        (t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setTemplateId(t.id);
                              setTemplateLabel(t.label);
                            }}
                            className={`flex-1 min-w-[180px] text-left rounded-[9px] px-3 py-2.5 border transition-colors ${
                              templateId === t.id
                                ? "bg-indigo-500/15 border-indigo-500 text-gray-100"
                                : "bg-[#1A2333] border-[#232D40] text-gray-100"
                            }`}
                          >
                            <div className="font-bold text-sm">{t.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {t.desc}
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <button
                    onClick={goToAds}
                    disabled={!templateId}
                    className={`font-bold text-sm py-3 rounded-[9px] transition-colors ${
                      templateId
                        ? "bg-indigo-500 text-white hover:bg-indigo-600"
                        : "bg-[#1A2333] text-gray-400 opacity-60"
                    } border-none`}
                  >
                    Gerar anuncios →
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {step === 4 && selectedCountry && (
          <div>
            <button
              onClick={() => setStep(3)}
              className="bg-transparent border-none text-gray-400 text-sm font-semibold mb-3"
            >
              ← Editar presell
            </button>
            <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5 mb-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-400">
                    Gerando anuncios para
                  </div>
                  <div className="text-lg font-extrabold mt-0.5">
                    {selectedCountry.flag} {selectedCountry.country} ·{" "}
                    {presellLang}
                  </div>
                </div>
                <div className="flex gap-2.5 items-center">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="bg-[#1A2333] border border-[#232D40] rounded-lg px-3 py-2.5 text-sm text-gray-100 outline-none w-[150px]"
                  >
                    <option value="confiante">Confiante</option>
                    <option value="divertido">Divertido</option>
                    <option value="urgente">Urgente</option>
                    <option value="premium">Premium</option>
                    <option value="acolhedor">Acolhedor</option>
                  </select>
                  <button
                    onClick={generateCopy}
                    disabled={copyLoading}
                    className="bg-indigo-500 border-none text-white font-bold text-sm px-4 py-2.5 rounded-[9px] hover:bg-indigo-600 transition-colors disabled:opacity-70 whitespace-nowrap"
                  >
                    {copyLoading
                      ? "Gerando..."
                      : variations
                      ? "Gerar de novo"
                      : "Gerar anuncios"}
                  </button>
                </div>
              </div>
              {copyLoading && (
                <div className="mt-3.5">
                  <Spinner label="Criando 3 variacoes de anuncio..." />
                </div>
              )}
              {copyError && (
                <div className="text-red-400 text-sm mt-2.5">{copyError}</div>
              )}
            </div>

            {variations && (
              <>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5 mb-4">
                  {variations.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-[14px] overflow-hidden border border-[#232D40]"
                      style={{
                        background: v.colors?.background || "#121826",
                        color: v.colors?.text || "#F1F5F9",
                      }}
                    >
                      <div className="px-3.5 py-2 bg-black/15 text-[11px] font-bold uppercase tracking-wider">
                        {v.label}
                      </div>
                      <div className="p-4.5">
                        <div className="text-[17px] font-extrabold mb-2 leading-tight">
                          {v.headline}
                        </div>
                        <div className="text-[13px] leading-relaxed mb-3.5 opacity-90">
                          {v.body}
                        </div>
                        <button
                          className="border-none text-white font-bold text-[13px] px-4 py-2 rounded-lg mb-3"
                          style={{ background: v.colors?.accent || "#6366F1" }}
                        >
                          {v.cta}
                        </button>
                        <div className="text-xs opacity-70 border-t border-white/15 pt-2">
                          🎨 {v.imageStyle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={goToCampaign}
                  className="bg-indigo-500 border-none text-white font-bold text-sm py-3 rounded-[9px] w-full hover:bg-indigo-600 transition-colors"
                >
                  Montar campanha →
                </button>
              </>
            )}
          </div>
        )}

        {step === 5 && selectedCountry && (
          <div>
            <button
              onClick={() => setStep(4)}
              className="bg-transparent border-none text-gray-400 text-sm font-semibold mb-3"
            >
              ← Editar anuncios
            </button>

            {campaignLoading && (
              <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-6">
                <Spinner label="Montando segmentacao da campanha..." />
              </div>
            )}
            {campaignError && (
              <div className="text-red-400 text-sm">{campaignError}</div>
            )}

            {campaignData && (
              <div className="flex flex-col gap-3.5">
                <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5">
                  <div className="text-xs font-bold text-indigo-500 mb-2.5">
                    RESUMO DA CAMPANHA
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 text-sm">
                    <div>
                      <div className="text-xs font-semibold text-gray-400">
                        Produto
                      </div>
                      <div className="font-bold">{product}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400">
                        Pais
                      </div>
                      <div className="font-bold">
                        {selectedCountry.flag} {selectedCountry.country}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400">
                        Funil
                      </div>
                      <div className="font-bold capitalize">{funnelStage}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400">
                        Rede
                      </div>
                      <div className="font-bold">{networkName}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400">
                        Presell
                      </div>
                      <div className="font-bold font-mono text-xs">
                        /p/{slug}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400">
                        Template
                      </div>
                      <div className="font-bold">{templateLabel}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5">
                  <div className="text-xs font-bold text-indigo-500 mb-2.5">
                    VERBA SUGERIDA / DIA
                  </div>
                  <div className="text-3xl font-extrabold">
                    $
                    {Math.round(
                      parseFloat(selectedCountry.estimatedCpm.replace(/[^0-9.]/g, "").split("-")[0] || "5") *
                        8 *
                        (funnelStage === "topo" ? 1.4 : funnelStage === "fundo" ? 0.7 : 1)
                    )}
                    <span className="text-sm text-gray-400 font-semibold">
                      {" "}
                      /dia
                    </span>
                  </div>
                </div>

                <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5">
                  <div className="text-xs font-bold text-indigo-500 mb-2.5">
                    SEGMENTACAO POR DISPOSITIVO
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden mb-2.5">
                    <div
                      className="bg-indigo-500"
                      style={{
                        width: `${
                          funnelStage === "topo"
                            ? 75
                            : funnelStage === "fundo"
                            ? 55
                            : 68
                        }%`,
                      }}
                    />
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${
                          funnelStage === "topo"
                            ? 15
                            : funnelStage === "fundo"
                            ? 35
                            : 22
                        }%`,
                      }}
                    />
                    <div className="bg-amber-500 w-[10%]" />
                  </div>
                  <div className="flex gap-4 text-[13px]">
                    <span>
                      📱 Mobile{" "}
                      {funnelStage === "topo"
                        ? 75
                        : funnelStage === "fundo"
                        ? 55
                        : 68}
                      %
                    </span>
                    <span>
                      🖥 Desktop{" "}
                      {funnelStage === "topo"
                        ? 15
                        : funnelStage === "fundo"
                        ? 35
                        : 22}
                      %
                    </span>
                    <span>📱 Tablet 10%</span>
                  </div>
                </div>

                <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5">
                  <div className="text-xs font-bold text-indigo-500 mb-2.5">
                    PALAVRAS-CHAVE E INTERESSES
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {campaignData.keywords?.map((k, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#1A2333] border border-[#232D40] rounded-full px-2.5 py-1"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-gray-400">
                    Interesses (Meta Ads Manager)
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {campaignData.interests?.map((k, i) => (
                      <span
                        key={i}
                        className="text-xs bg-indigo-500/15 border border-indigo-500 rounded-full px-2.5 py-1"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5">
                  <div className="text-xs font-bold text-indigo-500 mb-2.5">
                    POSICIONAMENTOS RECOMENDADOS
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {campaignData.placements?.map((p, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#1A2333] border border-[#232D40] rounded-full px-2.5 py-1"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5 text-center">
                  {!activated ? (
                    <>
                      <button
                        onClick={() => setActivated(true)}
                        className="bg-green-500 border-none text-white font-extrabold text-base px-7 py-3.5 rounded-[10px] hover:bg-green-600 transition-colors"
                      >
                        Ativar campanha
                      </button>
                      <div className="text-xs text-gray-400 mt-2.5">
                        Para publicar de verdade, conecte sua conta Meta Ads.
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="text-3xl">✅</div>
                      <div className="font-extrabold text-base mt-1.5">
                        Campanha pronta!
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Material pronto para ser publicado no Meta Ads.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
