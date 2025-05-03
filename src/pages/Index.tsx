
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit } from "lucide-react";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/dashboard");
      } else {
        await signUp(email, password);
        navigate("/onboarding");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mindwave-bg flex flex-col">
      {/* Header */}
      <header className="p-4 border-b bg-white">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-mindwave-primary" />
            <h1 className="text-xl font-bold text-mindwave-primary">MindWave Wellness Hub</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Hero */}
        <div className="flex-1 bg-gradient-to-br from-mindwave-primary to-mindwave-secondary p-8 text-white flex flex-col justify-center">
          <div className="max-w-xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Monitor Your Mental Health with EEG Technology</h1>
            <p className="text-lg mb-6 opacity-90">
              Track your brain waves, identify early signs of anxiety or burnout, 
              and connect with professional help when you need it.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real-time Brain Wave Monitoring</h3>
                  <p className="opacity-80">Track Alpha, Beta, and Gamma waves from your EEG device</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Smart Alerts</h3>
                  <p className="opacity-80">Get notified when anxiety levels exceed your personal threshold</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Easy Appointment Booking</h3>
                  <p className="opacity-80">Connect with mental health professionals when needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="md:w-1/3 lg:w-1/4 p-8 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-mindwave-text mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-mindwave-muted">
              {isLogin 
                ? "Sign in to access your dashboard" 
                : "Sign up to start monitoring your mental health"}
            </p>
          </div>

          <Tabs defaultValue="login" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login"
                onClick={() => setIsLogin(true)}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-mindwave-primary hover:bg-mindwave-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 
                "Loading..." : 
                isLogin ? "Sign In" : "Create Account"
              }
            </Button>
          </form>

          {isLogin && (
            <p className="text-center text-sm mt-4 text-mindwave-muted">
              Don't have an account?{" "}
              <button 
                onClick={() => setIsLogin(false)}
                className="text-mindwave-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
          
          {!isLogin && (
            <p className="text-center text-sm mt-4 text-mindwave-muted">
              Already have an account?{" "}
              <button 
                onClick={() => setIsLogin(true)}
                className="text-mindwave-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          <div className="mt-8 pt-4 border-t text-center">
            <p className="text-xs text-mindwave-muted">
              For demo: Use <span className="font-mono">patient@example.com</span> / <span className="font-mono">password123</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
