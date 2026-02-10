import { Button } from "@/components/ui/button";
import { Heart, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-girls.jpg";

export function HeroSection() {
  const scrollToAbout = () => {
    document.querySelector("#about-preview")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Smiling schoolgirls in Siaya County"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/90 animate-fade-up">
            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
            <span>Siaya County, Kenya</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white hero-text-shadow leading-tight animate-fade-up animation-delay-100">
            Keeping Girls{" "}
            <span className="text-accent">In School</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-fade-up animation-delay-200">
            Providing sanitary pads and menstrual health education so that 
            schoolgirls never miss a single day of learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-up animation-delay-300">
            <Link to="/support">
              <Button variant="hero" size="xl">
                Support Our Mission
              </Button>
            </Link>
            <Link to="/activities">
              <Button variant="heroOutline" size="xl">
                See Our Work
              </Button>
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 max-w-2xl mx-auto animate-fade-up animation-delay-400">
            {[
              { number: "2,500+", label: "Girls Reached" },
              { number: "15+", label: "Schools Served" },
              { number: "5,000+", label: "Pads Distributed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-float"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
