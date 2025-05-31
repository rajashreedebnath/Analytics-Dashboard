# Analytics Dashboard

## Description
A powerful and highly interactive analytics dashboard that fetches data from multiple APIs and displays it in a user-friendly, responsive layout. The application integrates several data sources including weather, news, and finance, and provides real-time data updates, advanced animations, and state-of-the-art features.
---

## Features 🚀

### Weather API Integration
- **Geolocation**: Automatically fetchs weather data based on the user's current location.
- **Weather Visualizations**: Interactive charts displaying temperature trends, humidity, wind speed, and more.
- **Search with Autocomplete**: Users can search cities with autocomplete suggestions using GeoDB Cities API.

### News API Integration
- **Infinite Scroll**: Pagination of news articles.
- **News Filter**: Filter news by category.
- **Detail View**: Full news articles with external links.

### Finance API Integration
- **Stock Charts**: Interactive charts using Chart.js or Victory for stock prices, candlesticks, and historical data analysis.
- **Search with Autocomplete**: Search stocks by symbol.


## Technologies Used 🛠️

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts, Chart.js
- **Icons**: Lucide React
  

### APIs
- **Weather**: OpenWeatherMap API
- **News**: NewsAPI
- **Finance**: Alpha Vantage API

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **CSS Processing**: PostCSS

---

## API Details 📡

### Weather API
- **Endpoint**: `https://api.openweathermap.org/data/2.5/forecast`

### News API
- **Endpoint**: `https://newsapi.org/v2/top-headlines`

### Finance API
- **Endpoint**: `https://www.alphavantage.co/query`

