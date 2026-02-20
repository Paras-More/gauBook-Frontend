import API from "./api";
export const registerGaushala = async (formData: {}) => {
  try {
    const response = await API.post("/gaushala/register", formData);
    return response.data;
  } catch (error) {
    console.error("Error registering Gaushala:", error);
    throw error;
  }
};

export const registerNgo = async (formData: {}) => {
  try {
    const response = await API.post("/ngo/register", formData);
    return response.data;
  } catch (error) {
    console.error("Error registering NGO:", error);
    throw error;
  }
};

// The below registration functions are for both User and Vendor, as they share the same endpoint structure.
export const registerUser = async (formData: {}) => {
  try {
    const response = await API.post("/user/register", formData);
    return response.data;
  } catch (error) {
    console.error("Error registering User:", error);
    throw error;
  }
};

export const registerVendor = async (formData: {}) => {
  try {
    const response = await API.post("/vendor/register", formData);
    return response.data;
  } catch (error) {
    console.error("Error registering Vendor:", error);
    throw error;
  }
};
