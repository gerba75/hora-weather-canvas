
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WeatherData, formatTime, getLocalTime } from "@/utils/weatherUtils";
import { Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const localTime = getLocalTime(data.dt, data.timezone);

  return (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in">
      <CardHeader className="flex flex-col items-center pb-2">
        <div className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/w40/${data.country.toLowerCase()}.png`}
            alt={`${data.country} flag`}
            className="h-6 rounded-sm"
          />
          <CardTitle className="text-xl font-bold">
            {data.name}, {data.country}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          {localTime.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-sm text-muted-foreground">{formatTime(localTime)}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              alt={data.description}
              className="h-16 w-16"
            />
            <span className="text-4xl font-bold">{data.temp}°C</span>
          </div>
          <p className="text-muted-foreground capitalize">
            {data.description}
          </p>
          <p className="text-sm">
            Ressenti: <span className="font-medium">{data.feels_like}°C</span>
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Température</p>
              <p className="font-medium">{data.temp}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidité</p>
              <p className="font-medium">{data.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <Wind className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Vitesse du vent</p>
              <p className="font-medium">{data.wind_speed} m/s</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
