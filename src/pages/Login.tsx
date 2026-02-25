import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { roleIcons, roleLabels } from "@/stores/registrationStore";
import { Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { loginGaushala, loginNgo, loginUser, loginVendor } from "@/axios/Login";
import { showErrorToast, showSuccessToast } from "@/lib/toasts/customToasts";
import { useAuthStore } from "@/stores/authStore";
const USER_TYPES = [
  { label: roleLabels.gaushala, value: "gaushala", icon: roleIcons.gaushala },
  {
    label: roleLabels.volunteer,
    value: "volunteer",
    icon: roleIcons.volunteer,
  },
  { label: roleLabels.donor, value: "donor", icon: roleIcons.donor },
  {
    label: roleLabels.influencer,
    value: "influencer",
    icon: roleIcons.influencer,
  },
  { label: roleLabels.ngo, value: "ngo", icon: roleIcons.ngo },
  { label: roleLabels.vendor, value: "vendor", icon: roleIcons.vendor },
];

const LOCAL_STORAGE_KEY = "gaubook_user_type";

export default function Login() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [remember, setRemember] = useState(false);
  const [step, setStep] = useState(1); // 1: user type, 2: credentials
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const user = ["volunteer", "donor", "influencer"];
  useEffect(() => {
    const rememberedType = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (rememberedType) {
      setUserType(rememberedType);
      setRemember(true);
    }
  }, []);

  const handleUserTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remember) {
      localStorage.setItem(LOCAL_STORAGE_KEY, userType);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setStep(2);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Determine if input is email or mobile
    const isEmail = emailOrMobile.includes("@");
    const payload = isEmail
      ? { email: emailOrMobile, password }
      : { mobile: emailOrMobile, password };

    try {
      setIsLoading(true);
      if (user.includes(userType)) {
        const response = await loginUser(payload);
        console.log(response);

        if (response.success) {
          showSuccessToast("Login successful! 🎉");
          setUser(
            response.data.id,
            response.data.name,
            response.data.role || "user",
          );
          navigate("/directory");
        }
        // Call user login API
      } else if (userType === "vendor") {
        const response = await loginVendor(payload);
        console.log(response);

        if (response.success) {
          showSuccessToast("Login successful! 🎉");
          setUser(
            response.data.id,
            response.data.name,
            response.data.role || "vendor",
          );
          navigate("/directory");
        }
        // Call vendor login API
      } else if (userType === "gaushala") {
        // Call gaushala login API
        const response = await loginGaushala(payload);
        console.log("response gaushala", response);

        if (response.success) {
          showSuccessToast("Login successful! 🎉");
          console.log("response.data.id", response.data.id);

          setUser(
            response.data.id,
            response.data.name,
            response.data.role || "gaushala",
          );
          navigate("/profile");
        }
      } else if (userType === "ngo") {
        // Call NGO login API
        const response = await loginNgo(payload);
        console.log(response);

        if (response.success) {
          showSuccessToast("Login successful! 🎉");
          setUser(
            response.data.id,
            response.data.name,
            response.data.role || "ngo",
          );
          navigate("/directory");
        }
      }
    } catch (error: any) {
      console.log(error.message);

      let errorMessage = "Login failed. Please try again.";
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      showErrorToast(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUserType = () => {
    setStep(1);
    setEmailOrMobile("");
    setPassword("");
    setError("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-100 dark:from-background dark:via-background dark:to-background overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex w-full max-w-4xl h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Left: Illustration or image */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-200 dark:from-muted dark:via-muted dark:to-muted px-10 py-12 w-1/2 relative">
          <img
            src="/placeholder.svg"
            alt="Login Illustration"
            className="w-56 h-56 object-contain mb-6 drop-shadow-xl animate-float"
          />
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-heading font-bold text-orange-600 mb-2 text-center"
          >
            Welcome Back!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground text-center"
          >
            Login to India's trusted Gau Community
          </motion.p>
        </div>
        {/* Right: Login Form */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            // Step 1: User Type Selection
            <motion.form
              key="step-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleUserTypeSubmit}
              className="flex-1 px-6 py-10 md:px-12 md:py-16 flex flex-col justify-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="text-3xl md:text-4xl font-heading font-extrabold mb-8 text-center text-gradient-saffron flex items-center justify-center gap-2 tracking-tight"
              >
                <span className="text-3xl">🐄</span> Login
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <label className="block mb-3 font-semibold text-foreground text-lg text-center">
                  Select User Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {USER_TYPES.map((type, i) => (
                    <motion.label
                      key={type.value}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm text-center text-base font-medium select-none ${
                        userType === type.value
                          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-lg"
                          : "border-border bg-background hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value={type.value}
                        checked={userType === type.value}
                        onChange={() => setUserType(type.value)}
                        className="sr-only"
                        required
                      />
                      <span className="text-3xl mb-2">{type.icon}</span>
                      {type.label}
                    </motion.label>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8 flex items-center justify-center"
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                  className="mr-2 accent-orange-500"
                />
                <label htmlFor="remember" className="text-foreground">
                  Remember my user type
                </label>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold text-lg shadow-lg"
                  disabled={!userType}
                >
                  Continue
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-8 text-center text-muted-foreground text-sm"
              >
                New here?{" "}
                <Link
                  to="/register"
                  className="text-orange-600 hover:underline font-semibold"
                >
                  Register
                </Link>
              </motion.div>
            </motion.form>
          ) : (
            // Step 2: Credentials Form
            <motion.form
              key="step-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCredentialsSubmit}
              className="flex-1 px-6 py-10 md:px-12 md:py-16 flex flex-col justify-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="text-3xl md:text-4xl font-heading font-extrabold mb-2 text-center text-gradient-saffron flex items-center justify-center gap-2 tracking-tight"
              >
                Enter Credentials
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-center text-muted-foreground mb-8 text-sm"
              >
                Logging in as{" "}
                <span className="font-semibold text-foreground">
                  {roleLabels[userType as keyof typeof roleLabels]}
                </span>
              </motion.p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <label className="block mb-2 font-semibold text-foreground">
                  Email or Mobile
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter email or mobile number"
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8"
              >
                <label className="block mb-2 font-semibold text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <Button
                  type="button"
                  onClick={handleBackToUserType}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold text-lg shadow-lg"
                  disabled={!emailOrMobile || !password || isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-8 text-center text-muted-foreground text-sm"
              >
                <a href="#" className="text-orange-600 hover:underline">
                  Forgot password?
                </a>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
