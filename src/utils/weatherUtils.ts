
export interface WeatherData {
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  dt: number;
  timezone: number;
}

export const fetchWeatherData = async (city: string, apiKey: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('City not found');
    }
    
    const data = await response.json();
    
    return {
      name: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      dt: data.dt,
      timezone: data.timezone,
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};

export const getLocalTime = (dt: number, timezone: number): Date => {
  const utcTime = new Date(dt * 1000);
  const localTime = new Date(utcTime.getTime() + timezone * 1000);
  return localTime;
};

export const getTimeOfDay = (date: Date): 'morning' | 'day' | 'evening' | 'night' => {
  const hours = date.getUTCHours();
  
  if (hours >= 5 && hours < 10) {
    return 'morning';
  } else if (hours >= 10 && hours < 17) {
    return 'day';
  } else if (hours >= 17 && hours < 21) {
    return 'evening';
  } else {
    return 'night';
  }
};

export const getBackgroundClass = (timeOfDay: 'morning' | 'day' | 'evening' | 'night'): string => {
  switch (timeOfDay) {
    case 'morning':
      return 'bg-morning-gradient text-gray-800';
    case 'day':
      return 'bg-day-gradient text-gray-800';
    case 'evening':
      return 'bg-evening-gradient text-gray-800';
    case 'night':
      return 'bg-night-gradient text-white';
    default:
      return 'bg-day-gradient text-gray-800';
  }
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
