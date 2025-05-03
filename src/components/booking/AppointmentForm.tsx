
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Psychologist } from "./PsychologistCard";

interface AppointmentFormProps {
  psychologist: Psychologist;
  onClose: () => void;
}

// Mock available time slots
const timeSlots = [
  "09:00", "10:00", "11:00", 
  "13:00", "14:00", "15:00", "16:00"
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({ psychologist, onClose }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Convert string dates to Date objects
  const availableDates = psychologist.availableDates.map(
    dateStr => new Date(dateStr)
  );

  // Function to check if a date is available
  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = () => {
    if (!date || !timeSlot) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both a date and time for your appointment."
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${psychologist.name} on ${format(date, "PP")} at ${timeSlot} has been confirmed.`
      });
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>
          Schedule a session with Dr. {psychologist.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => 
                  date < new Date() || !isDateAvailable(date)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Time</label>
          <Select 
            value={timeSlot} 
            onValueChange={setTimeSlot}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a time slot">
                {timeSlot ? (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{timeSlot}</span>
                  </div>
                ) : (
                  "Select a time slot"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!date || !timeSlot || isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentForm;
