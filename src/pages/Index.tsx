
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  WeatherData, 
  ForecastDay,
  fetchWeatherData, 
  fetchForecastData,
  getLocalTime, 
  getTimeOfDay, 
  getBackgroundClass 
} from "@/utils/weatherUtils";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import ForecastCard from "@/components/ForecastCard";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Cloud, CloudSun, CloudRain, Wind } from "lucide-react";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  
  const API_KEY = "edfa73abee8764ac3a01e3c9dd2ee078";

  useEffect(() => {
    // Try to load last searched city from localStorage
    const lastCity = localStorage.getItem("lastSearchedCity");
    if (lastCity) {
      handleSearch(lastCity);
    }
  }, []);

  const handleSearch = async (city: string) => {
    try {
      setIsLoading(true);
      
      // Fetch current weather
      const data = await fetchWeatherData(city, API_KEY);
      setWeatherData(data);
      
      // Fetch 5-day forecast
      const forecast = await fetchForecastData(city, API_KEY);
      setForecastData(forecast);
      
      const localTime = getLocalTime(data.dt, data.timezone);
      const currentTimeOfDay = getTimeOfDay(localTime);
      setTimeOfDay(currentTimeOfDay);
      
      // Save last searched city
      localStorage.setItem("lastSearchedCity", city);
      
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Background decorations based on time of day
  const renderBackgroundElements = () => {
    switch (timeOfDay) {
      case 'day':
        return Array.from({ length: 5 }).map((_, i) => (
          <motion.div 
            key={`cloud-${i}`}
            className="absolute text-white/20"
            style={{ 
              top: `${10 + Math.random() * 30}%`,
              left: `${Math.random() * 90}%`,
              transform: `scale(${0.5 + Math.random()})`,
              opacity: 0.2 + Math.random() * 0.3
            }}
            animate={{
              x: [0, 10, 0],
              y: [0, 5, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <CloudSun size={30 + Math.random() * 40} />
          </motion.div>
        ));
      case 'night':
        return Array.from({ length: 10 }).map((_, i) => (
          <motion.div 
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{ 
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 90}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ));
      case 'morning':
      case 'evening':
        return Array.from({ length: 6 }).map((_, i) => (
          <motion.div 
            key={`element-${i}`}
            className="absolute text-white/20"
            style={{ 
              top: `${10 + Math.random() * 50}%`,
              left: `${Math.random() * 90}%`,
              transform: `scale(${0.5 + Math.random()})`,
              opacity: 0.1 + Math.random() * 0.2
            }}
            animate={{
              x: [0, 20, 0],
              y: [0, 5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 7,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {i % 2 === 0 ? <CloudRain size={40} /> : <Wind size={30} />}
          </motion.div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${backgroundClass} overflow-hidden`}>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {renderBackgroundElements()}
      </div>
      
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-start min-h-screen relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text"
          >
            Météo en direct
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-muted-foreground mb-8 text-center max-w-md"
          >
            Consultez les prévisions météo détaillées pour n'importe quelle ville dans le monde
          </motion.p>
          
          <motion.div variants={itemVariants} className="w-full flex justify-center">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-10 w-full flex flex-col items-center">
            {isLoading ? (
              <motion.div 
                className="flex flex-col items-center bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-lg">Chargement des données météo...</p>
              </motion.div>
            ) : weatherData ? (
              <>
                <WeatherCard data={weatherData} />
                {forecastData.length > 0 && <ForecastCard forecast={forecastData} />}
              </>
            ) : (
              <motion.div 
                className="text-center p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg max-w-md w-full"
                variants={itemVariants}
              >
                <Cloud className="h-12 w-12 mx-auto mb-4 text-primary/70" />
                <p className="text-xl mb-2">Découvrez la météo dans le monde</p>
                <p className="text-muted-foreground">
                  Entrez le nom d'une ville ci-dessus pour afficher les conditions météorologiques actuelles.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
