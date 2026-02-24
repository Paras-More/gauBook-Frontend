import API from "./api";

export const loginUser = async (formData: {}) => {
  try {
    const response = await API.post("/user/login", formData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const loginVendor = async (formData: {}) => {
  try {
    const response = await API.post("/vendor/login", formData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const loginGaushala = async (formData: {}) => {
  try {
    const response = await API.post("/gaushala/login", formData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const loginNgo = async (formData: {}) => {
  try {
    const response = await API.post("/ngo/login", formData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
