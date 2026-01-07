export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  phone?: string;
  bio?: string;
  location?: string;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  activities: string[];
  userId: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  sellerId: string;
  imageUrl?: string;
}

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  imageUrl?: string;
  location?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  category: string;
  maxParticipants?: number;
  currentParticipants: string[];
  createdBy: string;
}

export interface Feedback {
  id: string;
  userId: string;
  rating: number;
  category: string;
  message: string;
  createdAt: string;
}
