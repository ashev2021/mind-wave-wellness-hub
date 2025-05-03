
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEEG } from "@/contexts/EEGContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { anxietyThreshold, setAnxietyThreshold, clearReadings } = useEEG();
  const { toast } = useToast();

  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
  });
  
  const [localAnxietyThreshold, setLocalAnxietyThreshold] = useState(anxietyThreshold);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBookingEnabled, setAutoBookingEnabled] = useState(false);
  const [dataShareEnabled, setDataShareEnabled] = useState(false);

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateUserProfile({
        name: profileData.name,
        age: profileData.age ? parseInt(profileData.age.toString()) : undefined
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your profile."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleThresholdUpdate = () => {
    setAnxietyThreshold(localAnxietyThreshold);
    
    toast({
      title: "Threshold Updated",
      description: `Anxiety alert threshold has been set to ${localAnxietyThreshold}.`
    });
  };

  const handleClearData = () => {
    clearReadings();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-mindwave-text mb-2">Your Profile</h1>
        <p className="text-mindwave-muted">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="settings">EEG Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        {/* Profile Information Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              
              <div className="space-y-1">
                <Label>Account Type</Label>
                <p className="text-sm font-medium capitalize">{user?.role}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* EEG Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>EEG Monitoring Settings</CardTitle>
              <CardDescription>
                Configure your anxiety threshold and data collection preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Anxiety Alert Threshold</Label>
                  <span className="text-sm font-medium">{localAnxietyThreshold}</span>
                </div>
                <Slider
                  value={[localAnxietyThreshold]}
                  min={40}
                  max={90}
                  step={1}
                  onValueChange={(values) => setLocalAnxietyThreshold(values[0])}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  You'll receive alerts when your anxiety score exceeds this threshold
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label>Data Management</Label>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={handleClearData}
                    className="mr-2"
                  >
                    Clear All EEG Readings
                  </Button>
                  <Button variant="outline">
                    Export Data (CSV)
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleThresholdUpdate}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you get notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anxiety Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when your anxiety level exceeds your threshold
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Booking Suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    Suggest booking an appointment when anxiety levels are consistently high
                  </p>
                </div>
                <Switch
                  checked={autoBookingEnabled}
                  onCheckedChange={setAutoBookingEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly email summaries of your mental health data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Manage how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Data with Your Psychologist</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your booked psychologist to access your EEG data
                  </p>
                </div>
                <Switch
                  checked={dataShareEnabled}
                  onCheckedChange={setDataShareEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonymous Research Contribution</Label>
                  <p className="text-sm text-muted-foreground">
                    Contribute anonymized data to mental health research
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Data Deletion</Label>
                <Button variant="destructive">
                  Delete All My Data
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  This will permanently delete all your EEG readings and account information
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Privacy Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
