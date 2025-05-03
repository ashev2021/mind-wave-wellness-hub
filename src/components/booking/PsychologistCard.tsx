
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Star } from "lucide-react";

export interface Psychologist {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: number;
  avatarUrl?: string;
  availableDates: string[];
  bio: string;
}

interface PsychologistCardProps {
  psychologist: Psychologist;
  onBookClick: (psychologist: Psychologist) => void;
}

const PsychologistCard: React.FC<PsychologistCardProps> = ({ psychologist, onBookClick }) => {
  // Get the first available date to display
  const nextAvailable = psychologist.availableDates[0] ? 
    new Date(psychologist.availableDates[0]).toLocaleDateString() : 
    "No availability";

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={psychologist.avatarUrl} />
            <AvatarFallback>{getInitials(psychologist.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{psychologist.name}</CardTitle>
            <CardDescription>{psychologist.specialization}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{psychologist.rating.toFixed(1)}</span>
          </div>
          <div className="text-muted-foreground">
            {psychologist.experience} years exp.
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{psychologist.bio}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Next available: {nextAvailable}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onBookClick(psychologist)}
          className="text-mindwave-primary hover:text-mindwave-primary hover:bg-mindwave-tertiary/50 border-mindwave-primary/30"
        >
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PsychologistCard;
