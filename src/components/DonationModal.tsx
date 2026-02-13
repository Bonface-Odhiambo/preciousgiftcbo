import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Loader2, Heart } from "lucide-react";
import { paystackService, epaymentService, type DonationData } from "@/lib/payment";
import { useToast } from "@/hooks/use-toast";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: string;
  defaultAmount?: number;
}

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const DONATION_TYPES = [
  { value: "sanitary_pads", label: "Sanitary Pads Donation" },
  { value: "financial_support", label: "Financial Support" },
  { value: "school_sponsorship", label: "School Sponsorship" },
  { value: "general", label: "General Donation" },
];

export function DonationModal({ open, onOpenChange, defaultType = "general", defaultAmount }: DonationModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "epayment">("paystack");
  
  const [formData, setFormData] = useState({
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    amount: defaultAmount || 0,
    customAmount: "",
    donation_type: defaultType,
    message: "",
    is_anonymous: false,
  });

  const handleAmountSelect = (amount: number) => {
    setFormData({ ...formData, amount, customAmount: "" });
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, customAmount: value, amount: numValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.donor_name || !formData.donor_email || formData.amount <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select an amount.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donor_email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const donationData: DonationData = {
        donor_name: formData.donor_name,
        donor_email: formData.donor_email,
        donor_phone: formData.donor_phone,
        amount: formData.amount,
        currency: "KES",
        donation_type: formData.donation_type,
        message: formData.message,
        is_anonymous: formData.is_anonymous,
      };

      let result;

      if (paymentMethod === "paystack") {
        result = await paystackService.openPaymentModal(donationData);
      } else {
        result = await epaymentService.initializePayment(donationData);
        if (result.success && result.authorization_url) {
          window.location.href = result.authorization_url;
          return;
        }
      }

      if (result.success) {
        toast({
          title: "Thank You!",
          description: "Your donation has been processed successfully.",
        });
        onOpenChange(false);
        setFormData({
          donor_name: "",
          donor_email: "",
          donor_phone: "",
          amount: 0,
          customAmount: "",
          donation_type: defaultType,
          message: "",
          is_anonymous: false,
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Unable to process payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Donation error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-primary" />
            Make a Donation
          </DialogTitle>
          <DialogDescription>
            Your contribution helps keep girls in school by providing sanitary pads and menstrual health education.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donation Type */}
          <div className="space-y-2">
            <Label>Donation Type</Label>
            <RadioGroup
              value={formData.donation_type}
              onValueChange={(value) => setFormData({ ...formData, donation_type: value })}
            >
              {DONATION_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="font-normal cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>Donation Amount (KES)</Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount && !formData.customAmount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(amount)}
                  className="h-12"
                >
                  KES {amount.toLocaleString()}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Custom amount"
                value={formData.customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min="1"
                className="pl-12"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                KES
              </span>
            </div>
            {formData.amount >= 500 && (
              <p className="text-sm text-muted-foreground">
                💝 KES {formData.amount.toLocaleString()} can provide sanitary pads for{" "}
                {Math.floor(formData.amount / 500)} girl(s) for an entire school term!
              </p>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donor_name">Full Name *</Label>
              <Input
                id="donor_name"
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor_email">Email Address *</Label>
              <Input
                id="donor_email"
                type="email"
                value={formData.donor_email}
                onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor_phone">Phone Number (Optional)</Label>
              <Input
                id="donor_phone"
                type="tel"
                value={formData.donor_phone}
                onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                placeholder="+254 700 000 000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Leave a message of support..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={formData.is_anonymous}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_anonymous: checked as boolean })
                }
              />
              <Label htmlFor="anonymous" className="font-normal cursor-pointer">
                Make this donation anonymous
              </Label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "paystack" | "epayment")}
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="paystack" id="paystack" />
                <Label htmlFor="paystack" className="font-normal cursor-pointer flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Paystack (Card, M-Pesa, Bank)</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="epayment" id="epayment" />
                <Label htmlFor="epayment" className="font-normal cursor-pointer flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>ePayment (Card Payment)</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || formData.amount <= 0}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Donate KES {formData.amount.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
