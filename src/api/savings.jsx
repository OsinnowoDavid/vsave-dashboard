import apiClient from "./apiClient";

export const createSavings = async (   subRegion,
      savingsTitle,
      frequency,
      savingsAmount,
      deductionPeriod,
      duration
    ) => {
console.log(subRegion,
      savingsTitle,
      frequency,
      savingsAmount,
      deductionPeriod,
      duration)
  try {

    // Use relative path since apiClient already has baseURL
    const response = await apiClient.post(
      "/savings/create-savingsplan" , // Relative path only
      subRegion,
      savingsTitle,
      frequency,
      savingsAmount,
      deductionPeriod,
      duration
 // Single data object
    );
    
    console.log("API Response:", response);
    
    return {
      data: response.data,
      message: response.data.message || "Savings created successfully",
      status: response.status
    };
    
  } catch (error) {
    console.error('Error creating savings plan:', error);
    
    // Return error object instead of throwing
    return {
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
};