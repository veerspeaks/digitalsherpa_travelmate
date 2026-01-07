import { WeatherData, ForecastDay } from '@types';
import { WEATHER_API_KEY, WEATHER_API_URL } from '@utils/constants';

const mockWeatherData: WeatherData = {
  location: 'Paris, France',
  temperature: 22,
  condition: 'Sunny',
  description: 'Clear sky with light breeze',
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { date: '2024-01-15', high: 24, low: 18, condition: 'Sunny' },
    { date: '2024-01-16', high: 23, low: 17, condition: 'Partly Cloudy' },
    { date: '2024-01-17', high: 21, low: 16, condition: 'Cloudy' },
    { date: '2024-01-18', high: 20, low: 15, condition: 'Rainy' },
    { date: '2024-01-19', high: 22, low: 17, condition: 'Sunny' },
  ],
};

export const weatherService = {
  async getWeather(location: string): Promise<WeatherData | null> {
    try {
      if (!WEATHER_API_KEY) {
        console.warn('Weather API Key is missing, using mock data');
        return { ...mockWeatherData, location };
      }

      const response = await fetch(
        `${WEATHER_API_URL}/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Weather API Error:', errorData);
        console.warn('Weather API failed, using mock data');
        return { ...mockWeatherData, location };
      }

      const data = await response.json();
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        forecast: await this.getForecast(location),
      };

    } catch (error) {
      console.error('Error fetching weather:', error);
      return { ...mockWeatherData, location };
    }
  },

  async getForecast(location: string): Promise<ForecastDay[]> {
    try {
      if (!WEATHER_API_KEY) {
        return mockWeatherData.forecast;
      }

      const response = await fetch(
        `${WEATHER_API_URL}/forecast?q=${location}&appid=${WEATHER_API_KEY}&units=metric`,
      );

      if (!response.ok) {
        return mockWeatherData.forecast;
      }

      const data = await response.json();

      const dailyData = data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));

      return dailyData.slice(0, 5).map((item: any) => ({
        date: item.dt_txt.split(' ')[0],
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].main,
      }));

    } catch (error) {
      console.error('Error fetching forecast:', error);
      return mockWeatherData.forecast;
    }
  },
};
