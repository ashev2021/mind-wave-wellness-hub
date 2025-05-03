
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, SearchIcon } from "lucide-react";

import PsychologistCard, { Psychologist } from "@/components/booking/PsychologistCard";
import AppointmentForm from "@/components/booking/AppointmentForm";

// Mock data for psychologists
const psychologists: Psychologist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Clinical Psychology",
    rating: 4.8,
    experience: 12,
    availableDates: [
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),  // Tomorrow
      new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    ],
    bio: "Specializes in anxiety disorders, depression, and stress management using cognitive behavioral therapy approaches."
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Neuropsychology",
    rating: 4.6,
    experience: 8,
    availableDates: [
      new Date(Date.now() + 86400000).toISOString(),  // Tomorrow
      new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    ],
    bio: "Expert in the relationship between brain function and behavior, specializing in cognitive assessment and rehabilitation."
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Psychiatry",
    rating: 4.9,
    experience: 15,
    availableDates: [
      new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    ],
    bio: "Board-certified psychiatrist specializing in mood disorders, anxiety, and medication management with a holistic approach."
  },
  {
    id: "4",
    name: "Dr. David Thompson",
    specialization: "Cognitive Therapy",
    rating: 4.7,
    experience: 10,
    availableDates: [
      new Date(Date.now() + 86400000).toISOString(),  // Tomorrow
      new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    ],
    bio: "Focuses on cognitive behavioral therapy for anxiety, depression and stress-related conditions."
  }
];

// Specialization options
const specializations = [
  { value: "all", label: "All Specializations" },
  { value: "clinicalPsychology", label: "Clinical Psychology" },
  { value: "neuropsychology", label: "Neuropsychology" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "cognitiveBehavioral", label: "Cognitive Behavioral Therapy" }
];

const BookAppointment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  
  // Filter psychologists based on search and filters
  const filteredPsychologists = psychologists.filter(psych => {
    const matchesSearch = psych.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         psych.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = specialization === "all" || 
                                psych.specialization.toLowerCase().includes(specialization.toLowerCase());
    
    return matchesSearch && matchesSpecialization;
  });

  const handleBookClick = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-mindwave-text mb-2">Book a Session</h1>
        <p className="text-mindwave-muted">
          Find and book an appointment with a mental health professional
        </p>
      </div>

      {selectedPsychologist ? (
        <div>
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setSelectedPsychologist(null)}
          >
            ← Back to all psychologists
          </Button>
          <AppointmentForm 
            psychologist={selectedPsychologist} 
            onClose={() => setSelectedPsychologist(null)} 
          />
        </div>
      ) : (
        <>
          {/* Search and filters */}
          <div className="grid gap-4 md:grid-cols-[3fr_1fr]">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or specialization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs for different booking views */}
          <Tabs defaultValue="available" className="space-y-4">
            <TabsList>
              <TabsTrigger value="available">
                <Calendar className="h-4 w-4 mr-2" />
                Available Now
              </TabsTrigger>
              <TabsTrigger value="all">All Psychologists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="space-y-4">
              {/* Available psychologists */}
              {filteredPsychologists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPsychologists.map(psych => (
                    <PsychologistCard 
                      key={psych.id} 
                      psychologist={psych} 
                      onBookClick={handleBookClick} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-mindwave-muted">No psychologists match your search criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4">
              {/* All psychologists - same content for demo */}
              {filteredPsychologists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPsychologists.map(psych => (
                    <PsychologistCard 
                      key={psych.id} 
                      psychologist={psych} 
                      onBookClick={handleBookClick} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-mindwave-muted">No psychologists match your search criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default BookAppointment;
