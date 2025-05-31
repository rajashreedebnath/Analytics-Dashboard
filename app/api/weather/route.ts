import { NextResponse } from 'next/server'
import { API_KEYS, API_ENDPOINTS } from '@/lib/api-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const city = searchParams.get('city')

    if ((!lat || !lon) && !city) {
      return NextResponse.json(
        { error: 'Location parameters are required' },
        { status: 400 }
      )
    }

    
    let weatherUrl = `${API_ENDPOINTS.WEATHER}/forecast?`
    if (city) {
      weatherUrl += `q=${city}`
    } else {
      weatherUrl += `lat=${lat}&lon=${lon}`
    }
    weatherUrl += `&appid=${API_KEYS.WEATHER_API}&units=metric`

    const response = await fetch(weatherUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 1800 },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()

    
    const processedData = {
      city: data.city,
      list: data.list.map((item: any) => ({
        dt: item.dt * 1000,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        weather: item.weather[0],
        precipitation: item.pop * 100,
      })),
    }

    return NextResponse.json(processedData)
  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}