import apiClient from "./apiClient";

export const getAllAdmin = async () => {
  try {
    const response = await apiClient.get("/admin/get-all-admin");
    return response.data; // ✅ Consistent: returns data only
  } catch (error) {
    console.error("Error fetching admin profile:", error);

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to fetch admin profile",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to fetch profile: " + error.message);
    }
  }
};

export const getRegion = async () => {
  try {
    const response = await apiClient.get("/admin/get-all-region");
    return response.data; // ✅ Changed: now returns data only (consistent with getAllAdmin)
  } catch (error) {
    console.error("Error fetching region data:", error); // ✅ Better error message

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to fetch region data",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to fetch region data: " + error.message);
    }
  }
};

export const createRegion = async (newRegion) => {
  try {
    const response = await apiClient.post("/admin/create-region", newRegion); // ✅ Added await
    return response.data; // ✅ Consistent: returns data only
  } catch (error) {
    console.error("Error creating region:", error);

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to create region",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to create region: " + error.message);
    }
  }
};

export const createTeam = async (teamForm) => {
  try {
    const response = await apiClient.post("/admin/create-area", teamForm); // ✅ Added await
    return response.data; // ✅ Consistent: returns data only
  } catch (error) {
    console.error("Error creating team:", error);

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to create team",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to create team: " + error.message);
    }
  }
};

export const getAllteam = async () => {
  try {
    const response = await apiClient.get("/admin/get-all-area");
    return response.data; // ✅ Consistent: returns data only
  } catch (error) {
    console.error("Error fetching team data:", error); // ✅ Better error message

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to fetch team data",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to fetch team data: " + error.message);
    }
  }
};

export const getAllTeams = async () => {
  try {
    const response = await apiClient.get("/admin/get-all-team");
    return response.data; // ✅ Consistent: returns data only
  } catch (error) {
    console.error("Error fetching team data:", error); // ✅ Better error message

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to fetch team data",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to fetch team data: " + error.message);
    }
  }
};

export const createMarket = async (marketForm) => {
  try {
    const response = await apiClient.post("/admin/create-agent", marketForm); // ✅ Added await
    return response.data; // ✅ Consistent: returns data only
  } catch (error) {
    console.error("Error creating market:", error);

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to create market",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to create market: " + error.message);
    }
  }
};

export const getAllMarkets = async () => {
  try {
    const response = await apiClient.get("/admin/get-all-agent");
    return response.data; // ✅ Consistent: returns data only
  } catch (error) {
    console.error("Error fetching market data:", error); // ✅ Better error message

    if (error.response) {
      throw {
        message: error.response.data?.message || "Failed to fetch market data",
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("Failed to fetch market data: " + error.message);
    }
  }
};
// Removed duplicate getRegion function 