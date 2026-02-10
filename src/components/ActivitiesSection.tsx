import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import activityDistribution from "@/assets/activity-distribution.jpg";
import activityClassroom from "@/assets/activity-classroom.jpg";
import activityTraining from "@/assets/activity-training.jpg";
import activityOutreach from "@/assets/activity-outreach.jpg";

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  imageUrl?: string;
}

// Activity images mapping
const activityImages: Record<string, string> = {
  "1": activityClassroom,
  "2": activityOutreach,
  "3": activityTraining,
  "4": activityDistribution,
};

// Default activities for demo - will be replaced with real data when backend is connected
const defaultActivities: Activity[] = [
  {
    id: "1",
    title: "Menstrual Health Education - Usenge Primary",
    description: "Interactive session teaching girls about menstrual health, proper hygiene practices, and how to manage their periods confidently. Girls learned essential skills to stay in school every day of the month.",
    date: "2024-01-15",
    location: "Usenge Primary School, Bondo",
    participants: 85,
  },
  {
    id: "2",
    title: "Community Outreach - Ugunja Market",
    description: "Engaged parents and community leaders in discussions about supporting girls with sanitary products. Breaking the stigma around menstruation so girls can attend school without shame.",
    date: "2024-01-20",
    location: "Ugunja Market Center",
    participants: 120,
  },
  {
    id: "3",
    title: "Teacher Training Program",
    description: "Trained female teachers on how to support students during menstruation, provide emergency sanitary supplies, and create supportive environments that keep girls in class.",
    date: "2024-02-05",
    location: "Siaya Teachers College",
    participants: 45,
  },
  {
    id: "4",
    title: "Sanitary Pad Distribution - Gem Sub-county",
    description: "Large-scale distribution of sanitary pads to schools in Gem sub-county. Providing girls with the essential supplies they need to attend school every single day without interruption.",
    date: "2024-02-12",
    location: "Gem Sub-county Schools",
    participants: 520,
  },
];

interface ActivitiesSectionProps {
  activities?: Activity[];
}

export function ActivitiesSection({ activities = defaultActivities }: ActivitiesSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActivityImage = (activity: Activity) => {
    return activity.imageUrl || activityImages[activity.id] || activityDistribution;
  };

  return (
    <section id="activities" className="section-padding bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Our Work
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Recent <span className="text-primary">Activities</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how we're keeping girls in school through sanitary product distribution 
            and menstrual health education across Siaya County.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-card border border-border card-hover"
            >
              {/* Image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={getActivityImage(activity)}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {formatDate(activity.date)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif font-bold text-xl text-foreground mb-3 line-clamp-2">
                  {activity.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {activity.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-secondary" />
                    <span>{activity.participants} participants</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/activities">
            <Button variant="forest" size="lg">
              View All Activities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
