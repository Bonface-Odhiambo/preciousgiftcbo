import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SiteSettings {
  org_name: string;
  org_email: string;
  org_phone: string;
  org_address: string;
  org_tagline: string;
}

const defaultSettings: SiteSettings = {
  org_name: "Precious Gift CBO",
  org_email: "preciousgiftcbo@gmail.com",
  org_phone: "+254 712 345 678",
  org_address: "Siaya County, Kenya",
  org_tagline: "Keeping Girls in School Through Menstrual Health Support",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (error) throw error;

      const settingsMap: Partial<SiteSettings> = {};
      data?.forEach((item) => {
        if (item.key in defaultSettings) {
          settingsMap[item.key as keyof SiteSettings] = item.value || "";
        }
      });

      setSettings({ ...defaultSettings, ...settingsMap });
    } catch (error: any) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const updates = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value,
        updated_by: userData.user?.id,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: update.value, updated_by: update.updated_by })
          .eq("key", update.key);

        if (error) throw error;
      }

      setSettings((prev) => ({ ...prev, ...newSettings }));
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
      return true;
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    updateSettings,
    refetch: fetchSettings,
  };
}
