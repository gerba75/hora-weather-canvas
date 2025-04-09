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
  alerts?: AlertData[];
}

export interface ForecastData {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  feels_like: {
    day: number;
  };
  humidity: number;
  weather: {
    description: string;
    icon: string;
  }[];
  pop: number; // probabilité de précipitation
  wind_speed: number;
}

export interface AlertData {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
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
    
    // Fetch alerts if available via OneCall API
    let alerts = undefined;
    try {
      const oneCallResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`
      );
      
      if (oneCallResponse.ok) {
        const oneCallData = await oneCallResponse.json();
        if (oneCallData.alerts && oneCallData.alerts.length > 0) {
          alerts = oneCallData.alerts;
        }
      }
    } catch (error) {
      console.log("Alert data not available", error);
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
      alerts: alerts,
    };
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
};

export const fetchForecastData = async (city: string, apiKey: string): Promise<ForecastData[]> => {
  try {
    // D'abord obtenir les coordonnées de la ville
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    
    if (!geoResponse.ok) {
      throw new Error('Geocoding failed');
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      throw new Error('City not found');
    }
    
    const { lat, lon } = geoData[0];
    
    // Utiliser les coordonnées pour obtenir les prévisions sur 5 jours
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${apiKey}`
    );
    
    // Si l'API forecast/daily ne fonctionne pas (car elle est obsolète), essayer avec l'API OneCall
    if (!forecastResponse.ok) {
      const oneCallResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&appid=${apiKey}`
      );
      
      if (!oneCallResponse.ok) {
        throw new Error('Forecast data not available');
      }
      
      const oneCallData = await oneCallResponse.json();
      return oneCallData.daily.slice(1, 6).map((day: any) => ({
        dt: day.dt,
        temp: {
          day: Math.round(day.temp.day),
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max)
        },
        feels_like: {
          day: Math.round(day.feels_like.day)
        },
        humidity: day.humidity,
        weather: [
          {
            description: day.weather[0].description,
            icon: day.weather[0].icon
          }
        ],
        pop: day.pop * 100, // Convertir en pourcentage
        wind_speed: day.wind_speed
      }));
    }
    
    const forecastData = await forecastResponse.json();
    return forecastData.list.slice(1, 6).map((day: any) => ({
      dt: day.dt,
      temp: {
        day: Math.round(day.temp.day),
        min: Math.round(day.temp.min),
        max: Math.round(day.temp.max)
      },
      feels_like: {
        day: Math.round(day.feels_like.day)
      },
      humidity: day.humidity,
      weather: [
        {
          description: day.weather[0].description,
          icon: day.weather[0].icon
        }
      ],
      pop: day.pop * 100, // Convertir en pourcentage
      wind_speed: day.speed
    }));
  } catch (error) {
    console.error("Forecast fetch error:", error);
    throw new Error('Failed to fetch forecast data');
  }
};

export const getLocalTime = (dt: number, timezone: number): Date => {
  // OpenWeatherMap's dt is UTC timestamp in seconds
  // The timezone is the shift in seconds from UTC
  
  // Create a Date object from the UTC time
  const utcDate = new Date(dt * 1000);
  
  // Get current date to calculate correct local time
  const now = new Date();
  const localDate = new Date();
  
  // Set hours based on UTC time + timezone offset (in hours)
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  const utcSeconds = utcDate.getUTCSeconds();
  
  // Apply the timezone offset (convert from seconds to hours)
  const timezoneHours = timezone / 3600;
  
  localDate.setUTCHours(utcHours + timezoneHours);
  localDate.setUTCMinutes(utcMinutes);
  localDate.setUTCSeconds(utcSeconds);
  
  return localDate;
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
  // Create a Date object from the UTC timestamp
  const utcDate = new Date(timestamp * 1000);
  
  // Calculate hours with timezone offset
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  
  // Apply the timezone offset (convert from seconds to hours)
  const timezoneHours = timezone / 3600;
  
  const localDate = new Date();
  localDate.setUTCHours(utcHours + timezoneHours);
  localDate.setUTCMinutes(utcMinutes);
  localDate.setUTCSeconds(0);
  
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

export const formatDay = (timestamp: number, timezone: number): string => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(date);
};

export const getPrecipitationText = (pop: number): string => {
  if (pop < 20) {
    return "Très faible";
  } else if (pop < 40) {
    return "Faible";
  } else if (pop < 60) {
    return "Modérée";
  } else if (pop < 80) {
    return "Élevée";
  } else {
    return "Très élevée";
  }
};

export const getAlertSeverity = (event: string): { color: string; bgColor: string } => {
  const lowEvents = ['Fog', 'Haze', 'Wind'];
  const mediumEvents = ['Rain', 'Snow', 'Thunderstorm', 'Squall', 'Drizzle'];
  const highEvents = ['Hurricane', 'Tornado', 'Flood', 'Tsunami'];

  const eventLower = event.toLowerCase();
  
  if (highEvents.some(e => eventLower.includes(e.toLowerCase()))) {
    return { color: 'text-red-700', bgColor: 'bg-red-100' };
  } else if (mediumEvents.some(e => eventLower.includes(e.toLowerCase()))) {
    return { color: 'text-amber-700', bgColor: 'bg-amber-100' };
  } else if (lowEvents.some(e => eventLower.includes(e.toLowerCase()))) {
    return { color: 'text-blue-700', bgColor: 'bg-blue-100' };
  } else {
    return { color: 'text-gray-700', bgColor: 'bg-gray-100' };
  }
};
