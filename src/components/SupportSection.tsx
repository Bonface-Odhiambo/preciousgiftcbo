import { useState } from "react";
import { Heart, Package, GraduationCap, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonationModal } from "@/components/DonationModal";

const supportOptions = [
  {
    icon: Package,
    title: "Donate Sanitary Pads",
    description: "Your contribution provides essential sanitary products that keep girls in school every day of the month.",
    action: "Donate Now",
    featured: true,
    donationType: "sanitary_pads",
    isDonation: true,
  },
  {
    icon: Heart,
    title: "Financial Support",
    description: "Fund our programs to purchase pads, educational materials, and reach more schools across Siaya.",
    action: "Give Today",
    featured: false,
    donationType: "financial_support",
    isDonation: true,
  },
  {
    icon: GraduationCap,
    title: "Sponsor a School",
    description: "Partner with us to bring sanitary pad supply and health education to an entire school.",
    action: "Partner With Us",
    featured: false,
    donationType: "school_sponsorship",
    isDonation: true,
  },
  {
    icon: HandHeart,
    title: "Volunteer",
    description: "Join our team as a health educator and help teach girls about menstrual hygiene.",
    action: "Join Us",
    featured: false,
    isDonation: false,
  },
];

export function SupportSection() {
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedDonationType, setSelectedDonationType] = useState("general");

  const handleOptionClick = (option: typeof supportOptions[0]) => {
    if (option.isDonation) {
      setSelectedDonationType(option.donationType || "general");
      setDonationModalOpen(true);
    } else {
      window.location.href = "/contact";
    }
  };

  return (
    <section id="support" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Get Involved
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Help Keep Girls <span className="text-accent">In School</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every sanitary pad you donate means another day a girl stays in school. 
            Join us in ensuring no girl misses her education because of her period.
          </p>
        </div>

        {/* Support Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportOptions.map((option) => (
            <div
              key={option.title}
              className={`relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 ${
                option.featured
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-warm"
                  : "bg-card border border-border shadow-card hover:shadow-soft"
              }`}
            >
              {option.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Needed
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                  option.featured
                    ? "bg-white/20"
                    : "bg-primary/10"
                }`}
              >
                <option.icon
                  className={`w-7 h-7 ${
                    option.featured ? "text-white" : "text-primary"
                  }`}
                />
              </div>

              <h3
                className={`font-serif font-bold text-xl mb-3 ${
                  option.featured ? "text-white" : "text-foreground"
                }`}
              >
                {option.title}
              </h3>

              <p
                className={`text-sm mb-6 ${
                  option.featured ? "text-white/90" : "text-muted-foreground"
                }`}
              >
                {option.description}
              </p>

              <Button
                variant={option.featured ? "heroOutline" : "default"}
                size="sm"
                className="w-full"
                onClick={() => handleOptionClick(option)}
              >
                {option.action}
              </Button>
            </div>
          ))}
        </div>

        {/* Impact Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-card rounded-2xl p-6 shadow-card border border-border">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="text-2xl">💝</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground">
                KES 500 provides sanitary pads for one girl for an entire school term
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                That's 3 months of perfect school attendance
              </p>
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        open={donationModalOpen}
        onOpenChange={setDonationModalOpen}
        defaultType={selectedDonationType}
      />
    </section>
  );
}
