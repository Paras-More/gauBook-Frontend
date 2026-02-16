import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegistrationStore, roleLabels } from '@/stores/registrationStore';
import FormStepIndicator from './FormStepIndicator';
import SocialMediaFields from './SocialMediaFields';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const gaushalaNgoSteps = ['Basic Info', 'Documents', 'Infrastructure', 'Cattle & Media', 'Review'];

const GaushalaNGOForm = () => {
  const { selectedRole, formData, updateFormData, currentStep, setCurrentStep, resetForm } = useRegistrationStore();
  const [localData, setLocalData] = useState<Record<string, any>>(formData);
  const isNGO = selectedRole === 'ngo';
  const steps = isNGO
    ? ['Basic Info', 'Documents', 'Operations', 'Review']
    : gaushalaNgoSteps;

  const stepIndex = currentStep - 1; // step 0 is role selection

  const update = (data: Record<string, any>) => {
    setLocalData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
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

  const handleSubmit = () => {
    updateFormData(localData);
    toast.success(`${roleLabels[selectedRole!]} registration submitted successfully! 🎉`);
    console.log('Registration data:', { ...formData, ...localData, role: selectedRole });
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {isNGO ? 'NGO' : 'Gaushala'} Registration
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Fill in all details to complete registration</p>
        </div>
        <FormStepIndicator steps={steps} currentStep={stepIndex} />

        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-card">
          {/* STEP 1: Basic Info */}
          {stepIndex === 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{isNGO ? 'NGO Name' : 'Gaushala Name'} *</Label>
                  <Input placeholder="As per registration documents" value={localData.name || ''} onChange={(e) => update({ name: e.target.value })} />
                </div>
                <div>
                  <Label>Year of Establishment *</Label>
                  <Input placeholder="e.g. 2005" type="number" value={localData.yearEstablished || ''} onChange={(e) => update({ yearEstablished: e.target.value })} />
                </div>
                <div>
                  <Label>Legal Status *</Label>
                  <Select value={localData.legalStatus || ''} onValueChange={(v) => update({ legalStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="Select legal status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trust">Trust</SelectItem>
                      <SelectItem value="society">Society</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="private">Private Gaushala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{isNGO ? 'NGO' : 'Trust'} Registration Number *</Label>
                  <Input placeholder="Registration number" value={localData.registrationNumber || ''} onChange={(e) => update({ registrationNumber: e.target.value })} />
                </div>
                <div>
                  <Label>Contact Person Name *</Label>
                  <Input placeholder="Full name" value={localData.contactPerson || ''} onChange={(e) => update({ contactPerson: e.target.value })} />
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input placeholder="e.g. Manager, Trustee" value={localData.designation || ''} onChange={(e) => update({ designation: e.target.value })} />
                </div>
                <div>
                  <Label>Mobile Number (OTP verified) *</Label>
                  <Input placeholder="+91 XXXXX XXXXX" value={localData.mobile || ''} onChange={(e) => update({ mobile: e.target.value })} />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input placeholder="email@example.com" type="email" value={localData.email || ''} onChange={(e) => update({ email: e.target.value })} />
                </div>
                <div>
                  <Label>State *</Label>
                  <Select value={localData.state || ''} onValueChange={(v) => update({ state: v })}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>District *</Label>
                  <Input placeholder="District" value={localData.district || ''} onChange={(e) => update({ district: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>{isNGO ? 'City' : 'Village/Town'}</Label>
                  <Input placeholder={isNGO ? 'City' : 'Village / Town'} value={localData.city || ''} onChange={(e) => update({ city: e.target.value })} />
                </div>
                {isNGO && (
                  <div className="md:col-span-2">
                    <Label>Areas of Operation</Label>
                    <Input placeholder="e.g. Animal welfare, Rural development" value={localData.areasOfOperation || ''} onChange={(e) => update({ areasOfOperation: e.target.value })} />
                  </div>
                )}
                {!isNGO && (
                  <>
                    <div>
                      <Label>Alternate Mobile 1</Label>
                      <Input placeholder="Alternate number" value={localData.altMobile1 || ''} onChange={(e) => update({ altMobile1: e.target.value })} />
                    </div>
                    <div>
                      <Label>Alternate Mobile 2</Label>
                      <Input placeholder="Alternate number" value={localData.altMobile2 || ''} onChange={(e) => update({ altMobile2: e.target.value })} />
                    </div>
                    <div>
                      <Label>WhatsApp Number 1</Label>
                      <Input placeholder="WhatsApp number" value={localData.whatsapp1 || ''} onChange={(e) => update({ whatsapp1: e.target.value })} />
                    </div>
                    <div>
                      <Label>WhatsApp Number 2</Label>
                      <Input placeholder="WhatsApp number" value={localData.whatsapp2 || ''} onChange={(e) => update({ whatsapp2: e.target.value })} />
                    </div>
                    <div>
                      <Label>Gaushala Capacity</Label>
                      <Input placeholder="Number of Gau that can be accommodated" type="number" value={localData.capacity || ''} onChange={(e) => update({ capacity: e.target.value })} />
                    </div>
                    <div>
                      <Label>Permanent Staff Count</Label>
                      <Input placeholder="Number" type="number" value={localData.staffCount || ''} onChange={(e) => update({ staffCount: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={localData.hasTemple || false} onCheckedChange={(c) => update({ hasTemple: c })} />
                      <Label className="text-sm">Gaushala with Temple</Label>
                    </div>
                    <div>
                      <Label>Charges for Adopting Milking Cow</Label>
                      <Input placeholder="Amount in ₹" value={localData.adoptionCharges || ''} onChange={(e) => update({ adoptionCharges: e.target.value })} />
                    </div>
                  </>
                )}
              </div>
              <div>
                <Label>Bio / Description</Label>
                <Textarea placeholder="Tell us about your organization..." rows={4} value={localData.bio || ''} onChange={(e) => update({ bio: e.target.value })} />
              </div>
              <div>
                <Label>Website</Label>
                <Input placeholder="https://" value={localData.website || ''} onChange={(e) => update({ website: e.target.value })} />
              </div>
              <SocialMediaFields formData={localData} onChange={update} />
              {!isNGO && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary">
                  <Checkbox checked={localData.isNonProfit || false} onCheckedChange={(c) => update({ isNonProfit: c })} />
                  <Label className="text-sm font-medium text-secondary-foreground">
                    ✅ This is a Non-Profit Gaushala
                  </Label>
                </div>
              )}
              {!isNGO && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary">
                  <Checkbox checked={localData.provides80G || false} onCheckedChange={(c) => update({ provides80G: c })} />
                  <Label className="text-sm font-medium text-secondary-foreground">
                    Do you provide 80G?
                  </Label>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Documents */}
          {stepIndex === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Documents & Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>{isNGO ? 'NGO Certificate' : 'Registration Certificate'} (Trust/NGO) *</Label>
                  <Input type="file" accept=".pdf,.jpg,.png" className="cursor-pointer" />
                  <p className="text-xs text-muted-foreground mt-1">Upload PDF, JPG or PNG (max 10MB)</p>
                </div>
                <div>
                  <Label>PAN Number *</Label>
                  <Input placeholder="ABCDE1234F" value={localData.pan || ''} onChange={(e) => update({ pan: e.target.value })} />
                </div>
                {isNGO && (
                  <div>
                    <Label>80G Certificate (Mandatory) *</Label>
                    <Input type="file" accept=".pdf,.jpg,.png" className="cursor-pointer" />
                  </div>
                )}
                {!isNGO && (
                  <>
                    <div className="md:col-span-2 space-y-3">
                      <Label className="text-sm font-semibold">Compliance Confirmations</Label>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={localData.hasGST || false} onCheckedChange={(c) => update({ hasGST: c })} />
                          <Label className="text-sm">GST</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={localData.has12A || false} onCheckedChange={(c) => update({ has12A: c })} />
                          <Label className="text-sm">12A</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={localData.has80G || false} onCheckedChange={(c) => update({ has80G: c })} />
                          <Label className="text-sm">80G</Label>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Profile Photo / Cover Photo</Label>
                      <Input type="file" accept="image/*" multiple className="cursor-pointer" />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Infrastructure (Gaushala) / Operations (NGO) */}
          {stepIndex === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                {isNGO ? 'Operations & Associations' : 'Infrastructure & Facilities'}
              </h3>
              {isNGO ? (
                <div className="space-y-4">
                  <div>
                    <Label>Profile Photo / Cover Photo</Label>
                    <Input type="file" accept="image/*" multiple className="cursor-pointer" />
                  </div>
                  <p className="text-sm text-muted-foreground p-4 bg-secondary rounded-lg">
                    After approval, you can associate with Gaushalas, create campaigns, and list CSR programs from your dashboard.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Total Land Area (acres/Bigha)</Label>
                    <Input placeholder="e.g. 5 acres" value={localData.landArea || ''} onChange={(e) => update({ landArea: e.target.value })} />
                  </div>
                  <div>
                    <Label>Total Cow Capacity</Label>
                    <Input placeholder="Number" type="number" value={localData.cowCapacity || ''} onChange={(e) => update({ cowCapacity: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={localData.hasHospital || false} onCheckedChange={(c) => update({ hasHospital: c })} />
                    <Label className="text-sm">In-House Hospital Setup</Label>
                  </div>
                  <div>
                    <Label>Number of 4W Vehicles</Label>
                    <Input placeholder="Number" type="number" value={localData.vehicleCount || ''} onChange={(e) => update({ vehicleCount: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={localData.hasCCTV || false} onCheckedChange={(c) => update({ hasCCTV: c })} />
                    <Label className="text-sm">CCTV / Security Infrastructure</Label>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: Cattle & Media (Gaushala only) */}
          {!isNGO && stepIndex === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Cattle Details & Media
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Nandi Count</Label>
                  <Input type="number" placeholder="0" value={localData.nandiCount || ''} onChange={(e) => update({ nandiCount: e.target.value })} />
                </div>
                <div>
                  <Label>Milking Cow Count</Label>
                  <Input type="number" placeholder="0" value={localData.milkingCowCount || ''} onChange={(e) => update({ milkingCowCount: e.target.value })} />
                </div>
                <div>
                  <Label>Non-Milking Cow Count</Label>
                  <Input type="number" placeholder="0" value={localData.nonMilkingCowCount || ''} onChange={(e) => update({ nonMilkingCowCount: e.target.value })} />
                </div>
                <div>
                  <Label>Male Calf Count</Label>
                  <Input type="number" placeholder="0" value={localData.maleCalfCount || ''} onChange={(e) => update({ maleCalfCount: e.target.value })} />
                </div>
                <div>
                  <Label>Female Calf Count</Label>
                  <Input type="number" placeholder="0" value={localData.femaleCalfCount || ''} onChange={(e) => update({ femaleCalfCount: e.target.value })} />
                </div>
              </div>
              <div className="mt-6">
                <Label>Photos / Videos of Gaushala *</Label>
                <p className="text-xs text-muted-foreground mb-2">Upload photos of Gau Mata, premises, cattle shed, feeding area, etc.</p>
                <Input type="file" accept="image/*,video/*" multiple className="cursor-pointer" />
              </div>
            </motion.div>
          )}

          {/* REVIEW STEP */}
          {((isNGO && stepIndex === 3) || (!isNGO && stepIndex === 4)) && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h3 className="text-lg font-heading font-semibold text-foreground border-b border-border pb-2">
                Review & Submit
              </h3>
              <div className="bg-secondary rounded-lg p-5 space-y-3">
                <p className="text-sm text-secondary-foreground">
                  Please review your information before submitting. After submission, your profile will be reviewed by our admin team.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {localData.name && <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{localData.name}</span></div>}
                  {localData.mobile && <div><span className="text-muted-foreground">Mobile:</span> <span className="font-medium">{localData.mobile}</span></div>}
                  {localData.email && <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{localData.email}</span></div>}
                  {localData.state && <div><span className="text-muted-foreground">State:</span> <span className="font-medium">{localData.state}</span></div>}
                  {localData.registrationNumber && <div><span className="text-muted-foreground">Reg No:</span> <span className="font-medium">{localData.registrationNumber}</span></div>}
                  {localData.legalStatus && <div><span className="text-muted-foreground">Legal Status:</span> <span className="font-medium capitalize">{localData.legalStatus}</span></div>}
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-sage-light rounded-lg">
                <Check className="w-5 h-5 text-accent" />
                <p className="text-sm font-medium">Your profile will undergo admin verification after submission.</p>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-5 border-t border-border">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {stepIndex === 0 ? 'Change Role' : 'Back'}
            </Button>
            {((isNGO && stepIndex === 3) || (!isNGO && stepIndex === 4)) ? (
              <Button onClick={handleSubmit} className="gradient-saffron text-primary-foreground shadow-warm hover:opacity-90">
                <Check className="w-4 h-4 mr-2" />
                Submit Registration
              </Button>
            ) : (
              <Button onClick={handleNext} className="gradient-saffron text-primary-foreground shadow-warm hover:opacity-90">
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
