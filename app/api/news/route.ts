import { NextResponse } from 'next/server'
import { API_KEYS, API_ENDPOINTS } from '@/lib/api-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const apiUrl = API_ENDPOINTS.NEWS_HEADLINES

    const params = new URLSearchParams(searchParams)

    
    params.set('country', 'us')

    
    params.set('apiKey', API_KEYS.NEWS_API)

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 400 },
    })

    const data = await response.json()

    if (data.status === 'error') {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch news' },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('News API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
