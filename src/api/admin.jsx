import axios from "axios"
import apiClient from "./apiClient";
export const createAdmin = async ( token, firstName,
          lastName,
          email,
          phoneNumber,
          confirmPassword,
          role,
          status)=>{
    // const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJlZ2lvbiI6W10sInN1YlJlZ2lvbiI6W10sIl9pZCI6IjY5NGNiZjNjMDAyYmY1NDcyOTdiNjA4OSIsImZpcnN0TmFtZSI6IkRhbmlsbyIsImxhc3ROYW1lIjoiT21vdGVoaW5zZSIsImVtYWlsIjoib21vdGVoaW5zZTk5QGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiMDkwNTYyMDc3ODgiLCJwYXNzd29yZCI6IiRhcmdvbjJpZCR2PTE5JG09NjU1MzYsdD0zLHA9NCRudFNMNmNQdllDNWd3SnZtY044UTlRJGU2YjM1eWVqalFiQWgwSjFsc1pYWFNEUS80bUlNRlh4VFdtYVErbDBodkEiLCJyb2xlIjoiU1VQRVIgQURNSU4iLCJfX3YiOjB9LCJlbWFpbCI6Im9tb3RlaGluc2U5OUBnbWFpbC5jb20iLCJleHAiOjE3Njc3MTcyMTMsImlhdCI6MTc2NzcxMDAxM30.isOutPhwmoDf_DQoml5Wq4CnElWZL3HK-DJmvwbdz-E"
    console.log("API TOKEN",token)
  try {
    // Create config object - note: headers should be lowercase


    const response = await apiClient.post(
      "https://vsavebackend-31d8.onrender.com/admin/register",
      firstName,
          lastName,
          email,
          phoneNumber,
          confirmPassword,
          role,
          status,
    );
    
    
    // Uncomment and return success response
    return response
    
  } catch (error) {
    console.error('Error creating savings:', error);
    
    return {
      error: error.response?.data?.message || error.message || 'Failed to create savings plan',
      status: error.response?.status,
      data: error.response?.data
    };
  }

}


export const createRegion = async (token, regionData) => {
  try {
     // Create config object - note: headers should be lowercase
    const config = {
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
    };

    // Only include authorization header if token exists
    if (!token) {
      delete config.headers.authorization;
    }


    const response = await axios.post(
      "https://vsavebackend-31d8.onrender.com/admin/create-region",
      regionData,
      config,
    );
console.log("create-region",response)
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Region created successfully',
      status: response.status
    };
  } catch (error) {
    console.error('Error creating region:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create region',
      status: error.response?.status || 500,
      error: error.response?.data || error.message
    };
  }
};
export const createAdminPassword = async (formDate)=>{
  try {
    const response = await apiClient.post("/admin/create-password", formDate)
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
    
  }

}


export const getAdminProfile = async () => {
  try {
    const response = await apiClient.get("/admin/profile"); // Use relative path if base URL is configured in apiClient
    return response.data; // Return the data, not the full response object
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      
      throw {
        message: error.response.data?.message || "Failed to fetch profile",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      throw new Error("Failed to fetch profile: " + error.message);
    }
  }
};

export const getAllAdmin = async () => {
  try {
    const response = await apiClient.get("/admin/get-all-admin"); // Use relative path if base URL is configured in apiClient
    return response.data; // Return the data, not the full response object
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      
      throw {
        message: error.response.data?.message || "Failed to fetch profile",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      throw new Error("Failed to fetch profile: " + error.message);
    }
  }
};
export const GetUsers = async () => {
  try {
    const response = await apiClient.get("/admin/get-all-user"); // Use relative path if base URL is configured in apiClient
    return response.data; // Return the data, not the full response object
  } catch (error) {
    console.error("Error fetching users:", error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      
      throw {
        message: error.response.data?.message || "Failed to fetch profile",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      throw new Error("Failed to fetch profile: " + error.message);
    }
  }
};

export const updateAdminProfile = async (updateData) => { // Changed function name and added parameter
  try {
    // Make sure updateData is provided and is an object
    if (!updateData || typeof updateData !== 'object') {
      throw new Error("Update data is required and must be an object");
    }
    
    const response = await apiClient.post("/admin/update", updateData); // Added updateData as request body
    return response.data; // Return the data
  } catch (error) {
    console.error("Error updating admin profile:", error);
    
    if (error.response) {
      console.error("Response error:", error.response.data);
      
      throw {
        message: error.response.data?.message || "Failed to update profile",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      console.error("Error:", error.message);
      throw new Error("Failed to update profile: " + error.message);
    }
  }
};

export const getData = async()=>{
  try {
    const response = await apiClient.get("/admin/get-dashboardDetails")
    return response
  } catch (error) {
    console.log(error)
  }
}

export const deleteAdmin = async(id)=>{
  try {
    const response = await apiClient.delete("/admin/"+id)
    console.log(response)
    return response
    
  } catch (error) {
    
  }
}
export const updateAdmin = async()=>{
  try {
     const response = await apiClient.post("")
    console.log(response)
    return response
  } catch (error) {
    
  }
}