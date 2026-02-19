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
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

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
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    resetForm,
  } = useRegistrationStore();
  const [localData, setLocalData] = useState<Record<string, any>>(formData);
  const stepIndex = currentStep - 1;
  const roleName = roleLabels[selectedRole!];

  const update = (data: Record<string, any>) => {
    setLocalData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    updateFormData(localData);
    if (stepIndex < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) resetForm();
    else setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    updateFormData(localData);
    toast.success(`${roleName} registration submitted successfully! 🎉`);
    console.log("Registration data:", {
      ...formData,
      ...localData,
      role: selectedRole,
    });
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
                <div className="md:col-span-2">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
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
