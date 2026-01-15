import apiClient from "./apiClient";

export const createSavings = async (formData) => {
  console.log('Creating savings plan with data:', formData);
  
  try {
    // Use relative path since apiClient already has baseURL
    const response = await apiClient.post(
      "/savings/create-savingsplan", // Relative path only
      formData // Pass the entire formData object as the request body
    );
    
    console.log("API Response:", response);
    
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Savings created successfully",
      status: response.status
    };
    
  } catch (error) {
    console.error('Error creating savings plan:', error);
    
    // Return error object instead of throwing
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to create savings plan",
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

export const getUserSavings = async ()=>{
    try {
    const response = await apiClient.get("/admin/user-savings-record")
        console.log("user-savings-DATA", response)
        return response.data
    } catch (error) {
        console.log(error)
    }

}

export const adminSavingsData = async ()=>{
    try {
    const response = await apiClient.get("/admin/all-admin-created-savings")
        console.log("admin-savings-DATA", response)
        return response.data
    } catch (error) {
        console.log(error)
    }

}