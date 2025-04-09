
import React from 'react';
import { ForecastData, formatDay, formatDate, getPrecipitationText } from '@/utils/weatherUtils';
import { Cloud, CloudDrizzle, CloudSun, Droplets, Thermometer, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';

interface ForecastListProps {
  forecastData: ForecastData[];
  timezone: number;
}

const ForecastList = ({ forecastData, timezone }: ForecastListProps) => {
  if (!forecastData || forecastData.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-semibold mb-4">Prévisions sur 5 jours</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {forecastData.map((day, index) => (
          <motion.div
            key={day.dt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 overflow-hidden">
              <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 border-b">
                <h3 className="font-medium capitalize">
                  {formatDay(day.dt, timezone)}
                </h3>
                <p className="text-sm text-muted-foreground">{formatDate(day.dt)}</p>
              </div>
              
              <div className="p-4">
                <div className="flex justify-center mb-2">
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
                    alt={day.weather[0].description}
                    className="w-16 h-16"
                  />
                </div>
                
                <p className="text-center capitalize mb-3">{day.weather[0].description}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Thermometer size={16} className="mr-1 text-red-500" />
                    <span className="text-sm">Max:</span>
                  </div>
                  <span className="font-medium">{day.temp.max}°C</span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Thermometer size={16} className="mr-1 text-blue-500" />
                    <span className="text-sm">Min:</span>
                  </div>
                  <span className="font-medium">{day.temp.min}°C</span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Wind size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm">Vent:</span>
                  </div>
                  <span>{day.wind_speed} m/s</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Droplets size={16} className="mr-1 text-blue-500" />
                    <span className="text-sm">Précip:</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">{day.pop.toFixed(0)}%</span>
                    <span className="text-xs text-muted-foreground">({getPrecipitationText(day.pop)})</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;
