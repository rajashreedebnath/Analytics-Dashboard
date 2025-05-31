import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await res.json();

    console.log("🔍 Alpha Vantage response:", data);

    if (data["Note"]) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (data["Error Message"]) {
      return NextResponse.json({ error: "Invalid symbol or request" }, { status: 400 });
    }

    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
      return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    }

    const formatted = Object.entries(timeSeries).map(([date, value]: any) => ({
      date,
      open: +value["1. open"],
      high: +value["2. high"],
      low: +value["3. low"],
      close: +value["4. close"],
      volume: +value["5. volume"],
    }));

    return NextResponse.json(formatted.slice(0, 30));
  } catch (err: any) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
