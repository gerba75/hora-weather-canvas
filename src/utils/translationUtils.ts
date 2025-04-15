
type WeatherTranslations = {
  [key: string]: string;
};

export const weatherTranslations: WeatherTranslations = {
  "clear sky": "ciel dégagé",
  "few clouds": "quelques nuages",
  "scattered clouds": "nuages épars",
  "broken clouds": "nuageux",
  "shower rain": "averses",
  "rain": "pluie",
  "thunderstorm": "orage",
  "snow": "neige",
  "mist": "brume",
  "overcast clouds": "très nuageux",
  "light rain": "pluie légère",
  "moderate rain": "pluie modérée",
  "heavy intensity rain": "fortes pluies",
  "light snow": "neige légère",
  "heavy snow": "fortes neiges",
  "drizzle": "bruine",
  "fog": "brouillard",
  "haze": "brume",
  "smoke": "brumeux",
  "dust": "poussière",
  "sand": "sable",
  "volcanic ash": "cendres volcaniques",
  "squalls": "rafales",
  "tornado": "tornade"
};

export const translateWeatherDescription = (description: string): string => {
  return weatherTranslations[description.toLowerCase()] || description;
};
