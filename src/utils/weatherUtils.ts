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

export interface ForecastDay {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  humidity: number;
  weather: {
    description: string;
    icon: string;
  }[];
  pop: number; // probabilité de précipitation
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

export const fetchForecastData = async (city: string, apiKey: string): Promise<ForecastDay[]> => {
  try {
    // D'abord obtenir les coordonnées de la ville
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    
    if (!geoResponse.ok) {
      throw new Error('City not found');
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.length) {
      throw new Error('City coordinates not found');
    }
    
    const { lat, lon } = geoData[0];
    
    // Ensuite récupérer les prévisions sur 5 jours
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error('Forecast data not available');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Traiter les données pour obtenir une prévision par jour
    // L'API renvoie des prévisions toutes les 3 heures, nous devons les regrouper par jour
    const dailyForecasts: ForecastDay[] = [];
    const forecastsByDay: Record<string, any[]> = {};
    
    forecastData.list.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!forecastsByDay[dayKey]) {
        forecastsByDay[dayKey] = [];
      }
      
      forecastsByDay[dayKey].push(forecast);
    });
    
    // Limiter à 5 jours et calculer les valeurs pour chaque jour
    Object.keys(forecastsByDay).slice(0, 5).forEach(dayKey => {
      const dayForecasts = forecastsByDay[dayKey];
      
      // Trouver la prévision pour le milieu de la journée (vers 12h-15h)
      const middayForecast = dayForecasts.find((f: any) => {
        const hour = new Date(f.dt * 1000).getUTCHours();
        return hour >= 12 && hour <= 15;
      }) || dayForecasts[0];
      
      // Calculer min et max pour la journée
      let minTemp = Number.MAX_VALUE;
      let maxTemp = Number.MIN_VALUE;
      
      dayForecasts.forEach((f: any) => {
        minTemp = Math.min(minTemp, f.main.temp);
        maxTemp = Math.max(maxTemp, f.main.temp);
      });
      
      dailyForecasts.push({
        dt: middayForecast.dt,
        temp: {
          day: Math.round(middayForecast.main.temp),
          min: Math.round(minTemp),
          max: Math.round(maxTemp)
        },
        humidity: middayForecast.main.humidity,
        weather: [{
          description: middayForecast.weather[0].description,
          icon: middayForecast.weather[0].icon
        }],
        pop: Math.round(middayForecast.pop * 100) // Convertir en pourcentage
      });
    });
    
    return dailyForecasts;
  } catch (error) {
    console.error("Forecast fetch error:", error);
    throw new Error('Failed to fetch forecast data');
  }
};

export const getLocalTime = (dt: number, timezone: number): Date => {
  // Create a date object for the current UTC time (OpenWeatherMap dt is in UTC)
  const localTime = new Date(dt * 1000);
  
  // Get the local timezone offset in milliseconds
  const localOffset = localTime.getTimezoneOffset() * 60000;
  
  // Calculate the correct time by applying the location's timezone
  const targetTime = new Date(localTime.getTime() + localOffset + (timezone * 1000));
  
  return targetTime;
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
  // Create a date object for the current UTC time
  const utcTimestamp = timestamp * 1000;
  
  // Calculate the correct time by applying the location's timezone
  const localTimestamp = utcTimestamp + (timezone * 1000);
  
  // Create a date object for the local time
  const localDate = new Date(localTimestamp);
  
  return formatTime(localDate);
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

export const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
};
