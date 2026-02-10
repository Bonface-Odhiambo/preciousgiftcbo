import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SupportSection } from "@/components/SupportSection";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
};

export default Support;
