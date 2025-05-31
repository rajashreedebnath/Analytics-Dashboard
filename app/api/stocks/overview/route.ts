import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await res.json();

    if (!data.Symbol) {
      return NextResponse.json({ error: "Invalid symbol or no data" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
