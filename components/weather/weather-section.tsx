"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Wind, Droplets, Thermometer } from "lucide-react"

interface WeatherData {
  city: {
    name: string
    country: string
  }
  list: Array<{
    dt: number
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    weather: {
      main: string
      description: string
      icon: string
    }
    precipitation: number
  }>
}

interface WeatherSectionProps {
  onSearch: (query: string) => void;
}

export function WeatherSection({ onSearch }: WeatherSectionProps) {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number; lon: number} | null>(null)

  const fetchWeatherData = async (searchParams: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/weather?${searchParams}`)
      if (!response.ok) throw new Error("Failed to fetch weather data")
      
      const data = await response.json()
      setWeatherData(data)
      if (searchParams.includes('city=')) {
        onSearch(city);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lon: longitude })
          fetchWeatherData(`lat=${latitude}&lon=${longitude}`)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setError("Please enable location access or search for a city")
        }
      )
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeatherData(`city=${encodeURIComponent(city.trim())}`)
    }
  }

  const handleUseLocation = () => {
    if (userLocation) {
      fetchWeatherData(`lat=${userLocation.lat}&lon=${userLocation.lon}`)
    }
  }

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <Button
          variant="outline"
          onClick={handleUseLocation}
          disabled={!userLocation}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Use My Location
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[100px]" />
            ))}
          </div>
        </div>
      ) : error ? (
        <Card className="p-6 text-center text-destructive">
          <p>{error}</p>
          <Button onClick={() => fetchWeatherData(`city=${city}`)} className="mt-4">
            Retry
          </Button>
        </Card>
      ) : weatherData ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h2 className="text-3xl font-bold">
                    {weatherData.city.name}, {weatherData.city.country}
                  </h2>
                  <p className="text-muted-foreground">
                    {formatDate(weatherData.list[0].dt)}
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={getWeatherIcon(weatherData.list[0].weather.icon)}
                    alt={weatherData.list[0].weather.description}
                    className="w-16 h-16"
                  />
                  <div className="ml-4 text-right">
                    <div className="text-4xl font-bold">
                      {Math.round(weatherData.list[0].temp)}°C
                    </div>
                    <p className="text-muted-foreground capitalize">
                      {weatherData.list[0].weather.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 flex items-center">
                  <Thermometer className="h-6 w-6 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Feels Like</p>
                    <p className="text-xl font-bold">
                      {Math.round(weatherData.list[0].feels_like)}°C
                    </p>
                  </div>
                </Card>
                <Card className="p-4 flex items-center">
                  <Wind className="h-6 w-6 mr-3 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Wind Speed</p>
                    <p className="text-xl font-bold">
                      {weatherData.list[0].wind_speed} m/s
                    </p>
                  </div>
                </Card>
                <Card className="p-4 flex items-center">
                  <Droplets className="h-6 w-6 mr-3 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="text-xl font-bold">
                      {weatherData.list[0].humidity}%
                    </p>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={weatherData.list}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="dt"
                      tickFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleDateString('en-US', {
                          weekday: 'short',
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      labelFormatter={(timestamp) => formatDate(timestamp)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      name="Temperature (°C)"
                      stroke="hsl(var(--chart-1))"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="precipitation"
                      name="Precipitation (%)"
                      stroke="hsl(var(--chart-2))"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Card>
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  )
}