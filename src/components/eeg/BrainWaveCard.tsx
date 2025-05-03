
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WaveformDisplay from './WaveformDisplay';
import { EEGReading } from '@/contexts/EEGContext';

interface BrainWaveCardProps {
  title: string;
  value: number;
  waveType: 'alpha' | 'beta' | 'gamma';
  data: EEGReading[];
  color: string;
  unit?: string;
  description?: string;
}

const BrainWaveCard: React.FC<BrainWaveCardProps> = ({
  title,
  value,
  waveType,
  data,
  color,
  unit = 'Hz',
  description,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex justify-between items-center">
          <span>{title}</span>
          <span className="text-lg font-bold" style={{ color }}>
            {value.toFixed(1)} <span className="text-xs text-muted-foreground">{unit}</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WaveformDisplay 
          data={data} 
          waveType={waveType} 
          color={color} 
          height={70} 
        />
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BrainWaveCard;
