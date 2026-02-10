 import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Save, X, Calendar, MapPin, Users, FileText, Upload, Loader2, ImageIcon } from "lucide-react";
import { useActivities, type Activity } from "@/hooks/useActivities";
import { activitySchema } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";

export function AdminActivities() {
  const { activities, loading, addActivity, updateActivity, deleteActivity, uploadImage } = useActivities();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Activity>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleEdit = (activity: Activity) => {
    setIsEditing(activity.id);
    setFormData(activity);
    setImagePreview(activity.image_url || null);
    setImageFile(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      participants: 0,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({});
    setImageFile(null);
    setImagePreview(null);
    setValidationErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Validate form data using zod schema
    const validationResult = activitySchema.safeParse({
      title: formData.title || "",
      description: formData.description || "",
      location: formData.location || "",
      date: formData.date || "",
      participants: formData.participants || 0,
      image_url: formData.image_url || null,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setValidationErrors({});
    setIsSaving(true);
    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      if (isAdding) {
        await addActivity({
          title: validationResult.data.title,
          description: validationResult.data.description,
          date: validationResult.data.date,
          location: validationResult.data.location,
          participants: validationResult.data.participants,
          image_url: imageUrl,
        });
      } else if (isEditing) {
        await updateActivity(isEditing, {
          ...validationResult.data,
          image_url: imageUrl,
        });
      }

      handleCancel();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteActivity(id);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Manage Activities
          </h2>
          <p className="text-muted-foreground mt-1">
            Add, edit, or remove activities displayed on your website.
          </p>
        </div>
        <Button onClick={handleAdd} variant="hero" disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditing) && (
        <Card className="border-primary/20 shadow-warm">
          <CardHeader>
            <CardTitle className="font-serif">
              {isAdding ? "Add New Activity" : "Edit Activity"}
            </CardTitle>
            <CardDescription>
              {isAdding
                ? "Create a new activity to display on your website."
                : "Update the details of this activity."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Menstrual Hygiene Workshop"
                  className={validationErrors.title ? "border-destructive" : ""}
                />
                {validationErrors.title && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className={validationErrors.date ? "border-destructive" : ""}
                />
                {validationErrors.date && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Participants
                </label>
                <Input
                  type="number"
                  value={formData.participants || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      participants: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Number of participants"
                  className={validationErrors.participants ? "border-destructive" : ""}
                />
                {validationErrors.participants && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.participants}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Usenge Primary School, Bondo"
                  className={validationErrors.location ? "border-destructive" : ""}
                />
                {validationErrors.location && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.location}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what happened at this activity..."
                  rows={4}
                  className={validationErrors.description ? "border-destructive" : ""}
                />
                {validationErrors.description && (
                  <p className="text-sm text-destructive mt-1">{validationErrors.description}</p>
                )}
              </div>
              
              {/* Image Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Activity Image
                </label>
                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData({ ...formData, image_url: null });
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="relative w-full max-w-sm h-48 rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!imagePreview && (
                    <div className="flex items-center justify-center w-full max-w-sm h-32 rounded-lg border-2 border-dashed border-border bg-muted/20">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No image selected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} variant="default" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isAdding ? "Add Activity" : "Save Changes"}
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  {activity.image_url && (
                    <div className="hidden sm:block w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-border">
                      <img
                        src={activity.image_url}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-accent" />
                        <span>{activity.participants} participants</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(activity)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDelete(activity.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif font-bold text-lg text-foreground mb-2">
              No activities yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first activity.
            </p>
            <Button onClick={handleAdd} variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
