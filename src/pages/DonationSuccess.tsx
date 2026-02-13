import { useNavigate } from "react-router-dom";
import { CheckCircle2, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DonationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-6">
            <div className="relative">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
              <Heart className="w-8 h-8 text-primary absolute -bottom-1 -right-1 fill-current animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl text-green-700 mb-2">
            Thank You for Your Generosity!
          </CardTitle>
          <CardDescription className="text-base">
            Your donation has been successfully processed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              You're Making a Real Difference
            </p>
            <p className="text-muted-foreground">
              Your contribution will help provide sanitary pads and menstrual health education 
              to girls in Siaya County, ensuring they never miss school because of their period.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-sm font-semibold">Education Access</p>
              <p className="text-xs text-muted-foreground mt-1">
                Keeping girls in school
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💝</div>
              <p className="text-sm font-semibold">Dignity & Confidence</p>
              <p className="text-xs text-muted-foreground mt-1">
                Empowering young women
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🌟</div>
              <p className="text-sm font-semibold">Brighter Futures</p>
              <p className="text-xs text-muted-foreground mt-1">
                Creating opportunities
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>A receipt has been sent to your email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Your donation will be used to purchase sanitary pads and educational materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>We'll keep you updated on the impact of your contribution</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Return Home
            </Button>
            <Button
              className="flex-1"
              onClick={() => navigate("/impact")}
            >
              See Our Impact
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Want to do more?{" "}
              <button
                onClick={() => navigate("/#support")}
                className="text-primary hover:underline font-medium"
              >
                Make another donation
              </button>
              {" "}or{" "}
              <button
                onClick={() => navigate("/contact")}
                className="text-primary hover:underline font-medium"
              >
                get involved
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
