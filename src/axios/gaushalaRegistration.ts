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
