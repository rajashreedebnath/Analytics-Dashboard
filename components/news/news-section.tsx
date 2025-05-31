"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "./news-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Globe } from "lucide-react"
import { NEWS_CATEGORIES, NEWS_COUNTRIES } from "@/lib/api-config"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    id: string
    name: string
  }
  author?: string
  content?: string
}

interface NewsSource {
  id: string
  name: string
  description: string
  url: string
  category: string
  language: string
  country: string
}

import React from 'react';

interface NewsSectionProps {
  onSearch: (query: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onSearch }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("general")
  const [selectedCountry, setSelectedCountry] = useState<string>("us")
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()

      if (searchQuery) {
        params.append('q', searchQuery)
        onSearch(searchQuery)
      }
      

      if (!searchQuery) {
        params.append('country', selectedCountry)
        if (selectedCategory !== 'general') {
          params.append('category', selectedCategory)
        }
      }
      

      params.append('page', page.toString())
      params.append('pageSize', '20')
      
      const response = await fetch(`/api/news?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch news')
      }
      
      const data = await response.json()
      
      if (!data.articles || data.articles.length === 0) {
        setArticles([])
        setError('No articles found for this search.')
        return
      }
      
      setTotalResults(data.totalResults)
      setArticles(page === 1 ? data.articles : [...articles, ...data.articles])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      console.error('News fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchNews()
  }, [selectedCategory, selectedCountry])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchNews()
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
    fetchNews()
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchNews} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" className="shrink-0">Search</Button>
        </form>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Globe className="h-4 w-4 shrink-0" />
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {NEWS_COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-4 w-4 shrink-0" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                {NEWS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Badge
          variant={selectedCategory === "general" ? "default" : "outline"}
          className="cursor-pointer whitespace-nowrap"
          onClick={() => setSelectedCategory("general")}
        >
          General
        </Badge>
        {NEWS_CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        ))}
      </div>

      {loading && articles.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} {...article} index={index} />
            ))}
          </div>
          {articles.length < totalResults && !loading && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}