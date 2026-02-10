import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function AdminSettings() {
  const { settings, loading, saving, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async () => {
    await updateSettings(formData);
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
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Site Settings
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your organization's information displayed across the website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Organization Information</CardTitle>
          <CardDescription>
            Update your organization's name, contact details, and tagline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Organization Name
            </label>
            <Input
              value={formData.org_name}
              onChange={(e) =>
                setFormData({ ...formData, org_name: e.target.value })
              }
              placeholder="e.g., Precious Gift CBO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tagline
            </label>
            <Textarea
              value={formData.org_tagline}
              onChange={(e) =>
                setFormData({ ...formData, org_tagline: e.target.value })
              }
              placeholder="A short description of your mission"
              rows={2}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.org_email}
                onChange={(e) =>
                  setFormData({ ...formData, org_email: e.target.value })
                }
                placeholder="contact@organization.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <Input
                value={formData.org_phone}
                onChange={(e) =>
                  setFormData({ ...formData, org_phone: e.target.value })
                }
                placeholder="+254 712 345 678"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Address
            </label>
            <Input
              value={formData.org_address}
              onChange={(e) =>
                setFormData({ ...formData, org_address: e.target.value })
              }
              placeholder="Siaya County, Kenya"
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-secondary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <span className="text-lg">ℹ️</span>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Where are these settings used?
              </h4>
              <p className="text-sm text-muted-foreground">
                These settings are displayed in the website footer, contact page, 
                and other areas where your organization's information appears.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
