import { prisma } from "./prisma";

const META_API_VERSION = "v21.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export interface MetaCampaignResult {
  id: string;
  name: string;
  status: string;
  metaCampaignId?: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

export async function getMetaConfig(userId: string) {
  return prisma.metaConfig.findUnique({ where: { userId } });
}

export async function saveMetaConfig(userId: string, accessToken: string, accountId: string) {
  return prisma.metaConfig.upsert({
    where: { userId },
    update: { accessToken, accountId },
    create: { userId, accessToken, accountId },
  });
}

export async function deleteMetaConfig(userId: string) {
  return prisma.metaConfig.deleteMany({ where: { userId } });
}

export async function validateMetaToken(accessToken: string): Promise<{ valid: boolean; accountId?: string; error?: string }> {
  try {
    const res = await fetch(`${META_BASE_URL}/me?access_token=${accessToken}`);
    const data = await res.json();
    if (data.error) return { valid: false, error: data.error.message };
    return { valid: true };
  } catch {
    return { valid: false, error: "Erro ao validar token" };
  }
}

export async function getAdAccounts(accessToken: string) {
  try {
    const res = await fetch(`${META_BASE_URL}/me/adaccounts?access_token=${accessToken}&fields=name,account_id,account_status,currency`);
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getFacebookPages(accessToken: string): Promise<FacebookPage[]> {
  try {
    const res = await fetch(`${META_BASE_URL}/me/accounts?access_token=${accessToken}&fields=id,name,access_token`);
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

const PLACEMENT_MAP: Record<string, { platform: string; position?: string }> = {
  "Feed do Facebook": { platform: "facebook", position: "feed" },
  "Stories do Facebook": { platform: "facebook", position: "story" },
  "Reels do Facebook": { platform: "facebook", position: " reels" },
  "Marketplace do Facebook": { platform: "facebook", position: "marketplace" },
  "Feed do Instagram": { platform: "instagram", position: "stream" },
  "Stories do Instagram": { platform: "instagram", position: "story" },
  "Reels do Instagram": { platform: "instagram", position: "reels" },
  "Explore do Instagram": { platform: "instagram", position: "explore" },
  "Audience Network": { platform: "audience_network" },
  "Messenger": { platform: "messenger" },
  "Facebook": { platform: "facebook" },
  "Instagram": { platform: "instagram" },
};

function mapPlacements(placements: string[]): { platforms: string[]; facebookPositions: string[]; instagramPositions: string[] } {
  const platformSet = new Set<string>();
  const fbPositions: string[] = [];
  const igPositions: string[] = [];

  if (placements.length === 0) {
    return { platforms: ["facebook"], facebookPositions: ["feed"], instagramPositions: [] };
  }

  for (const p of placements) {
    const mapped = PLACEMENT_MAP[p];
    if (mapped) {
      platformSet.add(mapped.platform);
      if (mapped.platform === "facebook" && mapped.position) fbPositions.push(mapped.position);
      if (mapped.platform === "instagram" && mapped.position) igPositions.push(mapped.position);
    } else {
      const lower = p.toLowerCase();
      if (lower.includes("facebook")) platformSet.add("facebook");
      else if (lower.includes("instagram")) platformSet.add("instagram");
      else if (lower.includes("messenger")) platformSet.add("messenger");
      else if (lower.includes("audience")) platformSet.add("audience_network");
    }
  }

  if (platformSet.size === 0) platformSet.add("facebook");

  return {
    platforms: Array.from(platformSet),
    facebookPositions: fbPositions.length > 0 ? fbPositions : ["feed"],
    instagramPositions: igPositions.length > 0 ? igPositions : ["stream"],
  };
}

const CTA_MAP: Record<string, string> = {
  "Saiba Mais": "LEARN_MORE",
  "Compre Agora": "SHOP_NOW",
  "Inscreva-se": "SIGN_UP",
  "Baixar": "DOWNLOAD",
  "Entrar em Contato": "CONTACT_US",
  "Ouça Agora": "LISTEN_NOW",
  "Veja Mais": "LEARN_MORE",
  "Cadastre-se": "SIGN_UP",
  "Solicite": "APPLY_NOW",
  "Junte-se": "JOIN_NOW",
  "Agende": "BOOK_TRAVEL",
  "Comprar": "SHOP_NOW",
  "Instalar": "INSTALL_NOW",
};

function mapCta(cta?: string): string {
  if (!cta) return "LEARN_MORE";
  return CTA_MAP[cta] || "LEARN_MORE";
}

const OBJECTIVE_MAP: Record<string, string> = {
  topo: "OUTCOME_TRAFFIC",
  meio: "OUTCOME_ENGAGEMENT",
  fundo: "OUTCOME_SALES",
};

export interface CreateCampaignParams {
  accessToken: string;
  accountId: string;
  pageId: string;
  campaignName: string;
  dailyBudget: number;
  country: string;
  cities?: string[];
  regions?: string[];
  interests: string[];
  placements: string[];
  adCopy: {
    headline?: string;
    primaryText?: string;
    description?: string;
    cta?: string;
  };
  creativeUrl?: string;
  funnelStage?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

export async function createMetaCampaign(
  params: CreateCampaignParams
): Promise<MetaCampaignResult> {
  const {
    accessToken,
    accountId,
    pageId,
    campaignName,
    dailyBudget,
    country,
    cities,
    regions,
    interests,
    placements,
    adCopy,
    creativeUrl,
    funnelStage,
    startTime,
    endTime,
    status: campaignStatus = "PAUSED",
  } = params;

  const objective = OBJECTIVE_MAP[funnelStage || "topo"] || "OUTCOMES_TRAFFIC";

  const campaignBody: Record<string, unknown> = {
    name: campaignName,
    objective,
    status: campaignStatus,
    special_ad_categories: [],
    access_token: accessToken,
  };

  if (startTime) campaignBody.start_time = startTime;
  if (endTime) campaignBody.end_time = endTime;

  const campaignRes = await fetch(`${META_BASE_URL}/${accountId}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(campaignBody),
  });
  const campaignData = await campaignRes.json();
  if (campaignData.error) throw new Error(`Erro ao criar campanha: ${campaignData.error.message}`);
  const metaCampaignId = campaignData.id;

  const geoLocations: Record<string, unknown> = { countries: [country] };

  const { platforms, facebookPositions, instagramPositions } = mapPlacements(placements);

  const targeting: Record<string, unknown> = {
    geo_locations: geoLocations,
    publisher_platforms: platforms,
  };

  if (platforms.includes("facebook")) {
    targeting.facebook_positions = facebookPositions;
  }
  if (platforms.includes("instagram")) {
    targeting.instagram_positions = instagramPositions;
  }

  if (interests.length > 0) {
    targeting.detailed_targeting = interests.slice(0, 25).map((i) => ({ name: i }));
  }

  const adSetBody: Record<string, unknown> = {
    name: `${campaignName} - AdSet`,
    campaign_id: metaCampaignId,
    daily_budget: Math.max(Math.round(dailyBudget * 100), 100),
    billing_event: "IMPRESSIONS",
    optimization_goal: "LINK_CLICKS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    targeting,
    status: campaignStatus,
    access_token: accessToken,
  };

  if (startTime) adSetBody.start_time = startTime;
  if (endTime) adSetBody.end_time = endTime;

  const adSetRes = await fetch(`${META_BASE_URL}/${accountId}/adsets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adSetBody),
  });
  const adSetData = await adSetRes.json();
  if (adSetData.error) throw new Error(`Erro ao criar AdSet: ${adSetData.error.error_user_msg || adSetData.error.message}`);

  const linkData: Record<string, string> = {
    link: adCopy.cta || "https://example.com",
    message: adCopy.primaryText || campaignName,
    name: adCopy.headline || campaignName,
  };
  if (adCopy.description) linkData.description = adCopy.description;
  if (creativeUrl) linkData.image_url = creativeUrl;

  const creativeRes = await fetch(`${META_BASE_URL}/${accountId}/adcreatives`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${campaignName} - Creative`,
      object_story_spec: {
        page_id: pageId,
        link_data: linkData,
      },
      access_token: accessToken,
    }),
  });
  const creativeData = await creativeRes.json();
  if (creativeData.error) throw new Error(`Erro ao criar Criativo: ${creativeData.error.error_user_msg || creativeData.error.message}`);

  const adRes = await fetch(`${META_BASE_URL}/${accountId}/ads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${campaignName} - Ad`,
      adset_id: adSetData.id,
      creative: { creative_id: creativeData.id },
      status: campaignStatus,
      access_token: accessToken,
    }),
  });
  const adData = await adRes.json();
  if (adData.error) throw new Error(`Erro ao criar Ad: ${adData.error.error_user_msg || adData.error.message}`);

  return { id: metaCampaignId, name: campaignName, status: campaignStatus, metaCampaignId };
}

export async function deleteMetaCampaign(accessToken: string, campaignId: string): Promise<boolean> {
  try {
    const res = await fetch(`${META_BASE_URL}/${campaignId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function pauseMetaCampaign(accessToken: string, campaignId: string): Promise<boolean> {
  try {
    const res = await fetch(`${META_BASE_URL}/${campaignId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAUSED", access_token: accessToken }),
    });
    const data = await res.json();
    return !data.error;
  } catch {
    return false;
  }
}

export async function resumeMetaCampaign(accessToken: string, campaignId: string): Promise<boolean> {
  try {
    const res = await fetch(`${META_BASE_URL}/${campaignId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACTIVE", access_token: accessToken }),
    });
    const data = await res.json();
    return !data.error;
  } catch {
    return false;
  }
}

export async function getCampaignMetrics(
  accessToken: string,
  campaignId: string,
  dateRange: string = "7d"
) {
  const fields = "impressions,clicks,spend,actions,cost_per_action_type,ctr,cpc,cpm,reach,frequency";
  const preset = dateRange === "7d" ? "last_7d" : dateRange === "30d" ? "last_30d" : "last_90d";

  const res = await fetch(
    `${META_BASE_URL}/${campaignId}/insights?access_token=${accessToken}&fields=${fields}&date_preset=${preset}`
  );
  const data = await res.json();
  if (data.error || !data.data || data.data.length === 0) return null;

  const insight = data.data[0];
  const conversions = insight.actions?.find(
    (a: { action_type: string; value: string }) => a.action_type === "offsite_conversion"
  )?.value || "0";

  return {
    impressions: parseInt(insight.impressions || "0"),
    clicks: parseInt(insight.clicks || "0"),
    spend: parseFloat(insight.spend || "0"),
    ctr: parseFloat(insight.ctr || "0"),
    cpc: parseFloat(insight.cpc || "0"),
    cpm: parseFloat(insight.cpm || "0"),
    conversions: parseInt(conversions),
    reach: parseInt(insight.reach || "0"),
    frequency: parseFloat(insight.frequency || "0"),
  };
}

export async function getCampaignInsights(
  accessToken: string,
  accountId: string,
  dateRange: string = "7d"
) {
  const fields = "campaign_name,campaign_id,impressions,clicks,spend,actions,ctr,cpc,cpm";
  const preset = dateRange === "7d" ? "last_7d" : dateRange === "30d" ? "last_30d" : "last_90d";

  const res = await fetch(
    `${META_BASE_URL}/${accountId}/insights?access_token=${accessToken}&fields=${fields}&date_preset=${preset}&level=campaign`
  );
  const data = await res.json();
  return data.data || [];
}
