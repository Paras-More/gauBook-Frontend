// ─── Profile Skeleton Loader ─────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="container px-4 py-8 max-w-5xl mx-auto">
      <div className="mb-6 animate-pulse">
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-card">
          <div className="h-40 lg:h-52 bg-muted" />
          <div className="relative px-6 lg:px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14">
              <div className="w-28 h-28 rounded-full bg-muted border-4 border-card shadow-warm" />
              <div className="flex-1 pt-2 sm:pt-0 sm:pb-1">
                <div className="h-8 w-40 bg-muted rounded mb-2" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <div className="h-8 w-16 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="flex gap-4">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
            <div className="flex gap-6 mt-5 pt-4 border-t border-border">
              <div className="h-6 w-16 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserRole,
  roleLabels,
  roleIcons,
  useRegistrationStore,
} from "@/stores/registrationStore";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Shield,
  Heart,
  Users,
  Calendar,
  Camera,
  Edit2,
  Share2,
  ExternalLink,
  Building2,
  Truck,
  Stethoscope,
  Video,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import {
  getGaushalaProfile,
  getNGOProfile,
  getVendorProfile,
  getVolunteerDonorInfluencerProfile,
} from "@/axios/Profile";
import { useAuthStore } from "@/stores/authStore";

// Mock profile data per role
const mockProfiles: Record<UserRole, Record<string, any>> = {
  gaushala: {
    name: "Shri Krishna Gaushala",
    email: "contact@krishnagaushala.org",
    mobile: "+91 98765 43210",
    profilePhoto: "",
    bio: "Established in 1998, Shri Krishna Gaushala is one of the largest Gaushalas in Rajasthan, dedicated to the welfare and protection of indigenous Gau breeds. We provide shelter, medical care, and nutritious food to over 2,000 cattle.",
    coverPhoto: "",
    yearEstablished: "1998",
    legalStatus: "Trust",
    registrationNumber: "RAJ/TRUST/1998/4521",
    contactPerson: "Shri Ramesh Sharma",
    designation: "Managing Trustee",
    state: "Rajasthan",
    district: "Jaipur",
    city: "Sanganer",
    capacity: 2500,
    staffCount: 45,
    hasTemple: true,
    provides80G: true,
    isNonProfit: true,
    website: "https://krishnagaushala.org",
    landArea: "25 acres",
    cowCapacity: 2500,
    hasHospital: true,
    vehicleCount: 3,
    hasCCTV: true,
    nandiCount: 120,
    milkingCowCount: 450,
    nonMilkingCowCount: 800,
    maleCalfCount: 280,
    femaleCalfCount: 350,
    credibilityScore: 88,
    badge: "Diamond",
    followers: 12500,
    posts: 234,
    verificationStatus: "verified",
    socialMedia: {
      youtube: "@krishnagaushala",
      instagram: "@krishnagaushala",
      facebook: "KrishnaGaushala",
    },
  },
  ngo: {
    name: "Gau Seva Foundation",
    email: "info@gausevafoundation.org",
    mobile: "+91 98123 45678",
    profilePhoto: "",
    bio: "Gau Seva Foundation is a registered NGO working towards the welfare and protection of indigenous cattle breeds. We run multiple programs for Gaushala support, volunteer coordination, and awareness campaigns.",
    yearEstablished: "2010",
    legalStatus: "NGO",
    registrationNumber: "DL/NGO/2010/7892",
    contactPerson: "Dr. Priya Gupta",
    designation: "Director",
    state: "Delhi",
    district: "New Delhi",
    city: "New Delhi",
    areasOfOperation: "Animal Welfare, Rural Development, Education",
    website: "https://gausevafoundation.org",
    has80GCertificate: true,
    verificationStatus: "verified",
    badge: "Platinum",
    credibilityScore: 78,
    followers: 8700,
    posts: 156,
    associatedGaushalas: 24,
    campaigns: 12,
    socialMedia: {
      youtube: "@gauseva",
      instagram: "@gausevafoundation",
      facebook: "GauSevaFoundation",
    },
  },
  volunteer: {
    name: "Arjun Patel",
    email: "arjun.patel@gmail.com",
    mobile: "+91 99887 76655",
    profilePhoto: "",
    bio: "Passionate about Gau Seva with 5+ years of volunteering experience. Skilled in animal care, event organizing, and social media awareness campaigns.",
    city: "Ahmedabad",
    district: "Ahmedabad",
    state: "Gujarat",
    age: 28,
    gender: "Male",
    experience: "Experienced",
    gaushalasKnown: "Panchvati Gaushala, Shri Ram Gaushala",
    activities: [
      "Gau Rakshak",
      "Nursing Care",
      "Social Media Manager",
      "Event Organizing",
      "Donor",
      "Fundraising Support",
      "Social Media Influencer",
      "Marketing",
    ],
    animalCareExp: "5 years of hands-on experience with cattle care",
    vetSkills: "Basic first-aid and wound care",
    hasTransport: true,
    socialMediaCampaign: true,
    eventOrganizing: true,
    volunteeringVisits: 87,
    hoursContributed: 520,
    impactScore: 72,
    donationsCount: 34,
    gaushalasSupported: 8,
    campaignsCreated: 15,
    liveStreams: 42,
    totalReach: "2.5M",
    followers: 5200,
    posts: 312,
    verificationStatus: "verified",
    socialMedia: {
      instagram: "@arjun_gauseva",
      youtube: "@VikramGauSeva",
      facebook: "VikramGauSeva",
      twitter: "@vikram_gauseva",
    },
  },
  donor: {
    name: "Sunita Devi",
    email: "sunita.devi@outlook.com",
    mobile: "+91 98765 11223",
    profilePhoto: "",
    bio: "Regular contributor to multiple Gaushalas across North India. Believes in transparent giving and verified organizations.",
    city: "Lucknow",
    district: "Lucknow",
    state: "Uttar Pradesh",
    age: 45,
    gender: "Female",
    experience: "Experienced",
    gaushalasKnown: "Gau Lok Gaushala, Vrindavan Gaushala",
    activities: [
      "Donor",
      "Fundraising Support",
      "Event Organizing",
      "Social Media Manager",
    ],
    animalCareExp: "2 years of volunteering",
    vetSkills: "",
    hasTransport: false,
    socialMediaCampaign: false,
    eventOrganizing: true,
    volunteeringVisits: 10,
    hoursContributed: 100,
    impactScore: 40,
    donationsCount: 34,
    gaushalasSupported: 8,
    campaignsCreated: 2,
    liveStreams: 0,
    totalReach: "10K",
    followers: 120,
    posts: 18,
    verificationStatus: "pending",
    socialMedia: {
      instagram: "@donor_sunita",
    },
  },
  influencer: {
    name: "Vikram Singh",
    email: "vikram@gauinfluencer.in",
    mobile: "+91 99001 23456",
    profilePhoto: "",
    bio: "Digital creator promoting Gau Seva across social media. 500K+ combined followers. Running awareness campaigns and live streams for Gaushala support.",
    city: "Mumbai",
    district: "Mumbai",
    state: "Maharashtra",
    age: 32,
    gender: "Male",
    experience: "Experienced",
    gaushalasKnown: "",
    activities: [
      "Social Media Influencer",
      "Marketing",
      "Fundraising Support",
      "Event Organizing",
    ],
    animalCareExp: "",
    vetSkills: "",
    hasTransport: false,
    socialMediaCampaign: true,
    eventOrganizing: true,
    volunteeringVisits: 0,
    hoursContributed: 0,
    impactScore: 0,
    donationsCount: 0,
    gaushalasSupported: 0,
    campaignsCreated: 15,
    liveStreams: 42,
    totalReach: "2.5M",
    followers: 5200,
    posts: 312,
    verificationStatus: "verified",
    socialMedia: {
      youtube: "@VikramGauSeva",
      instagram: "@vikram_gauseva",
      facebook: "VikramGauSeva",
      twitter: "@vikram_gauseva",
    },
  },
  vendor: {
    name: "Green Fodder Enterprises",
    email: "sales@greenfodder.in",
    mobile: "+91 98212 34567",
    profilePhoto: "",
    bio: "Leading supplier of organic fodder and cattle feed in Western India. Serving 100+ Gaushalas with quality products and timely delivery.",
    contactPerson: "Rajesh Kumar",
    businessType: "Fodder Supplier",
    gstNumber: "27AABCF1234A1Z5",
    state: "Maharashtra",
    city: "Pune",
    pincode: "411001",
    serviceRadius: "200 km",
    address: "Plot 45, MIDC Industrial Area, Pune",
    website: "https://greenfodder.in",
    productsServices:
      "Organic Green Fodder, Dry Fodder, Cattle Feed, Mineral Mix, Silage",
    deliveryAvailable: "Yes",
    paymentTerms: "Credit (30 days)",
    bulkOrders: true,
    customOrders: true,
    emergencyService: true,
    quotesCompleted: 67,
    ordersDelivered: 234,
    followers: 890,
    posts: 56,
    rating: 4.6,
    socialMedia: { instagram: "@greenfodder_pune" },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number | undefined;
}) => {
  if (!value) return null;
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200"
    >
      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">
          {String(value)}
        </p>
      </div>
    </motion.div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "primary",
}: {
  icon: any;
  label: string;
  value: string | number;
  color?: string;
}) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ scale: 1.03, y: -2 }}
    className="p-4 rounded-xl bg-card border border-border shadow-card text-center"
  >
    <div
      className={`w-10 h-10 mx-auto rounded-full gradient-saffron flex items-center justify-center mb-2`}
    >
      <Icon className="w-5 h-5 text-primary-foreground" />
    </div>
    <p className="text-xl font-heading font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </motion.div>
);

const SocialBadge = ({
  platform,
  platformId,
  subscriberCount,
  isVerified,
}: {
  platform: string;
  platformId: string;
  subscriberCount: number;
  isVerified: boolean;
}) => {
  const icons: Record<string, any> = {
    Youtube: Youtube,
    Instagram: Instagram,
    Facebook: Facebook,
    Twitter: Twitter,
  };

  const Icon = icons[platform] || Globe;
  // Format subscriber count for readability
  const formatSubs = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count;
  };
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.07 }}
      className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary/80 to-card border border-border shadow-card transition-all min-w-[180px]"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-muted-foreground mb-0.5 capitalize">
          {platform}
        </span>
        <span className="text-sm text-foreground font-medium truncate">
          {platformId}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">
          {formatSubs(subscriberCount)} Subscribers
        </span>
      </div>
      {isVerified && (
        <span className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </span>
      )}
    </motion.div>
  );
};

const VerificationBadge = ({
  status,
  badge,
}: {
  status?: string;
  badge?: string;
}) => {
  if (status !== "verified") return null;
  const badgeColors: Record<string, string> = {
    Diamond: "bg-blue-100 text-blue-700 border-blue-200",
    Platinum: "bg-purple-100 text-purple-700 border-purple-200",
    Gold: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="bg-accent/10 text-accent border-accent/30 gap-1"
      >
        <CheckCircle2 className="w-3 h-3" /> Verified
      </Badge>
      {badge && (
        <Badge
          variant="outline"
          className={`gap-1 ${badgeColors[badge] || ""}`}
        >
          <Award className="w-3 h-3" /> {badge}
        </Badge>
      )}
    </div>
  );
};

// ─── Role-specific profile sections ─────────────────────────────────

const GaushalaDetails = ({ data }: { data: Record<string, any> }) => (
  <Tabs defaultValue="overview" className="w-full">
    <TabsList className="w-full justify-start bg-secondary/50 mb-6">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
      <TabsTrigger value="cattle">Cattle</TabsTrigger>
      <TabsTrigger value="social">Social</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <InfoItem
          icon={Shield}
          label="Non-Profit Gaushala"
          value={data.isNonProfit ? "Yes" : "No"}
        />
        <InfoItem
          icon={Heart}
          label="Adoption Charges (Milking Cow)"
          value={
            data.adoptionCharges !== undefined
              ? `₹${data.adoptionCharges}`
              : "Not Provided"
          }
        />
        <InfoItem
          icon={Shield}
          label="PAN Number"
          value={data.pan || "Not Provided"}
        />
        <InfoItem
          icon={Shield}
          label="GST"
          value={data.hasGST ? "Yes" : "No"}
        />
        <InfoItem
          icon={Shield}
          label="12A"
          value={data.has12A ? "Yes" : "No"}
        />
        <InfoItem
          icon={Shield}
          label="80G"
          value={data.has80G ? "Yes" : "No"}
        />
        <InfoItem
          icon={MapPin}
          label="Location"
          value={`${data.city}, ${data.district}, ${data.state}`}
        />
        <InfoItem icon={Globe} label="Website" value={data.website} />
        <InfoItem
          icon={Users}
          label="Staff"
          value={`${data.staffCount} permanent`}
        />
        <InfoItem
          icon={Heart}
          label="Capacity"
          value={`${data.capacity} cattle`}
        />
        <InfoItem
          icon={CheckCircle2}
          label="80G Available"
          value={data.provides80G ? "Yes" : "No"}
        />
      </motion.div>
    </TabsContent>
    <TabsContent value="infrastructure">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <InfoItem icon={MapPin} label="Total Land Area" value={data.landArea} />
        <InfoItem icon={Heart} label="Cow Capacity" value={data.cowCapacity} />
        <InfoItem
          icon={Stethoscope}
          label="In-House Hospital"
          value={data.hasHospital ? "Yes" : "No"}
        />
        <InfoItem icon={Truck} label="4W Vehicles" value={data.vehicleCount} />
        <InfoItem
          icon={Video}
          label="CCTV"
          value={data.hasCCTV ? "Installed" : "No"}
        />
        <InfoItem
          icon={Building2}
          label="Temple"
          value={data.hasTemple ? "Yes" : "No"}
        />
      </motion.div>
    </TabsContent>
    <TabsContent value="cattle">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Nandi", count: data.nandiCount, emoji: "🐂" },
            {
              label: "Milking Cow",
              count: data.milkingCowCount,
              emoji: "🐄",
            },
            {
              label: "Non-Milking",
              count: data.nonMilkingCowCount,
              emoji: "🐄",
            },
            { label: "Male Calf", count: data.maleCalfCount, emoji: "🐃" },
            {
              label: "Female Calf",
              count: data.femaleCalfCount,
              emoji: "🐃",
            },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              custom={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-xl bg-card border border-border text-center shadow-card"
            >
              <span className="text-2xl">{c.emoji}</span>
              <p className="text-2xl font-heading font-bold text-foreground mt-1">
                {c.count}
              </p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground">
            Total Cattle:{" "}
            <span className="font-bold text-foreground">
              {(data.nandiCount || 0) +
                (data.milkingCowCount || 0) +
                (data.nonMilkingCowCount || 0) +
                (data.maleCalfCount || 0) +
                (data.femaleCalfCount || 0)}
            </span>
          </p>
        </div>
      </motion.div>
    </TabsContent>
    <TabsContent value="social">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        {(data.socialMedia || []).map((sm: any, idx: number) => (
          <SocialBadge
            key={sm.platform + sm.platformId}
            platform={sm.platform}
            platformId={sm.platformId}
            subscriberCount={sm.subscriberCount}
            isVerified={sm.isVerified}
          />
        ))}
        {(data.socialMedia || []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No social media linked
          </p>
        )}
      </motion.div>
    </TabsContent>
  </Tabs>
);

const NGODetails = ({ data }: { data: Record<string, any> }) => (
  <Tabs defaultValue="overview" className="w-full">
    <TabsList className="w-full justify-start bg-secondary/50 mb-6">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="impact">Impact</TabsTrigger>
      <TabsTrigger value="social">Social</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <InfoItem
          icon={Calendar}
          label="Established"
          value={data.yearEstablished}
        />
        <InfoItem icon={Shield} label="Legal Status" value={data.legalStatus} />
        <InfoItem
          icon={Building2}
          label="Registration #"
          value={data.registrationNumber}
        />
        <InfoItem
          icon={Users}
          label="Contact Person"
          value={`${data.contactPerson} (${data.designation})`}
        />
        <InfoItem
          icon={MapPin}
          label="Location"
          value={`${data.city}, ${data.district}, ${data.state}`}
        />
        <InfoItem icon={Globe} label="Website" value={data.website} />
        <InfoItem
          icon={Heart}
          label="Areas of Operation"
          value={data.areasOfOperation}
        />
        <InfoItem
          icon={Shield}
          label="PAN Number"
          value={data.pan || "Not Provided"}
        />
        <div className="flex items-center gap-2">
          <InfoItem
            icon={Building2}
            label="NGO Certificate"
            value={data.ngoCertificate || "Not Provided"}
          />
          <Badge
            variant="outline"
            className={
              data.ngoCertificateStatus === "verified"
                ? "bg-green-100 text-green-700 border-green-200"
                : data.ngoCertificateStatus === "pending"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-red-100 text-red-700 border-red-200"
            }
          >
            {data.ngoCertificateStatus === "verified"
              ? "Verified"
              : data.ngoCertificateStatus === "pending"
                ? "Pending"
                : "Required"}
          </Badge>
        </div>
        <InfoItem
          icon={CheckCircle2}
          label="80G Certificate"
          value={data.has80GCertificate ? "Available" : "No"}
        />
      </motion.div>
    </TabsContent>
    <TabsContent value="impact">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <StatCard
          icon={Building2}
          label="Associated Gaushalas"
          value={data.associatedGaushalas || 0}
        />
        <StatCard
          icon={TrendingUp}
          label="Campaigns"
          value={data.campaigns || 0}
        />
        <StatCard icon={Users} label="Followers" value={data.followers || 0} />
      </motion.div>
    </TabsContent>
    <TabsContent value="social">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        {(data.socialMedia || []).map((sm: any, idx: number) => (
          <SocialBadge
            key={sm.platform + sm.platformId}
            platform={sm.platform}
            platformId={sm.platformId}
            subscriberCount={sm.subscriberCount}
            isVerified={sm.isVerified}
          />
        ))}
        {(data.socialMedia || []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No social media linked
          </p>
        )}
      </motion.div>
    </TabsContent>
  </Tabs>
);

const VolunteerDonorInfluencerDetails = ({
  data,
}: {
  data: Record<string, any>;
  role: UserRole;
}) => (
  <Tabs defaultValue="overview" className="w-full">
    <TabsList className="w-full justify-start bg-secondary/50 mb-6">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="skills">Skills</TabsTrigger>
      <TabsTrigger value="activity">Activity</TabsTrigger>
      <TabsTrigger value="availability">Availability</TabsTrigger>
      <TabsTrigger value="social">Social</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <InfoItem
          icon={MapPin}
          label="Location"
          value={`${data.city}, ${data.state}`}
        />
        {data.age && <InfoItem icon={Calendar} label="Age" value={data.age} />}
        {data.gender && (
          <InfoItem icon={Users} label="Gender" value={data.gender} />
        )}
        <InfoItem icon={Star} label="Experience" value={data.experience} />
        {data.gaushalasKnown && (
          <InfoItem
            icon={Building2}
            label="Gaushalas Known"
            value={data.gaushalasKnown}
          />
        )}
        {(data.activities || []).length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <motion.div
              variants={fadeUp}
              className="p-3 rounded-lg bg-secondary/50"
            >
              <p className="text-xs text-muted-foreground mb-2">
                Preferred Activities
              </p>
              <div className="flex flex-wrap gap-2">
                {data.activities.map((a: string) => (
                  <Badge
                    key={a}
                    variant="outline"
                    className="bg-primary/5 border-primary/20 text-foreground text-xs"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </TabsContent>
    <TabsContent value="availability">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <div className="p-4 rounded-lg bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-2 font-semibold">
            Availability
          </p>
          <div className="flex items-start gap-8 flex-wrap">
            {/* Mock selected slots for demo */}
            {(() => {
              // Example: user selected Weekdays Morning, Weekends Evening
              const selected = {
                anytime: false,
                weekdays: ["Morning"],
                weekends: ["Evening"],
              };
              return (
                <>
                  <div className="flex flex-col gap-2">
                    <span
                      className={
                        selected.anytime
                          ? "inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium flex items-center gap-1"
                          : "inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium"
                      }
                    >
                      {selected.anytime && (
                        <svg
                          className="w-4 h-4 text-green-600 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      Anytime
                    </span>
                  </div>
                  <div className="flex gap-6 flex-wrap">
                    {/* Weekdays */}
                    <div className="bg-orange-50 rounded-xl p-4 min-w-[180px]">
                      <div className="font-semibold text-xs text-blue-900 mb-2">
                        Weekdays
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Morning", "Afternoon", "Evening"].map((slot) => (
                          <span
                            key={slot}
                            className={
                              selected.weekdays.includes(slot)
                                ? "inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-semibold flex items-center gap-1"
                                : "inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold"
                            }
                          >
                            {selected.weekdays.includes(slot) && (
                              <svg
                                className="w-3 h-3 text-green-600 inline mr-1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Weekends */}
                    <div className="bg-orange-50 rounded-xl p-4 min-w-[180px]">
                      <div className="font-semibold text-xs text-blue-900 mb-2">
                        Weekends
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Morning", "Afternoon", "Evening"].map((slot) => (
                          <span
                            key={slot}
                            className={
                              selected.weekends.includes(slot)
                                ? "inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-semibold flex items-center gap-1"
                                : "inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold"
                            }
                          >
                            {selected.weekends.includes(slot) && (
                              <svg
                                className="w-3 h-3 text-green-600 inline mr-1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </motion.div>
    </TabsContent>
    <TabsContent value="skills">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {data.animalCareExp && (
          <InfoItem
            icon={Heart}
            label="Animal Care Experience"
            value={data.animalCareExp}
          />
        )}
        {data.vetSkills && (
          <InfoItem
            icon={Stethoscope}
            label="Veterinary Skills"
            value={data.vetSkills}
          />
        )}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-2">
          {data.hasTransport && (
            <Badge className="gradient-saffron text-primary-foreground gap-1">
              <Truck className="w-3 h-3" /> Transport Available
            </Badge>
          )}
          {data.socialMediaCampaign && (
            <Badge className="gradient-saffron text-primary-foreground gap-1">
              <Camera className="w-3 h-3" /> Social Campaigning
            </Badge>
          )}
          {data.eventOrganizing && (
            <Badge className="gradient-saffron text-primary-foreground gap-1">
              <Users className="w-3 h-3" /> Event Organizing
            </Badge>
          )}
        </motion.div>
      </motion.div>
    </TabsContent>
    <TabsContent value="activity">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <StatCard
          icon={MapPin}
          label="Visits"
          value={
            data.volunteeringVisits ||
            data.donationsCount ||
            data.campaignsCreated ||
            0
          }
        />
        <StatCard
          icon={Clock}
          label="Hours/Donations/Live Streams"
          value={
            data.hoursContributed ||
            data.gaushalasSupported ||
            data.liveStreams ||
            0
          }
        />
        <StatCard
          icon={Star}
          label="Impact/Followers/Posts"
          value={data.impactScore || data.followers || data.posts || 0}
        />
      </motion.div>
    </TabsContent>
    <TabsContent value="social">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        {(data.socialMedia || []).map((sm: any, idx: number) => (
          <SocialBadge
            key={sm.platform + sm.platformId}
            platform={sm.platform}
            platformId={sm.platformId}
            subscriberCount={sm.subscriberCount}
            isVerified={sm.isVerified}
          />
        ))}
        {(data.socialMedia || []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No social media linked
          </p>
        )}
      </motion.div>
    </TabsContent>
  </Tabs>
);

const VendorDetails = ({ data }: { data: Record<string, any> }) => (
  <Tabs defaultValue="overview" className="w-full">
    <TabsList className="w-full justify-start bg-secondary/50 mb-6">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="products">Products</TabsTrigger>
      <TabsTrigger value="performance">Performance</TabsTrigger>
      <TabsTrigger value="social">Social</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <InfoItem
          icon={Building2}
          label="Business Type"
          value={data.businessType}
        />
        <InfoItem
          icon={Users}
          label="Contact Person"
          value={data.contactPerson}
        />
        <InfoItem icon={Shield} label="GST Number" value={data.gstNumber} />
        <InfoItem
          icon={MapPin}
          label="Location"
          value={`${data.city}, ${data.state}`}
        />
        <InfoItem
          icon={MapPin}
          label="Service Radius"
          value={data.serviceRadius}
        />
        <InfoItem icon={Globe} label="Website" value={data.website} />
        <InfoItem icon={MapPin} label="Pincode" value={data.pincode} />
        <InfoItem icon={Building2} label="Address" value={data.address} />
      </motion.div>
    </TabsContent>
    <TabsContent value="products">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.div
          variants={fadeUp}
          className="p-4 rounded-lg bg-secondary/50"
        >
          <p className="text-xs text-muted-foreground mb-2">
            Products & Services
          </p>
          <div className="flex flex-wrap gap-2">
            {(data.productsServices || "").split(",").map((p: string) => (
              <Badge
                key={p.trim()}
                variant="outline"
                className="bg-primary/5 border-primary/20 text-foreground"
              >
                {p.trim()}
              </Badge>
            ))}
          </div>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <InfoItem
            icon={Truck}
            label="Delivery"
            value={data.deliveryAvailable}
          />
          <InfoItem
            icon={Clock}
            label="Payment Terms"
            value={data.paymentTerms}
          />
          <InfoItem
            icon={Star}
            label="Rating"
            value={data.rating ? `${data.rating} / 5` : undefined}
          />
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          {data.bulkOrders && (
            <Badge className="gradient-saffron text-primary-foreground">
              Bulk Orders
            </Badge>
          )}
          {data.customOrders && (
            <Badge className="gradient-saffron text-primary-foreground">
              Custom Orders
            </Badge>
          )}
          {data.emergencyService && (
            <Badge className="gradient-saffron text-primary-foreground">
              Emergency Service
            </Badge>
          )}
        </motion.div>
      </motion.div>
    </TabsContent>
    <TabsContent value="performance">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <StatCard
          icon={MessageSquare}
          label="Quotes Completed"
          value={data.quotesCompleted || 0}
        />
        <StatCard
          icon={Truck}
          label="Orders Delivered"
          value={data.ordersDelivered || 0}
        />
        <StatCard icon={Star} label="Rating" value={data.rating || "N/A"} />
        <StatCard icon={Users} label="Followers" value={data.followers || 0} />
      </motion.div>
    </TabsContent>
    <TabsContent value="social">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3"
      >
        {(data.socialMedia || []).map((sm: any, idx: number) => (
          <SocialBadge
            key={sm.platform + sm.platformId}
            platform={sm.platform}
            platformId={sm.platformId}
            subscriberCount={sm.subscriberCount}
            isVerified={sm.isVerified}
          />
        ))}
        {(data.socialMedia || []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No social media linked
          </p>
        )}
      </motion.div>
    </TabsContent>
  </Tabs>
);

// ─── Main Profile Page ──────────────────────────────────────────────

const Profile = () => {
  // Simulate backend user object
  const Dummyuser = {
    name: "Arjun Patel",
    email: "arjun.patel@gmail.com",
    mobile: "+91 99887 76655",
    profilePhoto: "",
    bio: "Passionate about Gau Seva with 5+ years of volunteering experience. Skilled in animal care, event organizing, and social media awareness campaigns.",
    city: "Ahmedabad",
    district: "Ahmedabad",
    state: "Gujarat",
    followers: 340,
    posts: 45,
    website: "",
    roles: ["gaushala"],
    // Role-specific data
    volunteer: mockProfiles.volunteer,
    donor: mockProfiles.donor,
    influencer: mockProfiles.influencer,
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(Dummyuser);
  const { userId, role } = useAuthStore();

  async function getUserProfile() {
    setLoading(true);
    setError(null);
    try {
      if (role === "gaushala") {
        const gaushalaProfileData = await getGaushalaProfile(userId);
        console.log({ gaushalaProfileData: gaushalaProfileData.data.gaushala });
        setUser(gaushalaProfileData.data.gaushala);
      }
      if (role === "ngo") {
        const ngoProfileData = await getNGOProfile(userId);
        console.log({ ngoProfileData });
      }
      if (["volunteer", "donor", "influencer"].includes(role)) {
        const userProfileData = await getVolunteerDonorInfluencerProfile(
          userId,
          role as "volunteer" | "donor" | "influencer",
        );
        console.log({ userProfileData });
      }
      if (role === "vendor") {
        const vendorProfileData = await getVendorProfile(userId);
        console.log({ vendorProfileData });
      }
    } catch (e) {
      setError("Failed to load user profile. Please try again later.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserProfile();
  }, [userId]);

  if (loading) return <ProfileSkeleton />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-card text-center">
          <h2 className="text-xl font-bold mb-2">
            Something went wrong while loading the Profile Page
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );

  console.log(user);

  // Common profile header
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-card">
            <div className="h-40 lg:h-52 gradient-saffron relative">
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="relative px-6 lg:px-8 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                >
                  <Avatar className="w-28 h-28 border-4 border-card shadow-warm">
                    <AvatarImage src={user.profilePhoto} />
                    <AvatarFallback className="gradient-saffron text-primary-foreground text-3xl font-heading font-bold">
                      {user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="flex-1 pt-2 sm:pt-0 sm:pb-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                      {user.name}
                    </h1>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </Button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-5 space-y-3"
              >
                {user.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {user.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {user.mobile}
                  </span>
                  {user.website && (
                    <span className="inline-flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-primary" />{" "}
                      {user.website}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Role-specific content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          {/* Gaushala, NGO, Vendor are mutually exclusive */}
          {/* If user has one of these roles, render their section */}
          {user.roles.includes("gaushala") && <GaushalaDetails data={user} />}
          {user.roles.includes("ngo") && <NGODetails data={user} />}
          {user.roles.includes("vendor") && <VendorDetails data={user} />}

          {/* Render unified Volunteer/Donor/Influencer section if user has any of those roles */}
          {user.roles.some((r) =>
            ["volunteer", "donor", "influencer"].includes(r),
          ) && (
            <div className="mb-8">
              <h2 className="text-xl font-heading font-bold mb-2 text-foreground">
                Volunteer / Donor / Influencer
              </h2>
              <VolunteerDonorInfluencerDetails
                data={user.volunteer}
                role={"volunteer" as UserRole}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
