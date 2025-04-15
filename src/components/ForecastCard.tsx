
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastDay, formatDay, formatDate } from "@/utils/weatherUtils";
import { translateWeatherDescription } from "@/utils/translationUtils";
import { motion } from "framer-motion";
import { Cloud, Droplets, ArrowDown, ArrowUp } from "lucide-react";

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
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
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mt-4"
    >
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden border-2 border-white/30">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-lg font-bold text-center">
            Prévisions sur 5 jours
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {forecast.map((day, index) => (
              <motion.div
                key={day.dt}
                variants={itemVariants}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  index % 2 === 0 ? "bg-blue-50" : "bg-indigo-50"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col">
                  <span className="font-medium capitalize">{formatDay(day.dt)}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(day.dt)}</span>
                </div>
                
                <div className="flex items-center">
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={translateWeatherDescription(day.weather[0].description)}
                    className="h-10 w-10"
                  />
                  <span className="text-sm capitalize">{translateWeatherDescription(day.weather[0].description)}</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3 text-red-500" />
                    <span className="font-medium">{day.temp.max}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDown className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">{day.temp.min}°C</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-400" />
                    <span className="text-xs">{day.pop}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Cloud className="h-3 w-3 text-gray-400" />
                    <span className="text-xs">{day.humidity}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForecastCard;
