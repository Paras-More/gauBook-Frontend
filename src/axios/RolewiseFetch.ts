// now here i will take role as pararmeter and return the data according to that role
// So the roles are  as 'gaushala', 'ngo', 'volunteer',  'user' => this is for donor, 'influencer', 'vendor'

import API from "./api";

export const fetchRolewiseData = async (role: string) => {
  try {
    const response = await API.get(`${role}/get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rolewise data:", error);
    throw error;
  }
};
