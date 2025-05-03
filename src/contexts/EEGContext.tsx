import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

// EEG Data types
export interface EEGReading {
  timestamp: number;
  alpha: number;
  beta: number;
  gamma: number;
  anxietyScore: number;
  delta?: number;
  theta?: number;
}

export interface EEGStats {
  currentReading: EEGReading;
  alphaAvg: number;
  betaAvg: number;
  gammaAvg: number;
  anxietyScoreAvg: number;
  thresholdExceeded: boolean;
  readingsAboveThreshold: number;
}

interface EEGContextType {
  connected: boolean;
  connecting: boolean;
  currentReading: EEGReading | null;
  readings: EEGReading[];
  stats: EEGStats | null;
  anxietyThreshold: number;
  connectDevice: () => Promise<void>;
  disconnectDevice: () => void;
  setAnxietyThreshold: (value: number) => void;
  clearReadings: () => void;
}

const initialReading: EEGReading = {
  timestamp: Date.now(),
  alpha: 10,
  beta: 15,
  gamma: 5,
  anxietyScore: 35
};

const EEGContext = createContext<EEGContextType | undefined>(undefined);

export const EEGProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [currentReading, setCurrentReading] = useState<EEGReading | null>(null);
  const [readings, setReadings] = useState<EEGReading[]>([]);
  const [stats, setStats] = useState<EEGStats | null>(null);
  const [anxietyThreshold, setAnxietyThreshold] = useState<number>(70);
  const [interval, setIntervalId] = useState<number | null>(null);
  const { toast } = useToast();

  // Simulated data generation
  const generateMockEEGData = useCallback((): EEGReading => {
    const now = Date.now();
    
    // Base values
    const baseAlpha = 10; // 8-12 Hz
    const baseBeta = 15;  // 13-30 Hz
    const baseGamma = 5;  // 30-100 Hz
    
    // Random fluctuations
    const rand = () => (Math.random() - 0.5) * 2;
    
    const alpha = Math.max(1, baseAlpha + rand() * 5);
    const beta = Math.max(1, baseBeta + rand() * 8);
    const gamma = Math.max(1, baseGamma + rand() * 3);
    
    // Calculate anxiety score as beta/alpha ratio, normalized to 0-100
    const betaAlphaRatio = beta / alpha;
    let anxietyScore = Math.min(100, Math.max(0, 
      (betaAlphaRatio - 0.8) * 50 + gamma * 2
    ));
    
    return {
      timestamp: now,
      alpha,
      beta,
      gamma,
      anxietyScore: Math.round(anxietyScore)
    };
  }, []);

  // Calculate statistics
  const calculateStats = useCallback((allReadings: EEGReading[], current: EEGReading, threshold: number): EEGStats => {
    // Only consider the last 50 readings for moving averages
    const recentReadings = allReadings.slice(-50);
    
    const alphaAvg = recentReadings.reduce((sum, reading) => sum + reading.alpha, 0) / recentReadings.length;
    const betaAvg = recentReadings.reduce((sum, reading) => sum + reading.beta, 0) / recentReadings.length;
    const gammaAvg = recentReadings.reduce((sum, reading) => sum + reading.gamma, 0) / recentReadings.length;
    const anxietyScoreAvg = recentReadings.reduce((sum, reading) => sum + reading.anxietyScore, 0) / recentReadings.length;
    
    // Check if current reading exceeds threshold
    const thresholdExceeded = current.anxietyScore > threshold;
    
    // Count readings above threshold in the last 10 readings
    const readingsAboveThreshold = allReadings.slice(-10).filter(r => r.anxietyScore > threshold).length;
    
    return {
      currentReading: current,
      alphaAvg,
      betaAvg,
      gammaAvg,
      anxietyScoreAvg,
      thresholdExceeded,
      readingsAboveThreshold
    };
  }, []);

  // Notification system for threshold exceeded
  useEffect(() => {
    if (stats?.thresholdExceeded && stats.readingsAboveThreshold >= 3) {
      toast({
        variant: "destructive",
        title: "Anxiety Level Alert",
        description: `Your anxiety score is above threshold (${anxietyThreshold}). Consider relaxation or booking a consultation.`,
      });
    }
  }, [stats, anxietyThreshold, toast]);

  // Connect to EEG device (simulated)
  const connectDevice = async (): Promise<void> => {
    if (connected || connecting) return;
    
    setConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConnected(true);
      toast({
        title: "Device Connected",
        description: "EEG monitoring device connected successfully.",
      });
      
      // Start data collection
      const newInterval = window.setInterval(() => {
        const newReading = generateMockEEGData();
        
        setCurrentReading(newReading);
        setReadings(prev => {
          const newReadings = [...prev, newReading];
          // Keep only the last 100 readings
          return newReadings.slice(-100);
        });
        
        setStats(current => {
          if (!current) {
            return calculateStats([newReading], newReading, anxietyThreshold);
          }
          return calculateStats([...readings, newReading], newReading, anxietyThreshold);
        });
      }, 1000) as unknown as number;
      
      setIntervalId(newInterval);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not connect to EEG device. Please try again.",
      });
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect from EEG device
  const disconnectDevice = (): void => {
    if (!connected) return;
    
    if (interval !== null) {
      clearInterval(interval);
      setIntervalId(null);
    }
    
    setConnected(false);
    toast({
      title: "Device Disconnected",
      description: "EEG monitoring device disconnected.",
    });
  };

  // Update anxiety threshold
  const updateAnxietyThreshold = (value: number): void => {
    setAnxietyThreshold(value);
    
    // Recalculate stats with new threshold
    if (currentReading && readings.length > 0) {
      setStats(calculateStats(readings, currentReading, value));
    }
    
    toast({
      title: "Threshold Updated",
      description: `Anxiety alert threshold set to ${value}.`,
    });
  };

  // Clear all readings
  const clearReadings = (): void => {
    setReadings([]);
    setCurrentReading(null);
    setStats(null);
    
    toast({
      title: "Data Cleared",
      description: "All EEG readings have been cleared.",
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [interval]);

  const value = {
    connected,
    connecting,
    currentReading,
    readings,
    stats,
    anxietyThreshold,
    connectDevice,
    disconnectDevice,
    setAnxietyThreshold: updateAnxietyThreshold,
    clearReadings
  };

  return <EEGContext.Provider value={value}>{children}</EEGContext.Provider>;
};

export const useEEG = (): EEGContextType => {
  const context = useContext(EEGContext);
  if (context === undefined) {
    throw new Error('useEEG must be used within an EEGProvider');
  }
  return context;
};
