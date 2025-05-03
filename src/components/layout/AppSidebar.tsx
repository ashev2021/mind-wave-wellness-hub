
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEEG } from "@/contexts/EEGContext";

import { 
  Activity, BarChart3, Calendar, User, Settings, 
  LogOut, X, BrainCircuit 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, signOut } = useAuth();
  const { connected, connectDevice, disconnectDevice } = useEEG();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Activity },
    { name: "Book Session", path: "/book", icon: Calendar },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/profile", icon: Settings }
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeviceConnection = async () => {
    if (connected) {
      disconnectDevice();
    } else {
      try {
        await connectDevice();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to EEG device."
        });
      }
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header with logo */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <BrainCircuit className="h-8 w-8 text-mindwave-primary mr-2" />
            <h1 className="text-xl font-bold text-mindwave-primary">MindWave</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator />

        {/* User info */}
        <div className="p-4">
          <p className="font-medium text-mindwave-text">{user?.name}</p>
          <p className="text-xs text-mindwave-muted capitalize">{user?.role}</p>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start text-mindwave-text hover:bg-mindwave-tertiary hover:text-mindwave-primary"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Device connection */}
        <div className="p-4">
          <Button 
            variant={connected ? "destructive" : "outline"} 
            className="w-full"
            onClick={handleDeviceConnection}
          >
            <BrainCircuit className="mr-2 h-5 w-5" />
            {connected ? "Disconnect Device" : "Connect EEG Device"}
          </Button>
        </div>

        {/* Sign out button */}
        <div className="p-4 mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-mindwave-muted hover:text-mindwave-primary"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
