
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEEG, EEGReading } from "@/contexts/EEGContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrainWaveCard from "@/components/eeg/BrainWaveCard";
import AnxietyGauge from "@/components/eeg/AnxietyGauge";
import { BrainCircuit, AlertTriangle, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

// Empty readings array for initial state
const emptyReadings: EEGReading[] = Array(30).fill({
  timestamp: Date.now(),
  alpha: 0,
  beta: 0,
  gamma: 0,
  anxietyScore: 0
});

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    connected, 
    connecting, 
    connectDevice, 
    readings, 
    currentReading, 
    stats, 
    anxietyThreshold 
  } = useEEG();

  // Try to connect device on component mount if not already connected
  useEffect(() => {
    if (!connected && !connecting) {
      connectDevice();
    }
  }, [connected, connecting, connectDevice]);

  // Use either actual readings or empty array if no readings yet
  const displayReadings = readings.length > 0 ? readings : emptyReadings;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-mindwave-text">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-mindwave-muted">
            {connected 
              ? "Your EEG device is connected and monitoring brain activity" 
              : connecting 
              ? "Connecting to EEG device..." 
              : "Connect your EEG device to start monitoring"
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={connected ? "destructive" : "default"}
            onClick={connectDevice}
            disabled={connecting}
            className="flex items-center gap-2"
          >
            <BrainCircuit className="h-4 w-4" />
            {connected ? "Disconnect Device" : connecting ? "Connecting..." : "Connect Device"}
          </Button>
          
          <Link to="/book">
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Book Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Card */}
      {connected && currentReading && (
        <Card className="relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${
            (stats?.thresholdExceeded) ? 'bg-red-500' : 'bg-green-500'
          }`} />
          <CardHeader className="pb-2">
            <CardTitle>Current Status</CardTitle>
            <CardDescription>
              Last updated: {new Date(currentReading.timestamp).toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Anxiety Score */}
              <div className="md:col-span-2">
                <AnxietyGauge 
                  value={currentReading.anxietyScore} 
                  threshold={anxietyThreshold} 
                />
                
                {stats?.thresholdExceeded && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-600">Elevated anxiety detected</p>
                      <p className="text-sm text-red-600/80">
                        Consider taking a short break or trying a relaxation exercise.
                      </p>
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="p-0 h-auto mt-1 text-red-600"
                        asChild
                      >
                        <Link to="/book">Book a consultation</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Current values */}
              <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
                <div>
                  <div className="text-xs text-mindwave-muted mb-1">Alpha Waves</div>
                  <div className="text-2xl font-semibold text-mindwave-primary">
                    {currentReading.alpha.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-mindwave-muted mb-1">Beta Waves</div>
                  <div className="text-2xl font-semibold text-amber-500">
                    {currentReading.beta.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-mindwave-muted mb-1">Gamma Waves</div>
                  <div className="text-2xl font-semibold text-violet-500">
                    {currentReading.gamma.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not connected message */}
      {!connected && (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
                <BrainCircuit className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No EEG Device Connected</h3>
              <p className="text-gray-500 mb-4">Connect your device to start monitoring brain activity</p>
              <Button onClick={connectDevice} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect Device"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="brain-waves" className="space-y-4">
        <TabsList>
          <TabsTrigger value="brain-waves">Brain Waves</TabsTrigger>
          <TabsTrigger value="anxiety-score">Anxiety Score</TabsTrigger>
        </TabsList>
        
        {/* Brain Waves Tab */}
        <TabsContent value="brain-waves" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BrainWaveCard 
              title="Alpha Waves" 
              value={currentReading?.alpha || 0}
              waveType="alpha"
              data={displayReadings}
              color="#6E59A5"
              description="Relaxation & calmness (8-12 Hz)"
            />
            <BrainWaveCard 
              title="Beta Waves" 
              value={currentReading?.beta || 0}
              waveType="beta"
              data={displayReadings}
              color="#F97316"
              description="Active thinking & concentration (13-30 Hz)"
            />
            <BrainWaveCard 
              title="Gamma Waves" 
              value={currentReading?.gamma || 0}
              waveType="gamma"
              data={displayReadings}
              color="#8B5CF6"
              description="Higher cognitive functions (30-100 Hz)"
            />
          </div>
        </TabsContent>
        
        {/* Anxiety Score Tab */}
        <TabsContent value="anxiety-score" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anxiety Score History</CardTitle>
              <CardDescription>
                Recent anxiety score trends based on Beta/Alpha ratio
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {readings.length > 0 ? (
                <div className="h-full w-full">
                  {/* This will be replaced with a chart component */}
                  <div className="h-full flex flex-col justify-center items-center text-center">
                    <div className="text-4xl font-bold">
                      {currentReading?.anxietyScore.toFixed(0) || 0}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Current anxiety score (0-100)
                    </div>
                    <div className="text-xs text-muted-foreground mt-4 max-w-xs">
                      A detailed anxiety score chart will be displayed here when more data is collected.
                      The score is calculated from the Beta/Alpha ratio and normalized to a 0-100 scale.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <p className="text-mindwave-muted">
                      No data available yet. Connect your EEG device to start tracking.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
