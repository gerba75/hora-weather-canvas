import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  WeatherData, 
  formatTime, 
  getLocalTime, 
  formatSunTime,
  getUVIndexDescription,
  getVisibilityText
} from "@/utils/weatherUtils";
import { 
  Wind, 
  Droplets, 
  Thermometer, 
  Sunrise, 
  Sunset, 
  Eye, 
  Gauge, 
  CloudSun, 
  Cloud,
  Sun,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const localTime = getLocalTime(data.dt, data.timezone);
  const [activeTab, setActiveTab] = useState<'main' | 'details'>('main');
  const [animateIcon, setAnimateIcon] = useState<boolean>(false);

  useEffect(() => {
    // Animate weather icon on load and every minute
    setAnimateIcon(true);
    const timer = setTimeout(() => setAnimateIcon(false), 2000);
    
    const interval = setInterval(() => {
      setAnimateIcon(true);
      setTimeout(() => setAnimateIcon(false), 2000);
    }, 60000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [data.icon]);

  const uvInfo = getUVIndexDescription(data.uv_index);

  const getWeatherIcon = () => {
    const iconCode = data.icon.substring(0, 2);
    let IconComponent = CloudSun;
    
    switch(iconCode) {
      case '01': // clear
        IconComponent = Sun;
        break;
      case '02': // few clouds
      case '03': // scattered clouds
      case '04': // broken clouds
        IconComponent = Cloud;
        break;
      default:
        IconComponent = CloudSun;
    }
    
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={animateIcon ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 1 }}
        className="inline-block"
      >
        <IconComponent size={28} className="text-primary" />
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden border-2 border-white/30">
        <CardHeader className="flex flex-col items-center pb-2 relative bg-gradient-to-r from-blue-50 to-indigo-50">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-2 right-3 flex items-center gap-1"
          >
            {getWeatherIcon()}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2 mb-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={`https://flagcdn.com/w40/${data.country.toLowerCase()}.png`}
              alt={`${data.country} flag`}
              className="h-6 rounded-sm shadow-sm"
            />
            <CardTitle className="text-xl font-bold">
              {data.name}, {data.country}
            </CardTitle>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {localTime.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.p>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 relative">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('main')}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'main'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Principal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('details')}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Détails
              </motion.button>
            </div>
          </div>

          {activeTab === 'main' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div 
                className="flex flex-col items-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center relative">
                  <motion.img
                    src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                    alt={data.description}
                    className="h-20 w-20 object-contain"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  />
                  <motion.span 
                    className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {data.temp}°C
                  </motion.span>
                </div>
                <motion.p 
                  className="text-muted-foreground capitalize text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {data.description}
                </motion.p>
                <motion.p 
                  className="text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Ressenti: <span className="font-medium">{data.feels_like}°C</span>
                </motion.p>
              </motion.div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Sunrise className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Lever du soleil</p>
                    <p className="font-medium">{formatSunTime(data.sunrise, data.timezone)}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-2 bg-indigo-50 p-3 rounded-xl"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Sunset className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Coucher du soleil</p>
                    <p className="font-medium">{formatSunTime(data.sunset, data.timezone)}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-2 bg-green-50 p-3 rounded-xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidité</p>
                    <p className="font-medium">{data.humidity}%</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Wind className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vent</p>
                    <p className="font-medium">{data.wind_speed} m/s</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              <motion.div 
                className="col-span-2 flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-xl"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Indice UV</p>
                  <p className={`font-medium ${uvInfo.color}`}>
                    {data.uv_index !== undefined ? data.uv_index : "N/A"} - {uvInfo.text}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <Gauge className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Pression</p>
                  <p className="font-medium">{data.pressure} hPa</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-green-50 p-3 rounded-xl"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.03 }}
              >
                <Eye className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Visibilité</p>
                  <p className="font-medium">{getVisibilityText(data.visibility)}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-indigo-50 p-3 rounded-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
              >
                <Cloud className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Nuages</p>
                  <p className="font-medium">{data.clouds}%</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2 bg-orange-50 p-3 rounded-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <Thermometer className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Ressenti</p>
                  <p className="font-medium">{data.feels_like}°C</p>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          <motion.div 
            className="flex justify-center mt-3 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs text-muted-foreground italic">
              Dernière mise à jour: {formatTime(localTime)}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherCard;
