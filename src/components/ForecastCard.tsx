
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastDay, formatDay, formatDate } from "@/utils/weatherUtils";
import { translateWeatherDescription } from "@/utils/translationUtils";
import { motion } from "framer-motion";
import { Cloud, Droplets, ArrowDown, ArrowUp } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mt-4"
    >
      <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden border-2 border-white/30">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-lg font-bold text-center">
            Prévisions sur 5 jours
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="p-1">
              {forecast.map((day) => (
                <CarouselItem key={day.dt} className="basis-1/3 sm:basis-1/5">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-xl bg-blue-50/50 h-full flex flex-col items-center gap-2"
                  >
                    <div className="text-center">
                      <div className="font-medium capitalize">{formatDay(day.dt)}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(day.dt)}</div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      <img 
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt={translateWeatherDescription(day.weather[0].description)}
                        className="h-16 w-16 object-contain"
                        loading="lazy"
                      />
                      <span className="text-sm text-center capitalize">
                        {translateWeatherDescription(day.weather[0].description)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <ArrowUp className="h-3 w-3 text-red-500" />
                        <span className="font-medium">{day.temp.max}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowDown className="h-3 w-3 text-blue-500" />
                        <span className="font-medium">{day.temp.min}°C</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForecastCard;
