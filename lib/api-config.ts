export const API_KEYS = {
  NEWS_API: '24d3f88936ef470abbc0ae1307fa7c50',
  ALPHA_VANTAGE: 'I3ULVGIELB22ALB6',
  WEATHER_API: '23fd988f3145db0037c225795fe0af27',
};

export const API_ENDPOINTS = {
  NEWS_HEADLINES: 'https://newsapi.org/v2/top-headlines',
  NEWS_SOURCES: 'https://newsapi.org/v2/top-headlines/sources',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  WEATHER: 'https://api.openweathermap.org/data/2.5',
};

export const NEWS_CATEGORIES = [
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
] as const;

export const NEWS_COUNTRIES = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
] as const;

export const NEWS_API_PARAMS = {
  SORT_BY: ['publishedAt', 'relevancy', 'popularity'] as const,
  LANGUAGES: ['en', 'es', 'fr', 'de'] as const,
  PAGE_SIZE: 20,
};
