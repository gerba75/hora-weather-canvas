
import React from 'react';
import { AlertData, getAlertSeverity, getLocalTime } from '@/utils/weatherUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, CalendarClock } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeatherAlertsProps {
  alerts: AlertData[];
  timezone: number;
}

const WeatherAlerts = ({ alerts, timezone }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <AlertTriangle className="mr-2 text-amber-500" size={24} />
        Alertes météo ({alerts.length})
      </h2>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const startTime = getLocalTime(alert.start, timezone);
          const endTime = getLocalTime(alert.end, timezone);
          const { color, bgColor } = getAlertSeverity(alert.event);
          
          return (
            <Collapsible key={index} className="w-full">
              <CollapsibleTrigger className="w-full text-left">
                <Alert className={`${bgColor} border-l-4 ${color.replace('text-', 'border-l-')}`}>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <AlertTitle className={color}>
                        {alert.event}
                      </AlertTitle>
                      <AlertDescription className="text-xs flex items-center mt-1">
                        <CalendarClock size={14} className="mr-1" />
                        {formatRelative(startTime, new Date(), { locale: fr })} - {formatRelative(endTime, new Date(), { locale: fr })}
                      </AlertDescription>
                    </div>
                    <span className="text-sm font-medium">Détails ▼</span>
                  </div>
                </Alert>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="mt-2 px-4 py-3 bg-white/90 dark:bg-gray-800/90 rounded-md border">
                  <p className="text-sm"><span className="font-medium">Source:</span> {alert.sender_name}</p>
                  <p className="mt-2 text-sm whitespace-pre-line">{alert.description}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeatherAlerts;
