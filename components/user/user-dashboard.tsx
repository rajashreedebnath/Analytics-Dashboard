"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Cloud,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
} from "lucide-react";

interface StockData {
  symbol: string;
  price: number;
  change: number;
}

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
}

export function UserDashboard() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    
    const fetchStockData = async () => {
      try {
        const stockSymbols = ["AAPL", "GOOGL", "MSFT"];
        const stockPromises = stockSymbols.map(async (symbol) => {
          const response = await fetch(
            `/api/stocks/timeseries?symbol=${symbol}`
          );
          const data = await response.json();
          if (data && data.length > 1) {
            const latestPrice = data[0].close;
            const previousPrice = data[1].close;
            const change =
              ((latestPrice - previousPrice) / previousPrice) * 100;
            return { symbol, price: latestPrice, change };
          } else {
            return { symbol, price: 0, change: 0 };
          }
        });

        const results = await Promise.all(stockPromises);
        setStockData(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to load stock data");
        setLoading(false);
      }
    };

    fetchStockData();

    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const data = await response.json();
          if (data && data.list && data.list[0]) {
            setWeatherData({
              city: data.city.name,
              temp: data.list[0].temp,
              condition: data.list[0].weather.main,
            });
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      });
    }

    
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news?country=us");
        const data = await response.json();
        if (data.articles) {
          setNewsArticles(data.articles.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Weather */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Weather
            </h3>
          </div>
          {weatherData ? (
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-2">{weatherData.city}</h4>
              <p className="text-3xl font-bold mb-2">
                {Math.round(weatherData.temp)}°C
              </p>
              <p className="text-muted-foreground">{weatherData.condition}</p>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Loading weather data...
            </p>
          )}
        </Card>

        {/* Stock */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Stocks
            </h3>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p>Loading data...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              stockData.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium">{stock.symbol}</span>
                  <div className="flex items-center gap-2">
                    <span>${stock.price.toFixed(2)}</span>
                    <span
                      className={`flex items-center ${
                        stock.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(stock.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* News */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              News
            </h3>
          </div>
          <div className="space-y-4">
            {newsArticles.length > 0 ? (
              newsArticles.map((article, idx) => (
                <div key={idx} className="border-b pb-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {article.title}
                  </a>
                  <p className="text-sm text-muted-foreground">
                    {article.source.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Loading news...</p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
