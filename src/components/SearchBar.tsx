
import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, X, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const POPULAR_CITIES = ["Paris", "New York", "Tokyo", "London", "Dubai", "Sydney"];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Charger les recherches récentes du localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error("Erreur lors du chargement des recherches récentes");
      }
    }
  }, []);
  
  const saveSearch = (searchTerm: string) => {
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 4); // Garder seulement les 4 dernières recherches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const removeSearch = (searchTerm: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le clic de se propager au bouton parent
    const updatedSearches = recentSearches.filter(s => s !== searchTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      saveSearch(city.trim());
    }
  };
  
  const handleCityClick = (selectedCity: string) => {
    setCity(selectedCity);
    onSearch(selectedCity);
    saveSearch(selectedCity);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex w-full gap-2 relative z-10">
        <div className="relative flex-1">
          <motion.div
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Rechercher une ville..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="bg-white/80 backdrop-blur-sm pr-8 border-2 focus:border-primary/80 text-gray-800"
            />
            <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 shadow-md"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </form>

      <AnimatePresence>
        {isFocused && (recentSearches.length > 0 || POPULAR_CITIES.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-20 p-2"
          >
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="flex justify-between items-center px-2 mb-2">
                  <p className="text-xs font-medium text-gray-700">Recherches récentes</p>
                  {recentSearches.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllSearches}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      <Trash className="h-3 w-3 mr-1" />
                      Tout effacer
                    </Button>
                  )}
                </div>
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={`recent-${index}`}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    className="flex items-center justify-between w-full text-left px-3 py-1.5 rounded-md text-sm text-gray-800"
                    onClick={() => handleCityClick(search)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-3 w-3 text-gray-500" />
                      {search}
                    </div>
                    <button
                      onClick={(e) => removeSearch(search, e)}
                      className="p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.button>
                ))}
              </div>
            )}

            {POPULAR_CITIES.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2 px-2">Villes populaires</p>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_CITIES.map((popularCity, index) => (
                    <motion.button
                      key={`popular-${index}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-50 hover:bg-blue-100 text-xs px-2 py-1 rounded-full text-blue-700"
                      onClick={() => handleCityClick(popularCity)}
                    >
                      {popularCity}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
