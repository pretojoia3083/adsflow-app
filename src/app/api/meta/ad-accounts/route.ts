import { NextRequest, NextResponse } from "next/server";

const META_API_VERSION = "v21.0";

export async function POST(req: NextRequest) {
  const { accessToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json({ error: "Token obrigatorio" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/me/adaccounts?access_token=${accessToken}&fields=name,account_id,account_status,currency,amount_spent,balance`
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    const accounts = (data.data || []).map((acc: { name: string; account_id: string; account_status: number; currency: string }) => ({
      id: `act_${acc.account_id}`,
      name: acc.name,
      account_status: acc.account_status,
      currency: acc.currency,
    }));

    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar contas de anuncios" }, { status: 500 });
  }
}
