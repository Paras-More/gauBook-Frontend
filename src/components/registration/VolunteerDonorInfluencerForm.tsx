import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegistrationStore, roleLabels } from "@/stores/registrationStore";
import FormStepIndicator from "./FormStepIndicator";
import SocialMediaFields from "./SocialMediaFields";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/axios/Registrations";
import { showErrorToast, showSuccessToast } from "@/lib/toasts/customToasts";

const steps = ["Basic Info", "Preferences", "Skills & Social", "Review"];

const volunteeringActivities = [
  "Donor",
  "Gau Rakshak",
  "Nursing Care",
  "Veterinary Doctor",
  "Gaushala Cleanliness",
  "Fundraising Support",
  "Social Media Manager",
  "Marketing",
  "Management",
  "Accounting",
  "Transportation",
  "Social Media Influencer",
];

const VolunteerDonorInfluencerForm = () => {
  const {
    selectedRole,
    selectedRoles,
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    resetForm,
    toggleRole,
    profilePhoto,
    setProfilePhoto,
  } = useRegistrationStore();
  const [localData, setLocalData] = useState<Record<string, any>>(formData);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");
  const stepIndex = currentStep - 1;
  const roleName = roleLabels[selectedRole!];

  const update = (data: Record<string, any>) => {
    setLocalData((prev) => ({ ...prev, ...data }));
    // Validate password if it's being updated
    if (data.password !== undefined) {
      if (data.password && data.password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else if (data.password && data.password.length > 0) {
        setPasswordError("");
      } else if (data.password === "") {
        setPasswordError("");
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size must be less than 5MB");
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
  };

  const handleNext = () => {
    // Validate password before moving to next step
    if (localData.password && localData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      toast.error("Please fix password requirements before proceeding");
      return;
    }
    updateFormData(localData);
    if (stepIndex < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) resetForm();
    else setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    updateFormData(localData);

    const formDataToSend = new FormData();

    // Append form data
    formDataToSend.append("fullName", localData.fullName || "");
    formDataToSend.append("mobile", localData.mobile || "");
    formDataToSend.append("email", localData.email || "");
    formDataToSend.append("password", localData.password || "");
    formDataToSend.append("city", localData.city || "");
    formDataToSend.append("district", localData.district || "");
    formDataToSend.append("state", localData.state || "");
    formDataToSend.append("age", localData.age || "");
    formDataToSend.append("gender", localData.gender || "");
    formDataToSend.append("experience", localData.experience || "");
    formDataToSend.append("gaushalasKnown", localData.gaushalasKnown || "");
    formDataToSend.append(
      "activities",
      JSON.stringify(localData.activities || []),
    );
    formDataToSend.append("animalCareExp", localData.animalCareExp || "");
    formDataToSend.append("vetSkills", localData.vetSkills || "");
    formDataToSend.append("hasTransport", localData.hasTransport || false);
    formDataToSend.append("bio", localData.bio || "");
    // Add selectedRole to roles if not already in selectedRoles
    const rolesArray =
      selectedRoles.length > 0 ? selectedRoles : [selectedRole];
    formDataToSend.append("roles", JSON.stringify(rolesArray));
    const {
      enabledPlatforms = [],
      youtubeId,
      youtubeSubscribers,
      youtubeVerified,
      instagramId,
      instagramSubscribers,
      instagramVerified,
      facebookId,
      facebookSubscribers,
      facebookVerified,
      twitterId,
      twitterSubscribers,
      twitterVerified,
      whatsappChannelId,
      whatsappChannelSubscribers,
      whatsappChannelVerified,
      availAnytime,
      weekdayMorning,
      weekdayAfternoon,
      weekdayEvening,
      weekendMorning,
      weekendAfternoon,
      weekendEvening,
      ...rest
    } = localData;

    // Extract social media fields from localData
    const platformMap = {
      youtube: {
        platform: "Youtube",
        id: youtubeId,
        subscribers: youtubeSubscribers,
        verified: youtubeVerified,
      },
      instagram: {
        platform: "Instagram",
        id: instagramId,
        subscribers: instagramSubscribers,
        verified: instagramVerified,
      },
      facebook: {
        platform: "FaceBook",
        id: facebookId,
        subscribers: facebookSubscribers,
        verified: facebookVerified,
      },
      twitter: {
        platform: "X",
        id: twitterId,
        subscribers: twitterSubscribers,
        verified: twitterVerified,
      },
      whatsappChannel: {
        platform: "WhatsApp",
        id: whatsappChannelId,
        subscribers: whatsappChannelSubscribers,
        verified: whatsappChannelVerified,
      },
    };
    const socialMedia = enabledPlatforms
      .map((key: string | number) => {
        const p = platformMap[key];
        if (!p || !p.id) return null;
        return {
          platform: p.platform,
          platformId: p.id,
          subscriberCount: p.subscribers ? Number(p.subscribers) : 0,
          isVerified: !!p.verified,
        };
      })
      .filter(Boolean);

    formDataToSend.append("socialMedia", JSON.stringify(socialMedia));
    const availability = {
      anytime: !!availAnytime,
      weekdayMorning: !!weekdayMorning,
      weekdayAfternoon: !!weekdayAfternoon,
      weekdayEvening: !!weekdayEvening,
      weekendMorning: !!weekendMorning,
      weekendAfternoon: !!weekendAfternoon,
      weekendEvening: !!weekendEvening,
    };
    formDataToSend.append("availability", JSON.stringify(availability));
    // Append profile photo if exists
    if (profilePhoto) {
      formDataToSend.append("profilePhoto", profilePhoto);
    }

    showSuccessToast(`${roleName} registration submitted successfully! 🎉`);
    console.log("Registration data:", {
      ...formData,
      ...localData,
      role: selectedRole,
      selectedRoles: selectedRoles,
      profilePhoto: profilePhoto?.name,
    });
    try {
      const result = await registerUser(formDataToSend);
      console.log("API response:", result);
    } catch (e) {
      showErrorToast("Failed to submit registration. Please try again.");
    }
  };

  const toggleActivity = (activity: string) => {
    const current = localData.activities || [];
    const updated = current.includes(activity)
      ? current.filter((a: string) => a !== activity)
      : [...current, activity];
    update({ activities: updated });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {roleName} Registration
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {selectedRole === "donor"
              ? "Register as a donor to support Gaushalas"
              : selectedRole === "influencer"
                ? "Register as an influencer to promote Gau Seva"
                : "Register as a volunteer to support Gaushalas"}
          </p>
          {selectedRoles.length > 0 && (
            <p className="text-xs text-accent mt-2">
              Selected roles:{" "}
              {selectedRoles.map((r) => roleLabels[r]).join(", ")}
            </p>
          )}
        </div>
        <FormStepIndicator steps={steps} currentStep={stepIndex} />

        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-card">
          {/* STEP 1: Basic Info */}
          {stepIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Basic Information
              </h3>

              {/* Additional Roles Selection */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <Label className="text-sm font-semibold mb-3 block">
                  Additional Roles (Select multiple if interested)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["volunteer", "donor", "influencer"].map((role) => (
                    <div
                      key={role}
                      onClick={() => toggleRole(role as any)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-2 ${
                        selectedRole?.toLowerCase() === role ||
                        selectedRoles.includes(role as any)
                          ? "border-accent bg-accent/10"
                          : "border-gray-300 hover:border-accent/50"
                      }`}
                    >
                      <Checkbox
                        checked={
                          selectedRole?.toLowerCase() === role ||
                          selectedRoles.includes(role as any)
                        }
                        onCheckedChange={() => toggleRole(role as any)}
                        className="cursor-pointer"
                      />
                      <Label className="text-sm font-medium cursor-pointer capitalize">
                        {roleLabels[role as any]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div>
                <Label>Profile Photo</Label>
                <div className="flex gap-4 items-start">
                  {photoPreview && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={removePhoto}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={handlePhotoChange}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Max 5MB. Formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Your full name"
                    value={localData.fullName || ""}
                    onChange={(e) => update({ fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Mobile Number (OTP verified) *</Label>
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    value={localData.mobile || ""}
                    onChange={(e) => update({ mobile: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={localData.email || ""}
                    onChange={(e) => update({ email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={localData.password || ""}
                    onChange={(e) => update({ password: e.target.value })}
                    className={
                      passwordError ? "border-red-500 focus:ring-red-500" : ""
                    }
                  />
                  {passwordError ? (
                    <p className="text-xs text-red-500 mt-1 font-semibold">
                      {passwordError}
                    </p>
                  ) : localData.password ? (
                    <p className="text-xs text-green-500 mt-1 font-semibold">
                      ✓ Password valid
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Min. 8 characters
                    </p>
                  )}
                </div>
                <div>
                  <Label>City *</Label>
                  <Input
                    placeholder="City"
                    value={localData.city || ""}
                    onChange={(e) => update({ city: e.target.value })}
                  />
                </div>
                <div>
                  <Label>District *</Label>
                  <Input
                    placeholder="District"
                    value={localData.district || ""}
                    onChange={(e) => update({ district: e.target.value })}
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <Select
                    value={localData.state || ""}
                    onValueChange={(v) => update({ state: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Andhra Pradesh",
                        "Bihar",
                        "Delhi",
                        "Gujarat",
                        "Haryana",
                        "Karnataka",
                        "Kerala",
                        "Madhya Pradesh",
                        "Maharashtra",
                        "Punjab",
                        "Rajasthan",
                        "Tamil Nadu",
                        "Telangana",
                        "Uttar Pradesh",
                        "West Bengal",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Age (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={localData.age || ""}
                    onChange={(e) => update({ age: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Gender (Optional)</Label>
                  <Select
                    value={localData.gender || ""}
                    onValueChange={(v) => update({ gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <Select
                    value={localData.experience || ""}
                    onValueChange={(v) => update({ experience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Volunteer</SelectItem>
                      <SelectItem value="experienced">
                        Experienced Volunteer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gaushalas Known</Label>
                  <Input
                    placeholder="Names of Gaushalas you know"
                    value={localData.gaushalasKnown || ""}
                    onChange={(e) => update({ gaushalasKnown: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Preferences */}
          {stepIndex === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Volunteering Preferences
              </h3>
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Preferred Activities
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {volunteeringActivities.map((activity) => (
                    <div key={activity} className="flex items-center gap-2">
                      <Checkbox
                        checked={(localData.activities || []).includes(
                          activity,
                        )}
                        onCheckedChange={() => toggleActivity(activity)}
                      />
                      <Label className="text-sm cursor-pointer">
                        {activity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <Label className="text-sm font-semibold mb-3 block">
                  Availability
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.availAnytime || false}
                      onCheckedChange={(c) => update({ availAnytime: c })}
                    />
                    <Label className="text-sm">Anytime</Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary space-y-2">
                      <Label className="text-sm font-medium text-secondary-foreground">
                        Weekdays
                      </Label>
                      {["Morning", "Afternoon", "Evening"].map((t) => (
                        <div
                          key={`wd-${t}`}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={localData[`weekday${t}`] || false}
                            onCheckedChange={(c) =>
                              update({ [`weekday${t}`]: c })
                            }
                          />
                          <Label className="text-xs">{t}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg bg-secondary space-y-2">
                      <Label className="text-sm font-medium text-secondary-foreground">
                        Weekends
                      </Label>
                      {["Morning", "Afternoon", "Evening"].map((t) => (
                        <div
                          key={`we-${t}`}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={localData[`weekend${t}`] || false}
                            onCheckedChange={(c) =>
                              update({ [`weekend${t}`]: c })
                            }
                          />
                          <Label className="text-xs">{t}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Skills & Social */}
          {stepIndex === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Skills & Social Media
              </h3>
              <div>
                <Label>Animal Care Experience</Label>
                <Textarea
                  placeholder="Describe your experience with animal care..."
                  rows={3}
                  value={localData.animalCareExp || ""}
                  onChange={(e) => update({ animalCareExp: e.target.value })}
                />
              </div>
              <div>
                <Label>Veterinary Skills (if any)</Label>
                <Textarea
                  placeholder="Any veterinary training or skills..."
                  rows={2}
                  value={localData.vetSkills || ""}
                  onChange={(e) => update({ vetSkills: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.hasTransport || false}
                    onCheckedChange={(c) => update({ hasTransport: c })}
                  />
                  <Label className="text-sm">
                    Driving / Transport Availability
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.socialMediaCampaign || false}
                    onCheckedChange={(c) => update({ socialMediaCampaign: c })}
                  />
                  <Label className="text-sm">
                    Social Media / Awareness Campaigning
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.eventOrganizing || false}
                    onCheckedChange={(c) => update({ eventOrganizing: c })}
                  />
                  <Label className="text-sm">
                    Event Organizing / Community Outreach
                  </Label>
                </div>
              </div>
              <div className="mt-4">
                <Label>Bio / Description</Label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  rows={3}
                  value={localData.bio || ""}
                  onChange={(e) => update({ bio: e.target.value })}
                />
              </div>
              <SocialMediaFields formData={localData} onChange={update} />
            </motion.div>
          )}

          {/* STEP 4: Review */}
          {stepIndex === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Review & Submit
              </h3>
              <div className="bg-secondary rounded-lg p-5 space-y-3">
                <p className="text-sm text-secondary-foreground">
                  Review your information before submitting.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {selectedRoles.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Roles:</span>{" "}
                      <span className="font-medium">
                        {selectedRoles.map((r) => roleLabels[r]).join(", ")}
                      </span>
                    </div>
                  )}
                  {photoPreview && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Photo:</span>{" "}
                      <span className="font-medium">✓ Uploaded</span>
                    </div>
                  )}
                  {localData.fullName && (
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-medium">{localData.fullName}</span>
                    </div>
                  )}
                  {localData.mobile && (
                    <div>
                      <span className="text-muted-foreground">Mobile:</span>{" "}
                      <span className="font-medium">{localData.mobile}</span>
                    </div>
                  )}
                  {localData.email && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium">{localData.email}</span>
                    </div>
                  )}
                  {localData.city && (
                    <div>
                      <span className="text-muted-foreground">City:</span>{" "}
                      <span className="font-medium">{localData.city}</span>
                    </div>
                  )}
                  {localData.state && (
                    <div>
                      <span className="text-muted-foreground">State:</span>{" "}
                      <span className="font-medium">{localData.state}</span>
                    </div>
                  )}
                  {(localData.activities || []).length > 0 && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Activities:</span>{" "}
                      <span className="font-medium">
                        {localData.activities.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-sage-light rounded-lg">
                <Check className="w-5 h-5 text-accent" />
                <p className="text-sm font-medium">
                  Your {roleName} profile will be created upon submission.
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-5 border-t border-border">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {stepIndex === 0 ? "Change Role" : "Back"}
            </Button>
            {stepIndex === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="gradient-saffron text-primary-foreground shadow-warm hover:opacity-90"
              >
                <Check className="w-4 h-4 mr-2" />
                Submit Registration
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gradient-saffron text-primary-foreground shadow-warm hover:opacity-90"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VolunteerDonorInfluencerForm;
