
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
  sunrise: number;
  sunset: number;
  pressure: number;
  visibility: number;
  clouds: number;
  uv_index?: number;
}

export const fetchWeatherData = async (city: string, apiKey: string): Promise<WeatherData> => {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('City not found');
    }
    
    const data = await weatherResponse.json();

    // Fetch additional UV index data if available
    let uvIndex = undefined;
    try {
      const uvResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`
      );
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = uvData.value;
      }
    } catch (error) {
      console.log("UV index not available");
    }
    
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
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      pressure: data.main.pressure,
      visibility: data.visibility,
      clouds: data.clouds.all,
      uv_index: uvIndex,
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};

export const getLocalTime = (dt: number, timezone: number): Date => {
  // OpenWeatherMap returns dt as UTC timestamp in seconds
  // timezone is the offset in seconds from UTC
  
  // Create a UTC date object from the timestamp
  const utcTime = new Date(dt * 1000);
  
  // Calculate local time by converting UTC to the target timezone
  // First get UTC time in milliseconds, then apply the timezone offset
  const localMillis = utcTime.getTime() + (timezone * 1000);
  const localTime = new Date(localMillis);
  
  return localTime;
};

export const getTimeOfDay = (date: Date): 'morning' | 'day' | 'evening' | 'night' => {
  const hours = date.getHours();
  
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

export const formatSunTime = (timestamp: number, timezone: number): string => {
  // For sunrise/sunset times (also UTC timestamps)
  const utcTime = new Date(timestamp * 1000);
  const localMillis = utcTime.getTime() + (timezone * 1000);
  const localSunTime = new Date(localMillis);
  return formatTime(localSunTime);
};

export const getUVIndexDescription = (index?: number): { text: string; color: string } => {
  if (index === undefined) return { text: "Non disponible", color: "text-gray-500" };
  
  if (index <= 2) {
    return { text: "Faible", color: "text-green-500" };
  } else if (index <= 5) {
    return { text: "Modéré", color: "text-yellow-500" };
  } else if (index <= 7) {
    return { text: "Élevé", color: "text-orange-500" };
  } else if (index <= 10) {
    return { text: "Très élevé", color: "text-red-500" };
  } else {
    return { text: "Extrême", color: "text-purple-500" };
  }
};

export const getWindDirection = (degree: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return directions[Math.round(degree / 45) % 8];
};

export const getVisibilityText = (meters: number): string => {
  const km = meters / 1000;
  if (km < 1) {
    return `${meters}m (Mauvaise)`;
  } else if (km < 5) {
    return `${km.toFixed(1)}km (Modérée)`;
  } else if (km < 10) {
    return `${km.toFixed(1)}km (Bonne)`;
  } else {
    return `${km.toFixed(1)}km (Excellente)`;
  }
};
