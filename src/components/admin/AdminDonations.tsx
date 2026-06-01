import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  amount: number;
  currency: string;
  payment_method: string;
  payment_reference: string;
  payment_status: string;
  transaction_id: string | null;
  donation_type: string | null;
  message: string | null;
  is_anonymous: boolean | null;
  card_last4: string | null;
  created_at: string;
  updated_at: string;
}

export function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "success" | "pending" | "failed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setDonations(data);
    }
    setLoading(false);
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesFilter =
      filter === "all" || donation.payment_status === filter;
    const matchesSearch =
      donation.donor_name.toLowerCase().includes(search.toLowerCase()) ||
      donation.donor_email.toLowerCase().includes(search.toLowerCase()) ||
      donation.payment_reference.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Donations
        </h2>
        <p className="text-muted-foreground mt-1">
          View and manage all donations. Card last 4 digits are stored for tracking purposes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Donations</div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {donations.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Successful</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {donations.filter((d) => d.payment_status === "success").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-bold text-primary mt-1">
              {formatCurrency(
                donations
                  .filter((d) => d.payment_status === "success")
                  .reduce((sum, d) => sum + d.amount, 0),
                "KES"
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Cards on File</div>
            <div className="text-2xl font-bold text-accent mt-1">
              {donations.filter((d) => d.card_last4).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "success" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("success")}
          >
            Successful
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "failed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("failed")}
          >
            Failed
          </Button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
          />
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.map((donation) => (
          <Card key={donation.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {donation.is_anonymous ? "Anonymous" : donation.donor_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{donation.donor_email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(donation.payment_status)}
                      <span className="text-sm font-medium capitalize">
                        {donation.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="font-semibold">
                        {formatCurrency(donation.amount, donation.currency)}
                      </span>
                    </div>
                    {donation.card_last4 && (
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          **** {donation.card_last4}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(donation.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {donation.donation_type && (
                    <div className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {donation.donation_type.replace(/_/g, " ")}
                    </div>
                  )}

                  {donation.message && (
                    <p className="text-sm text-muted-foreground italic">
                      "{donation.message}"
                    </p>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Ref: {donation.payment_reference}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDonations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                No donations found
              </h3>
              <p className="text-muted-foreground">
                {search ? "Try a different search term" : "No donations have been made yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
