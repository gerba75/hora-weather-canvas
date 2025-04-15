
import React from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Github, Mail, Globe } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full py-6 mt-8"
    >
      <Separator className="mb-6" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-4 md:mb-0"
          >
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Météo en direct. Tous droits réservés.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center space-x-4"
          >
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={18} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail size={18} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Globe size={18} />
            </a>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-center text-xs text-muted-foreground"
        >
          <p>Données météorologiques fournies par OpenWeatherMap</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
