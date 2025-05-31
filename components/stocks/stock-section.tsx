"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CompanyOverview {
  Symbol: string;
  Name: string;
  Description: string;
  MarketCapitalization: string;
  PERatio: string;
  DividendYield: string;
  Industry: string;
  Exchange: string;
}

interface RawStockEntry {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

interface StockSectionProps {
  onSearch?: (query: string) => void;
}

export default function StockSection({ onSearch }: StockSectionProps) {
  const [symbol, setSymbol] = useState("AAPL");
  const [input, setInput] = useState("AAPL");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [overview, setOverview] = useState<CompanyOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const fetchData = async () => {
    if (!symbol.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const [timeSeriesRes, overviewRes] = await Promise.all([
        fetch(`/api/stocks/timeseries?symbol=${symbol}`),
        fetch(`/api/stocks/overview?symbol=${symbol}`),
      ]);

      if (!timeSeriesRes.ok || !overviewRes.ok) {
        throw new Error("Failed to fetch stock data.");
      }

      const rawTimeSeries = await timeSeriesRes.json();
      const overviewData = await overviewRes.json();

      // Sort and format the time series data (latest first)
      const formattedData: StockData[] = Object.entries(rawTimeSeries)
        .sort((a, b) => (a[0] < b[0] ? 1 : -1))
        .map(([date, value]) => {
          const v = value as Record<string, string>;
          return {
            date,
            open: parseFloat(v["1. open"]),
            high: parseFloat(v["2. high"]),
            low: parseFloat(v["3. low"]),
            close: parseFloat(v["4. close"]),
            volume: parseInt(v["5. volume"]),
          };
        });

      setStockData(formattedData);
      setOverview(overviewData);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const upper = input.toUpperCase();
    setSymbol(upper);
    onSearch?.(upper);
  };

  const renderChart = () => {
    const chartProps = {
      data: stockData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </>
    );

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps}>
            {commonElements}
            <Area
              type="monotone"
              dataKey="close"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart {...chartProps}>
            {commonElements}
            <Bar dataKey="close" fill="#0ea5e9" />
          </BarChart>
        );
      default:
        return (
          <LineChart {...chartProps}>
            {commonElements}
            <Line type="monotone" dataKey="close" stroke="#0ea5e9" />
          </LineChart>
        );
    }
  };

  const latest = stockData[0];
  const previous = stockData[1];
  const priceChange = latest && previous ? latest.close - previous.close : 0;
  const changePercent = previous
    ? ((priceChange / previous.close) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol..."
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Fetch
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : error ? (
        <Card className="p-6 text-center text-destructive">
          <p>{error}</p>
          <Button onClick={fetchData} className="mt-4">
            Retry
          </Button>
        </Card>
      ) : (
        <AnimatePresence>
          {overview && (
            <motion.div
              key="stock-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {overview.Name} ({overview.Symbol})
                    </h2>
                    <p className="text-muted-foreground">{overview.Exchange}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${latest?.close.toFixed(2)}
                    </div>
                    <div
                      className={`flex items-center ${
                        priceChange >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {priceChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span>{changePercent}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {overview.Description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-sm">Market Cap</p>
                    <p className="text-xl font-bold">
                      ${(+overview.MarketCapitalization / 1e9).toFixed(2)}B
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm">P/E Ratio</p>
                    <p className="text-xl font-bold">{overview.PERatio}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm">Dividend Yield</p>
                    <p className="text-xl font-bold">
                      {overview.DividendYield}%
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm">Industry</p>
                    <p className="text-xl font-bold">{overview.Industry}</p>
                  </Card>
                </div>
              </Card>

              <Card className="p-6">
                <Tabs defaultValue="line" className="mb-4">
                  <TabsList>
                    <TabsTrigger
                      value="line"
                      onClick={() => setChartType("line")}
                    >
                      Line
                    </TabsTrigger>
                    <TabsTrigger
                      value="area"
                      onClick={() => setChartType("area")}
                    >
                      Area
                    </TabsTrigger>
                    <TabsTrigger
                      value="bar"
                      onClick={() => setChartType("bar")}
                    >
                      Bar
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <ResponsiveContainer width="100%" height={400}>
                  {renderChart()}
                </ResponsiveContainer>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
