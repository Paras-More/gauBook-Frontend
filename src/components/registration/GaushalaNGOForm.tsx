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
import NumericInput from "./NumericInput";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { registerGaushala, registerNgo } from "@/axios/Registrations";
import { showErrorToast, showSuccessToast } from "@/lib/toasts/customToasts";

const gaushalaNgoSteps = [
  "Basic Info",
  "Documents",
  "Infrastructure",
  "Cattle & Media",
  "Review",
];

const GaushalaNGOForm = () => {
  const {
    selectedRole,
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    resetForm,
  } = useRegistrationStore();
  const [localData, setLocalData] = useState<Record<string, any>>(formData);
  // File state: store selected files for each field
  const [fileState, setFileState] = useState<{
    registrationCertificate?: File | null;
    certificate80G?: File | null;
    profilePhotos?: File[];
    gaushalaMedia?: File[];
  }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordError, setPasswordError] = useState<string>("");
  const isNGO = selectedRole === "ngo";
  const steps = isNGO
    ? ["Basic Info", "Documents", "Operations", "Review"]
    : gaushalaNgoSteps;

  const stepIndex = currentStep - 1; // step 0 is role selection

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

  // File input change handler
  const handleFileChange = (
    field: string,
    files: FileList | null,
    multiple = false,
  ) => {
    setFileState((prev) => {
      if (!files) return prev;
      if (multiple) {
        return { ...prev, [field]: Array.from(files) };
      } else {
        return { ...prev, [field]: files[0] || null };
      }
    });
  };

  // Validation for required fields on first step
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!localData.name || localData.name.trim() === "")
      newErrors.name = "Name is required";
    if (!localData.yearEstablished || localData.yearEstablished.trim() === "")
      newErrors.yearEstablished = "Year is required";
    if (!localData.legalStatus || localData.legalStatus.trim() === "")
      newErrors.legalStatus = "Legal status is required";
    if (
      !localData.registrationNumber ||
      localData.registrationNumber.trim() === ""
    )
      newErrors.registrationNumber = "Registration number is required";
    if (!localData.contactPerson || localData.contactPerson.trim() === "")
      newErrors.contactPerson = "Contact person is required";
    if (!localData.mobile || localData.mobile.trim() === "")
      newErrors.mobile = "Mobile number is required";
    if (!localData.email || localData.email.trim() === "")
      newErrors.email = "Email is required";
    if (!localData.state || localData.state.trim() === "")
      newErrors.state = "State is required";
    if (!localData.district || localData.district.trim() === "")
      newErrors.district = "District is required";
    if (!localData.password || localData.password.trim() === "")
      newErrors.password = "Password is required";
    if (localData.password && localData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";

    // Add more validations as needed
    // Only validate these fields for non-NGO  i.e(Gaushala) forms
    if (!isNGO) {
      if (!localData.capacity || localData.capacity.toString().trim() === "")
        newErrors.capacity = "Gaushala capacity is required";
      if (
        !localData.staffCount ||
        localData.staffCount.toString().trim() === ""
      )
        newErrors.staffCount = "Permanent staff count is required";
      if (
        !localData.adoptionCharges ||
        localData.adoptionCharges.toString().trim() === ""
      )
        newErrors.adoptionCharges =
          "Charges for adopting milking cow are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    console.log("Validate 2 called", localData?.pan);

    const newErrors: Record<string, string> = {};
    if (
      !localData.pan ||
      localData.pan.trim() === "" ||
      localData.pan?.length !== 10
    )
      newErrors.pan = "Valid PAN number is required";
    // Add more validations for document uploads if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    // Only for Gaushala (not NGO)
    if (!isNGO) {
      if (!localData.landArea || localData.landArea.trim() === "")
        newErrors.landArea = "Total Land Area is required";
      if (
        !localData.cowCapacity ||
        localData.cowCapacity.toString().trim() === ""
      )
        newErrors.cowCapacity = "Total Cow Capacity is required";
      if (
        !localData.vehicleCount ||
        localData.vehicleCount.toString().trim() === ""
      )
        newErrors.vehicleCount = "Number of 4W Vehicles is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!isNGO) {
      if (
        !localData.nandiCount ||
        localData.nandiCount.toString().trim() === ""
      )
        newErrors.nandiCount = "Nandi Count is required";
      if (
        !localData.milkingCowCount ||
        localData.milkingCowCount.toString().trim() === ""
      )
        newErrors.milkingCowCount = "Milking Cow Count is required";
      if (
        !localData.nonMilkingCowCount ||
        localData.nonMilkingCowCount.toString().trim() === ""
      )
        newErrors.nonMilkingCowCount = "Non-Milking Cow Count is required";
      if (
        !localData.maleCalfCount ||
        localData.maleCalfCount.toString().trim() === ""
      )
        newErrors.maleCalfCount = "Male Calf Count is required";
      if (
        !localData.femaleCalfCount ||
        localData.femaleCalfCount.toString().trim() === ""
      )
        newErrors.femaleCalfCount = "Female Calf Count is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // if (stepIndex === 0) {
    //   if (!validateStep1()) {
    //     return;
    //   }
    // } else if (stepIndex === 1) {
    //   if (!validateStep2()) {
    //     return;
    //   }
    // } else if (stepIndex === 2) {
    //   if (!validateStep3()) {
    //     return;
    //   }
    // } else if (stepIndex === 3) {
    //   if (!validateStep4()) {
    //     return;
    //   }
    // }
    updateFormData(localData);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      resetForm();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    updateFormData(localData);
    // Prepare FormData
    const formDataToSend = new FormData();

    // Transform localData to new payload format
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

    // Compose final payload: append each field individually for backend compatibility
    const payloadFields = {
      ...rest,
      verificationStatus: "pending",
    };
    // Append all non-file fields
    Object.entries(payloadFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, value);
      }
    });
    // Append socialMedia as JSON string (array)
    formDataToSend.append("socialMedia", JSON.stringify(socialMedia));

    // Attach files from fileState
    if (fileState.registrationCertificate) {
      formDataToSend.append(
        "registrationCertificate",
        fileState.registrationCertificate,
      );
    }
    if (isNGO && fileState.certificate80G) {
      formDataToSend.append("certificate80G", fileState.certificate80G);
    }
    if (fileState.profilePhotos && fileState.profilePhotos.length > 0) {
      fileState.profilePhotos.forEach((file) => {
        formDataToSend.append("profilePhotos", file);
      });
    }
    if (
      !isNGO &&
      fileState.gaushalaMedia &&
      fileState.gaushalaMedia.length > 0
    ) {
      fileState.gaushalaMedia.forEach((file) => {
        formDataToSend.append("gaushalaMedia", file);
      });
    }

    try {
      console.log(formDataToSend);

      if (!isNGO) {
        await registerGaushala(formDataToSend);
      } else {
        await registerNgo(formDataToSend);
      }
      showSuccessToast(
        `${roleLabels[selectedRole!]} registration submitted successfully! 🎉`,
      );
    } catch (error: any) {
      let message = "Registration failed. Please try again.";
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      showErrorToast(message);
    }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {isNGO ? "NGO" : "Gaushala"} Registration
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in all details to complete registration
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
                  <Label>{isNGO ? "NGO Name" : "Gaushala Name"} *</Label>
                  <Input
                    type="text"
                    placeholder="As per registration documents"
                    value={localData.name || ""}
                    onChange={(e) => {
                      const textOnly = e.target.value.replace(/[0-9]/g, "");
                      update({ name: textOnly });
                    }}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Year of Establishment *</Label>
                  <Input
                    placeholder="e.g. 2005"
                    type="text"
                    inputMode="numeric"
                    value={localData.yearEstablished || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 4) {
                        update({ yearEstablished: value });
                        // Validate year if provided
                        if (value.length === 4) {
                          const year = parseInt(value, 10);
                          const currentYear = new Date().getFullYear();
                          if (year < 1800 || year > currentYear) {
                            setErrors((prev) => ({
                              ...prev,
                              yearEstablished: "Please add a valid year",
                            }));
                          } else {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.yearEstablished;
                              return newErrors;
                            });
                          }
                        } else if (value.length === 0) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.yearEstablished;
                            return newErrors;
                          });
                        }
                      }
                    }}
                    className={errors.yearEstablished ? "border-red-500" : ""}
                  />
                  {errors.yearEstablished && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.yearEstablished}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Legal Status *</Label>
                  <Select
                    value={localData.legalStatus || ""}
                    onValueChange={(v) => update({ legalStatus: v })}
                  >
                    <SelectTrigger
                      className={errors.legalStatus ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select legal status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trust">Trust</SelectItem>
                      <SelectItem value="society">Society</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="private">Private Gaushala</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.legalStatus && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.legalStatus}
                    </div>
                  )}
                </div>
                <div>
                  <Label>{isNGO ? "NGO" : "Trust"} Registration Number *</Label>
                  <Input
                    placeholder="Registration number"
                    value={localData.registrationNumber || ""}
                    onChange={(e) =>
                      update({ registrationNumber: e.target.value })
                    }
                    className={
                      errors.registrationNumber ? "border-red-500" : ""
                    }
                  />
                  {errors.registrationNumber && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.registrationNumber}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Contact Person Name *</Label>
                  <Input
                    placeholder="Full name"
                    type="text"
                    value={localData.contactPerson || ""}
                    onChange={(e) => {
                      const textOnly = e.target.value.replace(/[0-9]/g, "");
                      update({ contactPerson: textOnly });
                    }}
                    className={errors.contactPerson ? "border-red-500" : ""}
                  />
                  {errors.contactPerson && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.contactPerson}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input
                    placeholder="e.g. Manager, Trustee"
                    type="text"
                    value={localData.designation || ""}
                    onChange={(e) => {
                      const textOnly = e.target.value.replace(/[0-9]/g, "");
                      update({ designation: textOnly });
                    }}
                  />
                </div>
                <div>
                  <Label>Mobile Number (OTP verified) *</Label>
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={localData.mobile || ""}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, "");
                      if (numbersOnly.length <= 10) {
                        update({ mobile: numbersOnly });
                        // Validate mobile if 10 digits provided
                        if (numbersOnly.length === 10) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.mobile;
                            return newErrors;
                          });
                        } else if (
                          numbersOnly.length > 0 &&
                          numbersOnly.length < 10
                        ) {
                          setErrors((prev) => ({
                            ...prev,
                            mobile: "Mobile number must be exactly 10 digits",
                          }));
                        } else if (numbersOnly.length === 0) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.mobile;
                            return newErrors;
                          });
                        }
                      }
                    }}
                    className={errors.mobile ? "border-red-500" : ""}
                  />
                  {errors.mobile && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.mobile}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    value={localData.email || ""}
                    onChange={(e) => update({ email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={localData.password || ""}
                    onChange={(e) => update({ password: e.target.value })}
                    className={
                      passwordError
                        ? "border-red-500 focus:ring-red-500"
                        : errors.password
                          ? "border-red-500"
                          : ""
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
                  <Label>State *</Label>
                  <Select
                    value={localData.state || ""}
                    onValueChange={(v) => update({ state: v })}
                  >
                    <SelectTrigger
                      className={errors.state ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.state}
                    </div>
                  )}
                </div>
                <div>
                  <Label>District *</Label>
                  <Input
                    placeholder="District"
                    value={localData.district || ""}
                    onChange={(e) => update({ district: e.target.value })}
                    className={errors.district ? "border-red-500" : ""}
                  />
                  {errors.district && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.district}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>{isNGO ? "City" : "Village/Town"}</Label>
                  <Input
                    placeholder={isNGO ? "City" : "Village / Town"}
                    value={localData.city || ""}
                    onChange={(e) => update({ city: e.target.value })}
                  />
                </div>
                {isNGO && (
                  <div className="md:col-span-2">
                    <Label>Areas of Operation</Label>
                    <Input
                      placeholder="e.g. Animal welfare, Rural development"
                      value={localData.areasOfOperation || ""}
                      onChange={(e) =>
                        update({ areasOfOperation: e.target.value })
                      }
                    />
                  </div>
                )}
                {!isNGO && (
                  <>
                    <div>
                      <Label>Alternate Mobile 1</Label>
                      <Input
                        placeholder="Alternate number"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={localData.altMobile1 || ""}
                        onChange={(e) => {
                          const numbersOnly = e.target.value.replace(/\D/g, "");
                          if (numbersOnly.length <= 10) {
                            update({ altMobile1: numbersOnly });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>Alternate Mobile 2</Label>
                      <Input
                        placeholder="Alternate number"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={localData.altMobile2 || ""}
                        onChange={(e) => {
                          const numbersOnly = e.target.value.replace(/\D/g, "");
                          if (numbersOnly.length <= 10) {
                            update({ altMobile2: numbersOnly });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>WhatsApp Number 1</Label>
                      <Input
                        placeholder="WhatsApp number"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={localData.whatsapp1 || ""}
                        onChange={(e) => {
                          const numbersOnly = e.target.value.replace(/\D/g, "");
                          if (numbersOnly.length <= 10) {
                            update({ whatsapp1: numbersOnly });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>WhatsApp Number 2</Label>
                      <Input
                        placeholder="WhatsApp number"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={localData.whatsapp2 || ""}
                        onChange={(e) => {
                          const numbersOnly = e.target.value.replace(/\D/g, "");
                          if (numbersOnly.length <= 10) {
                            update({ whatsapp2: numbersOnly });
                          }
                        }}
                      />
                    </div>
                    <NumericInput
                      label="Gaushala Capacity"
                      placeholder="Number of Gau that can be accommodated"
                      value={localData.capacity}
                      onChange={(val) => update({ capacity: val })}
                      error={errors.capacity}
                      required
                      step="1"
                    />
                    <NumericInput
                      label="Permanent Staff Count"
                      placeholder="Number"
                      value={localData.staffCount}
                      onChange={(val) => update({ staffCount: val })}
                      error={errors.staffCount}
                      required
                      step="1"
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.hasTemple || false}
                        onCheckedChange={(c) => update({ hasTemple: c })}
                      />
                      <Label className="text-sm">Gaushala with Temple</Label>
                    </div>
                    <NumericInput
                      label="Charges for Adopting Milking Cow"
                      placeholder="Amount in ₹"
                      value={localData.adoptionCharges}
                      onChange={(val) => update({ adoptionCharges: val })}
                      error={errors.adoptionCharges}
                      required
                      step="0.01"
                    />
                  </>
                )}
              </div>
              <div>
                <Label>Bio / Description</Label>
                <Textarea
                  placeholder="Tell us about your organization..."
                  rows={4}
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
              {!isNGO && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary">
                  <Checkbox
                    checked={localData.isNonProfit || false}
                    onCheckedChange={(c) => update({ isNonProfit: c })}
                  />
                  <Label className="text-sm font-medium text-secondary-foreground">
                    ✅ This is a Non-Profit Gaushala
                  </Label>
                </div>
              )}
              {!isNGO && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary">
                  <Checkbox
                    checked={localData.provides80G || false}
                    onCheckedChange={(c) => update({ provides80G: c })}
                  />
                  <Label className="text-sm font-medium text-secondary-foreground">
                    Do you provide 80G?
                  </Label>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Documents */}
          {stepIndex === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Documents & Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>
                    {isNGO ? "NGO Certificate" : "Registration Certificate"}{" "}
                    (Trust/NGO) *
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    className="cursor-pointer"
                    onChange={(e) =>
                      handleFileChange(
                        "registrationCertificate",
                        e.target.files,
                      )
                    }
                  />
                  {fileState.registrationCertificate &&
                  !Array.isArray(fileState.registrationCertificate) ? (
                    <div className="text-xs text-green-700 mt-1">
                      Selected: {fileState.registrationCertificate.name}
                    </div>
                  ) : null}
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload PDF, JPG or PNG (max 10MB)
                  </p>
                </div>
                <div>
                  <Label>PAN Number *</Label>
                  <Input
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={localData.pan || ""}
                    onChange={(e) => {
                      const alphanumeric = e.target.value.replace(
                        /[^a-zA-Z0-9]/g,
                        "",
                      );
                      if (alphanumeric.length <= 10) {
                        update({ pan: alphanumeric.toUpperCase() });
                      }
                    }}
                    className={errors.pan ? "border-red-500" : ""}
                  />
                  {errors.pan && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.pan}
                    </div>
                  )}
                </div>
                {isNGO && (
                  <div>
                    <Label>80G Certificate (Mandatory) *</Label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      className="cursor-pointer"
                      onChange={(e) =>
                        handleFileChange("certificate80G", e.target.files)
                      }
                    />
                    {fileState.certificate80G &&
                    Array.isArray(fileState.certificate80G) &&
                    fileState.certificate80G.length > 0 ? (
                      <div className="text-xs text-green-700 mt-1">
                        Selected:{" "}
                        {fileState.certificate80G.map((f) => f.name).join(", ")}
                      </div>
                    ) : fileState.certificate80G &&
                      !Array.isArray(fileState.certificate80G) ? (
                      <div className="text-xs text-green-700 mt-1">
                        Selected: {fileState.certificate80G.name}
                      </div>
                    ) : null}
                  </div>
                )}
                {!isNGO && (
                  <>
                    <div className="md:col-span-2 space-y-3">
                      <Label className="text-sm font-semibold">
                        Compliance Confirmations
                      </Label>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localData.hasGST || false}
                            onCheckedChange={(c) => update({ hasGST: c })}
                          />
                          <Label className="text-sm">GST</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localData.has12A || false}
                            onCheckedChange={(c) => update({ has12A: c })}
                          />
                          <Label className="text-sm">12A</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={localData.has80G || false}
                            onCheckedChange={(c) => update({ has80G: c })}
                          />
                          <Label className="text-sm">80G</Label>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Profile Photo / Cover Photo</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="cursor-pointer"
                        onChange={(e) =>
                          handleFileChange(
                            "profilePhotos",
                            e.target.files,
                            true,
                          )
                        }
                      />
                      {fileState.profilePhotos &&
                        fileState.profilePhotos.length > 0 && (
                          <div className="text-xs text-green-700 mt-1">
                            Selected:{" "}
                            {fileState.profilePhotos
                              .map((f) => f.name)
                              .join(", ")}
                          </div>
                        )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Infrastructure (Gaushala) / Operations (NGO) */}
          {stepIndex === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                {isNGO
                  ? "Operations & Associations"
                  : "Infrastructure & Facilities"}
              </h3>
              {isNGO ? (
                <div className="space-y-4">
                  <div>
                    <Label>Profile Photo / Cover Photo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="cursor-pointer"
                      onChange={(e) =>
                        handleFileChange("profilePhotos", e.target.files, true)
                      }
                    />
                    {fileState.profilePhotos &&
                      fileState.profilePhotos.length > 0 && (
                        <div className="text-xs text-green-700 mt-1">
                          Selected:{" "}
                          {fileState.profilePhotos
                            .map((f) => f.name)
                            .join(", ")}
                        </div>
                      )}
                  </div>
                  <p className="text-sm text-muted-foreground p-4 bg-secondary rounded-lg">
                    After approval, you can associate with Gaushalas, create
                    campaigns, and list CSR programs from your dashboard.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Total Land Area (acres/Bigha) *</Label>
                    <Input
                      placeholder="e.g. 5 acres"
                      value={localData.landArea || ""}
                      onChange={(e) => update({ landArea: e.target.value })}
                      className={errors.landArea ? "border-red-500" : ""}
                    />
                    {errors.landArea && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.landArea}
                      </div>
                    )}
                  </div>
                  <NumericInput
                    label="Total Cow Capacity"
                    placeholder="Number"
                    value={localData.cowCapacity}
                    onChange={(val) => update({ cowCapacity: val })}
                    error={errors.cowCapacity}
                    required
                    step="1"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.hasHospital || false}
                      onCheckedChange={(c) => update({ hasHospital: c })}
                    />
                    <Label className="text-sm">In-House Hospital Setup</Label>
                  </div>
                  <NumericInput
                    label="Number of 4W Vehicles"
                    placeholder="Number"
                    value={localData.vehicleCount}
                    onChange={(val) => update({ vehicleCount: val })}
                    error={errors.vehicleCount}
                    required
                    step="1"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.hasCCTV || false}
                      onCheckedChange={(c) => update({ hasCCTV: c })}
                    />
                    <Label className="text-sm">
                      CCTV / Security Infrastructure
                    </Label>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: Cattle & Media (Gaushala only) */}
          {!isNGO && stepIndex === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Cattle Details & Media
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <NumericInput
                  label="Nandi Count"
                  placeholder="0"
                  value={localData.nandiCount}
                  onChange={(val) => update({ nandiCount: val })}
                  error={errors.nandiCount}
                  required
                  step="1"
                />
                <NumericInput
                  label="Milking Cow Count"
                  placeholder="0"
                  value={localData.milkingCowCount}
                  onChange={(val) => update({ milkingCowCount: val })}
                  error={errors.milkingCowCount}
                  required
                  step="1"
                />
                <NumericInput
                  label="Non-Milking Cow Count"
                  placeholder="0"
                  value={localData.nonMilkingCowCount}
                  onChange={(val) => update({ nonMilkingCowCount: val })}
                  error={errors.nonMilkingCowCount}
                  required
                  step="1"
                />
                <NumericInput
                  label="Male Calf Count"
                  placeholder="0"
                  value={localData.maleCalfCount}
                  onChange={(val) => update({ maleCalfCount: val })}
                  error={errors.maleCalfCount}
                  required
                  step="1"
                />
                <NumericInput
                  label="Female Calf Count"
                  placeholder="0"
                  value={localData.femaleCalfCount}
                  onChange={(val) => update({ femaleCalfCount: val })}
                  error={errors.femaleCalfCount}
                  required
                  step="1"
                />
              </div>
              <div className="mt-6">
                <Label>Photos / Videos of Gaushala *</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload photos of Gau Mata, premises, cattle shed, feeding
                  area, etc.
                </p>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="cursor-pointer"
                  onChange={(e) =>
                    handleFileChange("gaushalaMedia", e.target.files, true)
                  }
                />
                {fileState.gaushalaMedia &&
                  fileState.gaushalaMedia.length > 0 && (
                    <div className="text-xs text-green-700 mt-1">
                      Selected:{" "}
                      {fileState.gaushalaMedia.map((f) => f.name).join(", ")}
                    </div>
                  )}
              </div>
            </motion.div>
          )}

          {/* REVIEW STEP */}
          {((isNGO && stepIndex === 3) || (!isNGO && stepIndex === 4)) && (
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
                  Please review your information before submitting. After
                  submission, your profile will be reviewed by our admin team.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {localData.name && (
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-medium">{localData.name}</span>
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
                  {localData.state && (
                    <div>
                      <span className="text-muted-foreground">State:</span>{" "}
                      <span className="font-medium">{localData.state}</span>
                    </div>
                  )}
                  {localData.registrationNumber && (
                    <div>
                      <span className="text-muted-foreground">Reg No:</span>{" "}
                      <span className="font-medium">
                        {localData.registrationNumber}
                      </span>
                    </div>
                  )}
                  {localData.legalStatus && (
                    <div>
                      <span className="text-muted-foreground">
                        Legal Status:
                      </span>{" "}
                      <span className="font-medium capitalize">
                        {localData.legalStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-sage-light rounded-lg">
                <Check className="w-5 h-5 text-accent" />
                <p className="text-sm font-medium">
                  Your profile will undergo admin verification after submission.
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-5 border-t border-border">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {stepIndex === 0 ? "Change Role" : "Back"}
            </Button>
            {(isNGO && stepIndex === 3) || (!isNGO && stepIndex === 4) ? (
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

export default GaushalaNGOForm;
