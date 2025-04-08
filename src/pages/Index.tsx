
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { WeatherData, fetchWeatherData, getLocalTime, getTimeOfDay, getBackgroundClass } from "@/utils/weatherUtils";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  
  const API_KEY = "edfa73abee8764ac3a01e3c9dd2ee078";

  const handleSearch = async (city: string) => {
    try {
      setIsLoading(true);
      const data = await fetchWeatherData(city, API_KEY);
      setWeatherData(data);
      
      const localTime = getLocalTime(data.dt, data.timezone);
      const currentTimeOfDay = getTimeOfDay(localTime);
      setTimeOfDay(currentTimeOfDay);
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Ville non trouvée. Veuillez vérifier l'orthographe.",
        variant: "destructive",
      });
    }
  };

  const backgroundClass = getBackgroundClass(timeOfDay);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${backgroundClass}`}>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-start min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Météo en direct</h1>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        <div className="mt-10 w-full flex justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-2">Chargement des données météo...</p>
            </div>
          ) : weatherData ? (
            <WeatherCard data={weatherData} />
          ) : (
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg">
              <p className="text-xl">Entrez le nom d'une ville pour voir la météo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
