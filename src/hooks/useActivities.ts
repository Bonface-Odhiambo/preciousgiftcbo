import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  image_url?: string | null;
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error loading activities",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, "id">) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("activities")
        .insert({
          ...activity,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      setActivities((prev) => [data, ...prev]);
      toast({
        title: "Activity added",
        description: "The new activity has been added successfully.",
      });
      return data;
    } catch (error: any) {
      console.error("Error adding activity:", error);
      toast({
        title: "Error adding activity",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data } : a))
      );
      toast({
        title: "Activity updated",
        description: "The activity has been updated successfully.",
      });
      return data;
    } catch (error: any) {
      console.error("Error updating activity:", error);
      toast({
        title: "Error updating activity",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase.from("activities").delete().eq("id", id);

      if (error) throw error;
      setActivities((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Activity deleted",
        description: "The activity has been removed.",
      });
      return true;
    } catch (error: any) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Error deleting activity",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("activity-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("activity-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
    uploadImage,
    refetch: fetchActivities,
  };
}
