import API from "./api";

export const getGaushalaProfile = async (userId: string) => {
  console.log("Fetching profile for userId:", userId);
  try {
    const response = await API.get(`/gaushala/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gaushala profile:", error);
    throw error;
  }
};
export const getNGOProfile = async (userId: string) => {
  console.log("Fetching profile for userId:", userId);
  try {
    const response = await API.get(`/ngo/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NGO profile:", error);
    throw error;
  }
};
export const getVendorProfile = async (userId: string) => {
  console.log("Fetching profile for userId:", userId);
  try {
    const response = await API.get(`/vendor/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    throw error;
  }
};
export const getVolunteerDonorInfluencerProfile = async (
  userId: string,
  role: "volunteer" | "donor" | "influencer",
) => {
  console.log(`Fetching ${role} profile for userId:`, userId);
  try {
    const response = await API.get(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${role} profile:`, error);
    throw error;
  }
};
