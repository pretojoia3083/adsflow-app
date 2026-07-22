import { prisma } from "@/lib/prisma";

const GOOGLE_ADS_API_VERSION = "v18";
const GOOGLE_ADS_BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_ADS_REDIRECT_URI || "https://adsflow-app-ten.vercel.app/api/google/callback";

interface GoogleConfig {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  customerId: string;
  mccId: string | null;
  developerToken: string;
}

interface GoogleCampaignResult {
  id: string;
  name: string;
  status: string;
  googleCampaignId?: string;
  partial?: boolean;
  adsManagerUrl?: string;
  message?: string;
}

export async function getGoogleConfig(userId: string): Promise<GoogleConfig | null> {
  return prisma.googleConfig.findUnique({ where: { userId } });
}

export async function saveGoogleConfig(
  userId: string,
  accessToken: string,
  refreshToken: string,
  customerId: string,
  developerToken: string,
  mccId?: string
): Promise<GoogleConfig> {
  return prisma.googleConfig.upsert({
    where: { userId },
    update: { accessToken, refreshToken, customerId, developerToken, mccId },
    create: { userId, accessToken, refreshToken, customerId, developerToken, mccId },
  });
}

export async function deleteGoogleConfig(userId: string) {
  return prisma.googleConfig.deleteMany({ where: { userId } });
}

export function getGoogleOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/adwords",
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data.access_token;
}

async function googleAdsFetch(
  config: GoogleConfig,
  endpoint: string,
  body: Record<string, unknown>,
  accessToken?: string
) {
  const token = accessToken || config.accessToken;
  const customerId = config.customerId.replace(/-/g, "");
  const url = `${GOOGLE_ADS_BASE_URL}/customers/${customerId}/${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "developer-token": config.developerToken,
    Authorization: `Bearer ${token}`,
  };
  if (config.mccId) {
    headers["login-customer-id"] = config.mccId.replace(/-/g, "");
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.error) {
    const msg = data.error.message || JSON.stringify(data.error);
    throw new Error(`Google Ads API Error: ${msg}`);
  }
  return data;
}

async function googleAdsGet(
  config: GoogleConfig,
  endpoint: string,
  accessToken?: string
) {
  const token = accessToken || config.accessToken;
  const customerId = config.customerId.replace(/-/g, "");
  const url = `${GOOGLE_ADS_BASE_URL}/customers/${customerId}/${endpoint}`;

  const headers: Record<string, string> = {
    "developer-token": config.developerToken,
    Authorization: `Bearer ${token}`,
  };
  if (config.mccId) {
    headers["login-customer-id"] = config.mccId.replace(/-/g, "");
  }

  const res = await fetch(url, { headers });
  return res.json();
}

export async function validateGoogleToken(config: GoogleConfig): Promise<{ valid: boolean; error?: string }> {
  try {
    const data = await googleAdsGet(config, "googleAds:search", config.accessToken);
    if (data.error) return { valid: false, error: data.error.message };
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function listAccessibleAccounts(config: GoogleConfig) {
  try {
    const query = "SELECT customer_client.id, customer_client.descriptive_name, customer_client.manager, customer_client.test_account FROM customer_client WHERE customer_client.status = 'ENABLED'";
    const data = await googleAdsFetch(config, "googleAds:search", { query });
    return data.results || [];
  } catch {
    return [];
  }
}

function toMicros(brl: number): string {
  const usd = brl / 5;
  return String(Math.round(usd * 1_000_000));
}

const GOOGLE_GEO_MAP: Record<string, number> = {
  BR: 276, US: 284, PT: 620, AO: 012, MZ: 508, CV: 132,
  GB: 826, DE: 276, FR: 250, ES: 724, IT: 380, JP: 392,
  CA: 124, AU: 36, MX: 484, AR: 032, CL: 152, CO: 170,
  PE: 604, IN: 356, CN: 156, RU: 643,
};

export interface CreateGoogleCampaignParams {
  accessToken: string;
  refreshToken: string;
  customerId: string;
  mccId?: string;
  developerToken: string;
  campaignName: string;
  dailyBudget: number;
  country: string;
  keywords: string[];
  adCopy: {
    headline?: string;
    primaryText?: string;
    description?: string;
    cta?: string;
  };
  finalUrl: string;
  status?: string;
}

export async function createGoogleCampaign(params: CreateGoogleCampaignParams): Promise<GoogleCampaignResult> {
  const config: GoogleConfig = {
    id: "",
    userId: "",
    accessToken: params.accessToken,
    refreshToken: params.refreshToken,
    customerId: params.customerId,
    mccId: params.mccId || null,
    developerToken: params.developerToken,
  };

  const customerId = params.customerId.replace(/-/g, "");
  const amountMicros = toMicros(params.dailyBudget);

  // Step 1: Create Budget
  const budgetRes = await googleAdsFetch(config, "campaignBudgets:mutate", {
    operations: [{
      create: {
        name: `${params.campaignName} Budget`,
        deliveryMethod: "STANDARD",
        amountMicros,
      },
    }],
  });

  const budgetResourceName = budgetRes.results?.[0]?.resourceName;
  if (!budgetResourceName) throw new Error("Falha ao criar budget no Google Ads");

  // Step 2: Create Campaign
  const geoTargetId = GOOGLE_GEO_MAP[params.country.toUpperCase()] || 276;
  const campaignRes = await googleAdsFetch(config, "campaigns:mutate", {
    operations: [{
      create: {
        name: params.campaignName,
        campaignBudget: budgetResourceName,
        advertisingChannelType: "SEARCH",
        status: params.status === "ACTIVE" ? "ENABLED" : "PAUSED",
        manualCpc: { enhancedCpcEnabled: false },
        networkSettings: {
          targetGoogleSearch: true,
          targetSearchNetwork: true,
          targetContentNetwork: false,
          targetPartnerSearchNetwork: false,
        },
        geoTargetTypeSetting: {
          positiveGeoTargetType: "PRESENCE_OR_INTEREST",
          negativeGeoTargetType: "PRESENCE_OR_INTEREST",
        },
      },
    }],
  });

  const campaignResourceName = campaignRes.results?.[0]?.resourceName;
  if (!campaignResourceName) throw new Error("Falha ao criar campanha no Google Ads");
  const campaignId = campaignResourceName.split("/").pop();

  // Step 3: Create Ad Group
  const adGroupRes = await googleAdsFetch(config, "adGroups:mutate", {
    operations: [{
      create: {
        campaign: campaignResourceName,
        name: `${params.campaignName} - Ad Group`,
        type: "SEARCH_STANDARD",
        cpcBidMicros: "1000000",
      },
    }],
  });

  const adGroupResourceName = adGroupRes.results?.[0]?.resourceName;
  if (!adGroupResourceName) throw new Error("Falha ao criar ad group no Google Ads");

  // Step 4: Create RSA (Responsive Search Ad)
  const headlines = generateHeadlines(params.adCopy);
  const descriptions = generateDescriptions(params.adCopy);

  const adRes = await googleAdsFetch(config, "adGroupAds:mutate", {
    operations: [{
      create: {
        adGroup: adGroupResourceName,
        status: "ENABLED",
        ad: {
          responsiveSearchAd: {
            headlines: headlines.map((h) => ({ text: h })),
            descriptions: descriptions.map((d) => ({ text: d })),
          },
          finalUrls: [params.finalUrl],
        },
      },
    }],
  });

  if (!adRes.results?.[0]?.resourceName) {
    return {
      id: campaignId || "",
      name: params.campaignName,
      status: "PAUSED",
      partial: true,
      googleCampaignId: campaignId,
      adsManagerUrl: `https://ads.google.com/aw/campaigns/${campaignId}`,
      message: "Campanha e AdGroup criados, mas o anuncio falhou. Finalize no Google Ads Manager.",
    };
  }

  // Step 5: Add Keywords
  if (params.keywords.length > 0) {
    const keywordOps = params.keywords.map((kw) => ({
      create: {
        adGroup: adGroupResourceName,
        keyword: { text: kw, matchType: "BROAD" },
        status: "ENABLED",
      },
    }));

    await googleAdsFetch(config, "adGroupCriteria:mutate", {
      operations: keywordOps.slice(0, 80),
    });
  }

  // Step 6: Add Location Targeting
  await googleAdsFetch(config, "campaignCriteria:mutate", {
    operations: [{
      create: {
        campaign: campaignResourceName,
        location: { geoTargetConstant: `geoTargetConstants/${geoTargetId}` },
        negative: false,
      },
    }],
  });

  return {
    id: campaignId || "",
    name: params.campaignName,
    status: params.status === "ACTIVE" ? "ENABLED" : "PAUSED",
    googleCampaignId: campaignId,
  };
}

function generateHeadlines(adCopy: { headline?: string; primaryText?: string; description?: string; cta?: string }): string[] {
  const headlines: string[] = [];
  if (adCopy.headline) headlines.push(adCopy.headline.substring(0, 30));
  if (adCopy.primaryText) {
    const words = adCopy.primaryText.split(/\s+/);
    const chunk1 = words.slice(0, 5).join(" ").substring(0, 30);
    const chunk2 = words.slice(5, 10).join(" ").substring(0, 30);
    if (chunk1) headlines.push(chunk1);
    if (chunk2) headlines.push(chunk2);
  }
  if (adCopy.cta) headlines.push(adCopy.cta.substring(0, 30));
  if (headlines.length < 3) headlines.push("Oferta Especial", "Confira Agora", "Nao Perca");
  return headlines.slice(0, 15);
}

function generateDescriptions(adCopy: { headline?: string; primaryText?: string; description?: string; cta?: string }): string[] {
  const descriptions: string[] = [];
  if (adCopy.primaryText && adCopy.primaryText.length > 15) descriptions.push(adCopy.primaryText.substring(0, 90));
  if (adCopy.description) descriptions.push(adCopy.description.substring(0, 90));
  if (adCopy.headline) descriptions.push(`${adCopy.headline} — Confira agora mesmo.`);
  if (descriptions.length < 2) descriptions.push("Aproveite esta oferta exclusiva. Clique e saiba mais.");
  return descriptions.slice(0, 4);
}

export async function pauseGoogleCampaign(config: GoogleConfig, campaignId: string): Promise<boolean> {
  try {
    await googleAdsFetch(config, "campaigns:mutate", {
      operations: [{
        update: {
          resourceName: `customers/${config.customerId.replace(/-/g, "")}/campaigns/${campaignId}`,
          status: "PAUSED",
        },
        updateMask: "status",
      }],
    });
    return true;
  } catch {
    return false;
  }
}

export async function resumeGoogleCampaign(config: GoogleConfig, campaignId: string): Promise<boolean> {
  try {
    await googleAdsFetch(config, "campaigns:mutate", {
      operations: [{
        update: {
          resourceName: `customers/${config.customerId.replace(/-/g, "")}/campaigns/${campaignId}`,
          status: "ENABLED",
        },
        updateMask: "status",
      }],
    });
    return true;
  } catch {
    return false;
  }
}

export async function deleteGoogleCampaign(config: GoogleConfig, campaignId: string): Promise<boolean> {
  try {
    await googleAdsFetch(config, "campaigns:mutate", {
      operations: [{
        remove: `customers/${config.customerId.replace(/-/g, "")}/campaigns/${campaignId}`,
      }],
    });
    return true;
  } catch {
    return false;
  }
}

export async function getGoogleCampaignMetrics(config: GoogleConfig, campaignId: string) {
  try {
    const query = `
      SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks,
        metrics.cost_micros, metrics.ctr, metrics.average_cpc, metrics.conversions
      FROM campaign
      WHERE campaign.id = ${campaignId}
        AND segments.date DURING LAST_30_DAYS
    `;
    const data = await googleAdsFetch(config, "googleAds:search", { query });
    return data.results?.[0]?.metrics || null;
  } catch {
    return null;
  }
}
