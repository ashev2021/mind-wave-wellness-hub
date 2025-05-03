
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BrainCircuit } from "lucide-react";

const Onboarding = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    role: "patient" as "patient" | "clinician",
    specialization: "",
    experience: "",
    consentGiven: false
  });

  // If user is already onboarded, redirect to dashboard
  useEffect(() => {
    if (user?.name && user?.consentGiven) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: "patient" | "clinician") => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleConsentChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, consentGiven: checked }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Convert age to number
      const userData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      };
      
      await updateUserProfile(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.name && !!formData.age;
      case 2:
        if (formData.role === "clinician") {
          return !!formData.specialization && !!formData.experience;
        }
        return true;
      case 3:
        return formData.consentGiven;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-mindwave-bg flex flex-col">
      {/* Header */}
      <header className="p-4 border-b bg-white">
        <div className="container flex items-center">
          <BrainCircuit className="h-8 w-8 text-mindwave-primary mr-2" />
          <h1 className="text-xl font-bold text-mindwave-primary">MindWave Wellness Hub</h1>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="container pt-6">
        <div className="flex items-center mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center font-semibold ${
                  step === i 
                    ? 'bg-mindwave-primary text-white' 
                    : step > i 
                    ? 'bg-mindwave-secondary text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i}
              </div>
              {i < 3 && (
                <div 
                  className={`h-1 w-12 ${
                    step > i ? 'bg-mindwave-secondary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 container py-8">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    className="mt-1"
                    min="18"
                    max="120"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Select your role</h2>
              <RadioGroup 
                value={formData.role} 
                onValueChange={(value) => handleRoleChange(value as "patient" | "clinician")}
                className="mb-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="cursor-pointer">
                    I'm a patient looking for mental health support
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="clinician" id="clinician" />
                  <Label htmlFor="clinician" className="cursor-pointer">
                    I'm a mental health professional
                  </Label>
                </div>
              </RadioGroup>

              {/* Additional fields for clinicians */}
              {formData.role === "clinician" && (
                <div className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Clinical Psychology, Psychiatry"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Years of professional practice"
                      className="mt-1"
                      min="0"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 3: Consent */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Consent & Privacy</h2>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-md text-sm">
                  <p className="mb-4">
                    By using MindWave Wellness Hub, you consent to the collection and analysis of your EEG data for the purpose of monitoring your mental health and providing personalized insights.
                  </p>
                  <p>
                    Your data will be stored securely and will only be accessible to mental health professionals you explicitly choose to share it with. You can withdraw your consent and request data deletion at any time.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="consent" 
                    checked={formData.consentGiven}
                    onCheckedChange={(checked) => handleConsentChange(!!checked)}
                  />
                  <Label htmlFor="consent">
                    I understand and give consent to data collection and processing
                  </Label>
                </div>
              </div>
            </>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button 
                type="button"
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            <Button 
              type="button"
              onClick={nextStep}
              disabled={!isCurrentStepValid() || loading}
            >
              {loading 
                ? "Loading..." 
                : step < 3 
                ? "Next" 
                : "Complete Setup"
              }
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
