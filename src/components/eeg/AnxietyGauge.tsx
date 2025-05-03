
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from 'lucide-react';

interface AnxietyGaugeProps {
  value: number;
  threshold: number;
}

const AnxietyGauge: React.FC<AnxietyGaugeProps> = ({ value, threshold }) => {
  const [color, setColor] = useState("bg-green-500");
  const [pulseRing, setPulseRing] = useState(false);
  
  // Determine color based on value compared to threshold
  useEffect(() => {
    if (value >= threshold) {
      setColor("bg-red-500");
      setPulseRing(true);
    } else if (value >= threshold * 0.8) {
      setColor("bg-amber-500");
      setPulseRing(false);
    } else if (value >= threshold * 0.6) {
      setColor("bg-yellow-500");
      setPulseRing(false);
    } else {
      setColor("bg-green-500");
      setPulseRing(false);
    }
  }, [value, threshold]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">Anxiety Level</div>
        <div className="text-sm text-mindwave-muted">
          {value.toFixed(0)}/100
        </div>
      </div>
      
      <div className="relative">
        <Progress value={value} max={100} className="h-3" />
        
        {/* Threshold marker */}
        <div 
          className="absolute top-0 w-0.5 h-3 bg-mindwave-text opacity-60"
          style={{ left: `${threshold}%` }}
        />
      </div>
      
      {value >= threshold && (
        <div className="mt-2 flex items-center text-sm text-red-500">
          <div className={`relative ${pulseRing ? 'animate-pulse' : ''}`}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            {pulseRing && (
              <span className="absolute inset-0 rounded-full animate-pulse-ring bg-red-500 opacity-25" />
            )}
          </div>
          <span>Above threshold</span>
        </div>
      )}
    </div>
  );
};

export default AnxietyGauge;
