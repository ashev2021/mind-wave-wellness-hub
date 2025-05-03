
import { useEffect, useRef } from 'react';
import { EEGReading } from '@/contexts/EEGContext';

interface WaveformDisplayProps {
  data: EEGReading[];
  waveType: 'alpha' | 'beta' | 'gamma';
  color?: string;
  height?: number;
  className?: string;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  data,
  waveType,
  color = '#9b87f5',
  height = 80,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length < 2) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    
    // Scale context based on device pixel ratio
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, height);
    
    // Normalize the data to fit within the canvas height
    const values = data.map(reading => reading[waveType]);
    const maxValue = Math.max(...values, 1); // Prevent division by zero
    const normalizedData = values.map(value => (value / maxValue) * (height * 0.8));
    
    // Draw the waveform
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Start from the bottom of the first point
    ctx.moveTo(0, height);
    
    // Draw line to the first data point
    ctx.lineTo(0, height - normalizedData[0]);
    
    // Calculate width of each segment
    const segmentWidth = rect.width / (normalizedData.length - 1);
    
    // Draw the top of the waveform
    normalizedData.forEach((value, index) => {
      const x = index * segmentWidth;
      const y = height - value;
      ctx.lineTo(x, y);
    });
    
    // Draw line to the bottom right corner
    ctx.lineTo(rect.width, height);
    
    // Close the path to the bottom left to create a filled shape
    ctx.lineTo(0, height);
    ctx.closePath();
    
    // Fill with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}80`); // 50% transparency
    gradient.addColorStop(1, `${color}10`); // 10% transparency
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Stroke the line
    ctx.stroke();
  }, [data, waveType, color, height]);

  return (
    <div className={`relative w-full ${className}`}>
      <canvas 
        ref={canvasRef} 
        style={{ height: `${height}px`, width: '100%' }}
        className="rounded-md"
      />
    </div>
  );
};

export default WaveformDisplay;
