import { prisma } from "./prisma";

const META_API_VERSION = "v21.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export interface MetaCampaignResult {
  id: string;
  name: string;
  status: string;
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
  return prisma.metaConfig.delete({ where: { userId } });
}

export async function validateMetaToken(accessToken: string): Promise<{ valid: boolean; accountId?: string; error?: string }> {
  try {
    const res = await fetch(`${META_BASE_URL}/me?access_token=${accessToken}`);
    const data = await res.json();
    if (data.error) return { valid: false, error: data.error.message };
    return { valid: true };
  } catch (e) {
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

export async function createMetaCampaign(
  accessToken: string,
  accountId: string,
  campaignName: string,
  dailyBudget: number,
  country: string,
  interests: string[],
  placements: string[],
  adCopy: { headline?: string; primaryText?: string; description?: string; cta?: string },
  creativeUrl?: string
): Promise<MetaCampaignResult> {
  const campaignRes = await fetch(`${META_BASE_URL}/${accountId}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: campaignName,
      objective: "OUTCOMES_TRAFFIC",
      status: "PAUSED",
      special_ad_categories: "[]",
      access_token: accessToken,
    }),
  });
  const campaignData = await campaignRes.json();
  if (campaignData.error) throw new Error(campaignData.error.message);
  const campaignId = campaignData.id;

  const adSetRes = await fetch(`${META_BASE_URL}/${accountId}/adsets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${campaignName} - AdSet`,
      campaign_id: campaignId,
      daily_budget: Math.round(dailyBudget * 100),
      billing_event: "IMPRESSIONS",
      optimization_goal: "LINK_CLICKS",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      targeting: {
        geo_locations: { countries: [country] },
        publisher_platforms: placements.length > 0 ? placements : ["facebook", "instagram"],
        ...(interests.length > 0 ? { interests: interests.map((i) => ({ name: i })) } : {}),
      },
      status: "PAUSED",
      access_token: accessToken,
    }),
  });
  const adSetData = await adSetRes.json();
  if (adSetData.error) throw new Error(adSetData.error.message);

  const creativeRes = await fetch(`${META_BASE_URL}/${accountId}/adcreatives`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${campaignName} - Creative`,
      object_story_spec: {
        page_id: accountId.replace("act_", ""),
        link_data: {
          link: adCopy.cta || "https://example.com",
          message: adCopy.primaryText || "",
          name: adCopy.headline || campaignName,
          description: adCopy.description || "",
          ...(creativeUrl ? { image_url: creativeUrl } : {}),
        },
      },
      access_token: accessToken,
    }),
  });
  const creativeData = await creativeRes.json();
  if (creativeData.error) throw new Error(creativeData.error.message);

  const adRes = await fetch(`${META_BASE_URL}/${accountId}/ads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${campaignName} - Ad`,
      adset_id: adSetData.id,
      creative: { creative_id: creativeData.id },
      status: "PAUSED",
      access_token: accessToken,
    }),
  });
  const adData = await adRes.json();
  if (adData.error) throw new Error(adData.error.message);

  return { id: campaignId, name: campaignName, status: "PAUSED" };
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

export async function getCampaignMetrics(
  accessToken: string,
  campaignId: string,
  dateRange: string = "7d"
) {
  const fields = "impressions,clicks,spend,actions,cost_per_action_type,ctr,cpc,cpm,reach,frequency";

  const res = await fetch(
    `${META_BASE_URL}/${campaignId}?access_token=${accessToken}&fields=${fields}&date_preset=${dateRange === "7d" ? "last_7d" : dateRange === "30d" ? "last_30d" : "last_90d"}`
  );
  const data = await res.json();
  if (data.error) return null;

  const conversions = data.actions?.find((a: { action_type: string; value: string }) => a.action_type === "offsite_conversion")?.value || "0";

  return {
    impressions: parseInt(data.impressions || "0"),
    clicks: parseInt(data.clicks || "0"),
    spend: parseFloat(data.spend || "0"),
    ctr: parseFloat(data.ctr || "0"),
    cpc: parseFloat(data.cpc || "0"),
    cpm: parseFloat(data.cpm || "0"),
    conversions: parseInt(conversions),
    reach: parseInt(data.reach || "0"),
    frequency: parseFloat(data.frequency || "0"),
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
