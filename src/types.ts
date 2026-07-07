export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  conditionCode: string; // e.g. 'sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy'
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  detectedSeason: string;
  description: string;
  forecast: ForecastDay[];
  recommendations: Recommendations;
}

export interface ForecastDay {
  day: string;
  temperature: number;
  minTemp: number;
  maxTemp: number;
  condition: string;
  conditionCode: string;
}

export interface Recommendations {
  habillement: string[];
  alimentation: string[];
  activites: string[];
  lieux: string[];
  eviter: string[];
}

export interface SkyAnalysisResult {
  detectedWeather: string;
  conditionCode: string;
  detectedSeason: string;
  temperatureEstimate: number;
  humidityEstimate: number;
  windEstimate: number;
  uvEstimate: number;
  description: string;
  recommendations: Recommendations;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
