import { useEffect, useRef, useState } from "react";

interface StatItem {
  number: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  {
    number: 2500,
    suffix: "+",
    label: "Girls Supported",
    description: "Schoolgirls receiving sanitary pads and health education",
  },
  {
    number: 15,
    suffix: "+",
    label: "Schools Reached",
    description: "Partner schools across Siaya County",
  },
  {
    number: 5000,
    suffix: "+",
    label: "Pads Distributed",
    description: "Sanitary products provided to keep girls in school",
  },
  {
    number: 100,
    suffix: "%",
    label: "School Attendance",
    description: "Our goal: zero missed days due to periods",
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="stat-number text-primary">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function ImpactSection() {
  return (
    <section id="impact" className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Every Pad Means{" "}
            <span className="text-secondary">Another Day in School</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            When girls have access to sanitary products and understand their bodies, 
            they stay in school and build brighter futures.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border card-hover text-center"
            >
              <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              <h3 className="font-semibold text-lg text-foreground mt-2 mb-2">
                {stat.label}
              </h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center">
          <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-white/95 italic max-w-3xl mx-auto">
            "Before I received sanitary pads from Precious Gift, I missed school every month. 
            Now I never miss a day, and my grades have improved so much!"
          </blockquote>
          <div className="mt-6 text-white/80">
            <span className="font-semibold">— Akinyi, 14</span>
            <span className="block text-sm mt-1">Student, Siaya County</span>
          </div>
        </div>
      </div>
    </section>
  );
}
