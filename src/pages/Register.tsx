import Header from "@/components/layout/Header";
import RoleSelection from "@/components/registration/RoleSelection";
import GaushalaNGOForm from "@/components/registration/GaushalaNGOForm";
import VolunteerDonorInfluencerForm from "@/components/registration/VolunteerDonorInfluencerForm";
import VendorForm from "@/components/registration/VendorForm";
import {
  useRegistrationStore,
  getRoleFormType,
} from "@/stores/registrationStore";

const Register = () => {
  const selectedRole = useRegistrationStore((s) => s.selectedRole);
  const formType = selectedRole ? getRoleFormType(selectedRole) : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 lg:py-12 px-4">
        {!selectedRole && <RoleSelection />}
        {formType === "type1" && <GaushalaNGOForm />}
        {formType === "type2" && <VolunteerDonorInfluencerForm />}
        {formType === "type3" && <VendorForm />}
      </main>
    </div>
  );
};

export default Register;
