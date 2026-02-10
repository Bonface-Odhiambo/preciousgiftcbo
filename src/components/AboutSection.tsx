import { Heart, BookOpen, Shield, Target, Users, MapPin, Award, Lightbulb, Calendar, Building } from "lucide-react";
import educationImage from "@/assets/education-workshop.jpg";

const objectives = [
  "Increase knowledge on menstrual health among school-going girls aged 10-18 years",
  "Empower schoolgirls aged 15-24 on entrepreneurial skills to increase ability to access menstrual pads",
  "Increase access to menstrual health products to girls aged 10-18 years",
  "Increase CBO presence and financial sustainability",
];

const targetAudiences = [
  "School Girls aged 10-18 years",
  "Teachers in the implementation sites",
  "Funders (Individual and corporate)",
];

const projectOutcomes = [
  { number: "400", text: "schoolgirls reached with SBC information & education on menstrual health" },
  { number: "500", text: "menstrual health products distributed to girls" },
  { number: "145", text: "girls trained on entrepreneurship, business and leadership" },
];

const projectLocations = [
  "Boro Junior Secondary School",
  "Boro Secondary School", 
  "Pap Boro Junior Secondary School",
];

const keyStrategies = [
  "Conduct SBC activities on menstrual health to girls",
  "Educate teachers on menstrual health to support girls",
  "Conduct entrepreneurship workshops and seminars",
  "Make and disseminate videos on menstrual health",
  "Conduct art-based activities for girls",
];

const menstrualHealthTips = [
  "Be aware of your monthly period times to avoid surprises",
  "Be ready always with a menstrual pad of your choice",
  "Wash your hands before placing and changing pads",
  "Clean genital area often to keep away scents",
  "Change your pads as soon as you feel they are full",
  "Take painkillers if pain is too much / drink lots of water",
  "After removing, wrap pad in tissue & dispose in a bin",
];

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <img
                src={educationImage}
                alt="Community health education session"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-card p-4 md:p-6 rounded-xl shadow-card max-w-[200px] md:max-w-[240px] border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg text-foreground">Since 2025</div>
                  <div className="text-sm text-muted-foreground">Serving Siaya</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Girls Taking Charge
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Zero Missed School Days for{" "}
              <span className="text-primary">Every Girl</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              In Siaya County, many girls miss up to 5 days of school every month simply 
              because they lack access to sanitary pads. This adds up to nearly 2 months 
              of missed education every year—holding them back from their full potential.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Precious Gift CBO provides schoolgirls with quality sanitary pads and 
              comprehensive menstrual health education, ensuring they can attend school 
              every single day with confidence and dignity.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Sanitary Pad Supply</h3>
                  <p className="text-sm text-muted-foreground">
                    Reliable access to quality pads so girls never miss school
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Health Education</h3>
                  <p className="text-sm text-muted-foreground">
                    Teaching girls to manage periods confidently and hygienically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Board 2025 */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Vision Board
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              2025 Goals & Objectives
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Key Objectives */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Key Objectives</h3>
              </div>
              <ul className="space-y-3">
                {objectives.map((obj, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audiences */}
            <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-6 border border-secondary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Target Audiences</h3>
              </div>
              <ul className="space-y-3">
                {targetAudiences.map((audience, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-secondary font-bold shrink-0">{idx + 1}.</span>
                    <span>{audience}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Locations */}
            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-6 border border-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Project Sites</h3>
              </div>
              <ul className="space-y-3">
                {projectLocations.map((location, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold shrink-0">•</span>
                    <span>{location}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                Central Alego Ward, Boro Division, Ojwando Sub-location
              </p>
            </div>
          </div>
        </div>

        {/* Project Outcomes */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
              Priority Outcomes
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Our 2025 Impact Goals
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projectOutcomes.map((outcome, idx) => (
              <div 
                key={idx} 
                className="text-center p-8 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">
                  {outcome.number}+
                </div>
                <p className="text-muted-foreground">{outcome.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Strategies */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              How We Work
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              Our Key Strategies
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyStrategies.map((strategy, idx) => (
              <div 
                key={idx}
                className="flex gap-4 p-5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-foreground">{strategy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menstrual Health Education */}
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-3xl p-8 md:p-12 border border-border">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Let's Talk About Monthly Periods</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Menstrual Health Tips
              </h2>
              <p className="text-muted-foreground mt-2">
                Your monthly period should not be a time of anxiety and worry
              </p>
            </div>

            <div className="grid gap-4">
              {menstrualHealthTips.map((tip, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-foreground pt-1">{tip}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 pt-8 border-t border-border">
              <p className="font-serif text-xl md:text-2xl text-primary italic">
                "There is nothing shameful about your periods! Enjoy life as normal!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
