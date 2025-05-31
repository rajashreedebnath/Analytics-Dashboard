"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface NewsCardProps {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    name: string
  }
  index: number
}

export function NewsCard({
  title,
  description,
  url,
  urlToImage,
  publishedAt,
  source,
  index,
}: NewsCardProps) {
  const date = new Date(publishedAt)
  const formattedDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={urlToImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800'}
            alt={title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm">
            {source.name}
          </Badge>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-primary">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
            {description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formattedTime}
              </span>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors shrink-0"
            >
              Read more
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}