const META_API_VERSION = "v19.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

interface MetaCampaignParams {
  name: string;
  objective: string;
  status: string;
  specialAdCategories: string[];
}

interface MetaAdSetParams {
  name: string;
  campaign_id: string;
  daily_budget: string;
  billing_event: string;
  optimization_goal: string;
  targeting: object;
  status: string;
}

interface MetaAdParams {
  name: string;
  adset_id: string;
  creative: object;
  status: string;
}

function getAccessToken() {
  return process.env.META_ACCESS_TOKEN;
}

function getAdAccountId() {
  return process.env.META_AD_ACCOUNT_ID;
}

export async function createCampaign(params: MetaCampaignParams) {
  const token = getAccessToken();
  const accountId = getAdAccountId();

  const response = await fetch(
    `${META_BASE_URL}/act_${accountId}/campaigns`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        access_token: token,
      }),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export async function createAdSet(params: MetaAdSetParams) {
  const token = getAccessToken();
  const accountId = getAdAccountId();

  const response = await fetch(
    `${META_BASE_URL}/act_${accountId}/adsets`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        access_token: token,
      }),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export async function createAdCreative(params: {
  name: string;
  object_story_spec: object;
}) {
  const token = getAccessToken();
  const accountId = getAdAccountId();

  const response = await fetch(
    `${META_BASE_URL}/act_${accountId}/adcreatives`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        access_token: token,
      }),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export async function createAd(params: MetaAdParams) {
  const token = getAccessToken();
  const accountId = getAdAccountId();

  const response = await fetch(
    `${META_BASE_URL}/act_${accountId}/ads`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        access_token: token,
      }),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export async function getCampaignInsights(campaignId: string) {
  const token = getAccessToken();

  const response = await fetch(
    `${META_BASE_URL}/${campaignId}/insights?access_token=${token}&fields=impressions,clicks,spend,actions,cost_per_action_type`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.data?.[0] || null;
}

export async function publishCampaign(campaignData: {
  name: string;
  objective: string;
  dailyBudget: string;
  targeting: object;
  headline: string;
  body: string;
  cta: string;
  linkUrl: string;
  imageUrl?: string;
}) {
  try {
    const campaign = await createCampaign({
      name: campaignData.name,
      objective: campaignData.objective,
      status: "PAUSED",
      specialAdCategories: [],
    });

    const adSet = await createAdSet({
      name: `${campaignData.name} - AdSet`,
      campaign_id: campaign.campaign_id,
      daily_budget: campaignData.dailyBudget,
      billing_event: "IMPRESSIONS",
      optimization_goal: "LINK_CLICKS",
      targeting: campaignData.targeting,
      status: "PAUSED",
    });

    const creative = await createAdCreative({
      name: `${campaignData.name} - Creative`,
      object_story_spec: {
        page_id: process.env.META_PAGE_ID,
        link_data: {
          link: campaignData.linkUrl,
          message: campaignData.body,
          name: campaignData.headline,
          call_to_action: {
            type: "LEARN_MORE",
            value: { link: campaignData.linkUrl },
          },
        },
      },
    });

    const ad = await createAd({
      name: campaignData.name,
      adset_id: adSet.adset_id,
      creative: { creative_id: creative.creative_id },
      status: "PAUSED",
    });

    return {
      campaignId: campaign.campaign_id,
      adSetId: adSet.adset_id,
      adId: ad.ad_id,
      creativeId: creative.creative_id,
    };
  } catch (error) {
    console.error("Error publishing campaign:", error);
    throw error;
  }
}
