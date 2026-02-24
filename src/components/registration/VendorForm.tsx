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
import { useRegistrationStore } from "@/stores/registrationStore";
import FormStepIndicator from "./FormStepIndicator";
import SocialMediaFields from "./SocialMediaFields";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { registerVendor } from "@/axios/Registrations";

const steps = ["Business Info", "Products & Services", "Review"];

const VendorForm = () => {
  const {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    resetForm,
    selectedRole,
  } = useRegistrationStore();
  const [localData, setLocalData] = useState<Record<string, any>>(formData);
  const [passwordError, setPasswordError] = useState<string>("");
  const stepIndex = currentStep - 1;

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
    formDataToSend.append("role", selectedRole);
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
      ...rest
    } = localData;
    // Build socialMedia array
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
    // Append other form data
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) {
        formDataToSend.append(key, String(value));
      }
    });
    try {
      const response = await registerVendor(formDataToSend);
      toast.success("Vendor registration submitted successfully! 🎉");
    } catch (error) {
      toast.error("Error submitting registration. Please try again.");
      return;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Vendor Registration
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            List your products and services for Gaushalas
          </p>
        </div>
        <FormStepIndicator steps={steps} currentStep={stepIndex} />

        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-card">
          {/* STEP 1: Business Info */}
          {stepIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Business / Company Name *</Label>
                  <Input
                    placeholder="Business name"
                    value={localData.businessName || ""}
                    onChange={(e) => update({ businessName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Contact Person Name *</Label>
                  <Input
                    placeholder="Full name"
                    value={localData.contactPerson || ""}
                    onChange={(e) => update({ contactPerson: e.target.value })}
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
                      ❌ {passwordError}
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
                  <Label>Business Type *</Label>
                  <Select
                    value={localData.businessType || ""}
                    onValueChange={(v) => update({ businessType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fodder">Fodder Supplier</SelectItem>
                      <SelectItem value="medical">
                        Medical / Veterinary
                      </SelectItem>
                      <SelectItem value="equipment">
                        Equipment & Tools
                      </SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="construction">
                        Construction / Shelter
                      </SelectItem>
                      <SelectItem value="feed">Animal Feed</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>GST Number</Label>
                  <Input
                    placeholder="GST number"
                    value={localData.gstNumber || ""}
                    onChange={(e) => update({ gstNumber: e.target.value })}
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
                        "Delhi",
                        "Gujarat",
                        "Haryana",
                        "Karnataka",
                        "Madhya Pradesh",
                        "Maharashtra",
                        "Punjab",
                        "Rajasthan",
                        "Tamil Nadu",
                        "Uttar Pradesh",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City / District *</Label>
                  <Input
                    placeholder="City or District"
                    value={localData.city || ""}
                    onChange={(e) => update({ city: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Pincode *</Label>
                  <Input
                    placeholder="6-digit pincode"
                    maxLength={6}
                    value={localData.pincode || ""}
                    onChange={(e) => update({ pincode: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Service Area Radius (km)</Label>
                  <Input
                    placeholder="e.g. 50"
                    type="number"
                    value={localData.serviceRadius || ""}
                    onChange={(e) => update({ serviceRadius: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Full Address</Label>
                  <Textarea
                    placeholder="Complete business address"
                    rows={2}
                    value={localData.address || ""}
                    onChange={(e) => update({ address: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Profile Photo / Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                />
              </div>
              <div>
                <Label>Bio / Description</Label>
                <Textarea
                  placeholder="About your business..."
                  rows={3}
                  value={localData.bio || ""}
                  onChange={(e) => update({ bio: e.target.value })}
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  placeholder="https://"
                  value={localData.website || ""}
                  onChange={(e) => update({ website: e.target.value })}
                />
              </div>
              <SocialMediaFields formData={localData} onChange={update} />
            </motion.div>
          )}

          {/* STEP 2: Products & Services */}
          {stepIndex === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Products & Services
              </h3>
              <div>
                <Label>Products / Services Offered *</Label>
                <Textarea
                  placeholder="List your main products and services, one per line..."
                  rows={5}
                  value={localData.productsServices || ""}
                  onChange={(e) => update({ productsServices: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Delivery Available?</Label>
                  <Select
                    value={localData.deliveryAvailable || ""}
                    onValueChange={(v) => update({ deliveryAvailable: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="conditional">
                        Conditional (based on order)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select
                    value={localData.paymentTerms || ""}
                    onValueChange={(v) => update({ paymentTerms: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advance">Advance</SelectItem>
                      <SelectItem value="delivery">On Delivery</SelectItem>
                      <SelectItem value="credit">Credit (30 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Product Images / Catalogue</Label>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload images or PDF catalogue
                </p>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Additional Capabilities
                </Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.bulkOrders || false}
                      onCheckedChange={(c) => update({ bulkOrders: c })}
                    />
                    <Label className="text-sm">Accept Bulk Orders</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.customOrders || false}
                      onCheckedChange={(c) => update({ customOrders: c })}
                    />
                    <Label className="text-sm">Custom / Made-to-Order</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.emergencyService || false}
                      onCheckedChange={(c) => update({ emergencyService: c })}
                    />
                    <Label className="text-sm">
                      Emergency / Urgent Service
                    </Label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Review */}
          {stepIndex === 2 && (
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
                  {localData.businessName && (
                    <div>
                      <span className="text-muted-foreground">Business:</span>{" "}
                      <span className="font-medium">
                        {localData.businessName}
                      </span>
                    </div>
                  )}
                  {localData.contactPerson && (
                    <div>
                      <span className="text-muted-foreground">Contact:</span>{" "}
                      <span className="font-medium">
                        {localData.contactPerson}
                      </span>
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
                  {localData.businessType && (
                    <div>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      <span className="font-medium capitalize">
                        {localData.businessType}
                      </span>
                    </div>
                  )}
                  {localData.city && (
                    <div>
                      <span className="text-muted-foreground">Location:</span>{" "}
                      <span className="font-medium">{localData.city}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-sage-light rounded-lg">
                <Check className="w-5 h-5 text-accent" />
                <p className="text-sm font-medium">
                  You'll be notified when relevant need requests are posted
                  nearby.
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

export default VendorForm;
