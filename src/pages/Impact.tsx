import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImpactSection } from "@/components/ImpactSection";

const Impact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <ImpactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Impact;
