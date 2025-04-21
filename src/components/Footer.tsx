
import React from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full py-8 mt-16 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-blue-100/40 border-t border-blue-100"
    >
      <Separator className="mb-6" />
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 max-w-5xl">
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col text-left"
        >
          <p className="text-base lg:text-lg font-semibold text-primary mb-1">
            Météo en direct
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} - Tous droits réservés.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-muted-foreground max-w-lg leading-relaxed"
        >
          <p>
            Application météo responsive qui permet de consulter les conditions météo actuelles et les prévisions sur 5 jours, partout dans le monde.
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Données fournies par OpenWeatherMap.
          </p>
        </motion.div>
        
      </div>
    </motion.footer>
  );
};

export default Footer;
