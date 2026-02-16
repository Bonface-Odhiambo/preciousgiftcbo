import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paystackService, epaymentlyService } from "@/lib/payment";

export default function DonationCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [donationDetails, setDonationDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference") || searchParams.get("trxref");
      const provider = searchParams.get("method") || "paystack";

      if (!reference) {
        setStatus("failed");
        setMessage("Invalid payment reference");
        return;
      }

      try {
        let result;
        
        if (provider === "paystack") {
          result = await paystackService.verifyPayment(reference);
        } else if (provider === "epaymently") {
          result = await epaymentlyService.verifyPayment(reference);
        }

        if (result.success) {
          setStatus("success");
          setMessage("Thank you for your generous donation!");
          setDonationDetails(result.data);
        } else {
          setStatus("failed");
          setMessage(result.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
        setMessage("An error occurred while verifying your payment");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {status === "verifying" && (
            <>
              <div className="mx-auto mb-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </div>
              <CardTitle>Verifying Payment</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="mx-auto mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-green-700">Payment Successful!</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
          
          {status === "failed" && (
            <>
              <div className="mx-auto mb-4">
                <XCircle className="w-16 h-16 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Payment Failed</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "success" && donationDetails && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">
                  KES {(donationDetails.amount / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-mono text-xs">{donationDetails.reference}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-semibold">Successful</span>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-center">
                A receipt has been sent to your email address. Your contribution will help keep girls in school!
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>
            {status === "failed" && (
              <Button
                className="flex-1"
                onClick={() => navigate("/#support")}
              >
                Try Again
              </Button>
            )}
            {status === "success" && (
              <Button
                className="flex-1"
                onClick={() => navigate("/impact")}
              >
                See Our Impact
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
