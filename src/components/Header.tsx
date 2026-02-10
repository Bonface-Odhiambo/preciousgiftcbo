import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/impact", label: "Our Impact" },
  { href: "/activities", label: "Activities" },
  { href: "/support", label: "Support Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    closeMobileMenu();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-white/95 rounded-xl p-2">
              <img 
                src={logoImage} 
                alt="Precious Gift CBO Logo" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors animated-underline ${
                  isScrolled || !isHomePage
                    ? "text-foreground hover:text-primary"
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                } ${location.pathname === link.href ? "text-primary" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin button - only visible to admins */}
            {isAdmin && (
              <Link to="/admin">
                <Button variant={isScrolled || !isHomePage ? "default" : "heroOutline"} size="sm" className="ml-2">
                  Admin
                </Button>
              </Link>
            )}
            
            {/* Auth buttons */}
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className={`ml-2 ${isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"}`}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant={isScrolled || !isHomePage ? "outline" : "heroOutline"} size="sm" className="ml-2">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"} />
            ) : (
              <Menu className={isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-background/95 backdrop-blur-md rounded-b-xl animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 text-left text-foreground hover:bg-muted rounded-lg transition-colors ${
                    location.pathname === link.href ? "bg-muted text-primary" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Admin link - only visible to admins */}
              {isAdmin && (
                <Link to="/admin" onClick={closeMobileMenu} className="px-4">
                  <Button variant="default" size="sm" className="w-full mt-2">
                    Admin Panel
                  </Button>
                </Link>
              )}
              
              {/* Auth buttons for mobile */}
              {user ? (
                <div className="px-4 mt-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={closeMobileMenu} className="px-4">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
