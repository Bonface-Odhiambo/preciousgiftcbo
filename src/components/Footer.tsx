import { Heart, Mail, Phone, MapPin, ArrowUpRight, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/impact", label: "Our Impact" },
    { href: "/activities", label: "Activities" },
    { href: "/support", label: "Support Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-secondary/20 to-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      <div className="relative container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-5">
              <Link to="/" className="inline-flex flex-col gap-2 mb-6 group">
                <div className="bg-white/95 rounded-xl p-3 w-fit">
                  <img 
                    src={logoImage} 
                    alt="Precious Gift CBO Logo" 
                    className="h-14 w-auto object-contain"
                  />
                </div>
                <span className="text-sm text-background/60">Siaya County, Kenya</span>
              </Link>
              
              <p className="text-background/70 text-lg leading-relaxed max-w-md mb-8">
                Keeping girls in school by providing sanitary pads and menstrual health 
                education. No girl should miss school because of her period.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a 
                  href="#" 
                  className="w-11 h-11 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-11 h-11 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-11 h-11 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links Column */}
            <div className="lg:col-span-3">
              <h4 className="font-serif font-semibold text-lg text-background mb-6">
                Explore
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="lg:col-span-4">
              <h4 className="font-serif font-semibold text-lg text-background mb-6">
                Get in Touch
              </h4>
              <ul className="space-y-5">
                <li>
                  <a 
                    href="mailto:info@preciousgiftcbo.org" 
                    className="group flex items-start gap-4 text-background/70 hover:text-background transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center shrink-0 transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm text-background/50 block">Email us</span>
                      <span className="font-medium">info@preciousgiftcbo.org</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+254700000000" 
                    className="group flex items-start gap-4 text-background/70 hover:text-background transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center shrink-0 transition-all duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm text-background/50 block">Call us</span>
                      <span className="font-medium">+254 700 000 000</span>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-4 text-background/70">
                  <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm text-background/50 block">Visit us</span>
                    <span className="font-medium">Siaya Town, Siaya County, Kenya</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {currentYear} Precious Gift CBO. All rights reserved.
            </p>
            <p className="text-sm text-background/60 flex items-center gap-2">
              Made with 
              <Heart className="w-4 h-4 text-primary animate-pulse" fill="currentColor" /> 
              for girls in Siaya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
