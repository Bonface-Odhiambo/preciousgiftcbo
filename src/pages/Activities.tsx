import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import activityDistribution from "@/assets/activity-distribution.jpg";
import activityClassroom from "@/assets/activity-classroom.jpg";
import activityTraining from "@/assets/activity-training.jpg";
import activityOutreach from "@/assets/activity-outreach.jpg";

// Fallback images for activities without custom images
const fallbackImages = [
  activityClassroom,
  activityOutreach,
  activityTraining,
  activityDistribution,
];

const Activities = () => {
  const { activities, loading } = useActivities();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActivityImage = (activity: { image_url?: string | null }, index: number) => {
    return activity.image_url || fallbackImages[index % fallbackImages.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 md:px-6">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Our Work
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
                All <span className="text-primary">Activities</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                See how we're keeping girls in school through sanitary product distribution 
                and menstrual health education across Siaya County.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No activities found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card border border-border card-hover"
                  >
                    {/* Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <img
                        src={getActivityImage(activity, index)}
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Activities;
