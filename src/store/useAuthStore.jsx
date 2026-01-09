import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from "axios";
import { jwtDecode } from "jwt-decode";  // Note: named import, not default

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('https://vsavebackend-31d8.onrender.com/admin/login', {
            email,
            password,
          });
          
          console.log(response);
          
          if (response.data.Status === "success") {
            const token = response.data.token;
            let decoded = null;
            
            try {
              decoded = jwtDecode(token);  // Changed to jwtDecode
            } catch (decodeError) {
              console.error("Failed to decode token:", decodeError);
            }
            
            set({
              user: decoded,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
            
          } else {
            set({ isLoading: false });
            return { 
              success: false, 
              error: response.data.message || "Login failed" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || error.message || "Login failed" 
          };
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      
      validateToken: () => {
        const token = get().token;
        if (!token) return false;
        
        try {
          const decoded = jwtDecode(token);  // Changed to jwtDecode
          if (!decoded) return false;
          
          // Check if token is expired
          if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            get().logout();
            return false;
          }
          
          return true;
        } catch (error) {
          console.error("Token validation error:", error);
          return false;
        }
      },
      
      checkAuth: () => {
        const token = get().token;
        return !!token && get().validateToken();
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : userData
        }));
      },
      
      initializeFromToken: (token) => {
        try {
          const decoded = jwtDecode(token);  // Changed to jwtDecode
          set({
            user: decoded,
            token: token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Failed to initialize from token:", error);
        }
      },
      
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          try {
            const decoded = jwtDecode(state.token);  // Changed to jwtDecode
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
              state.isAuthenticated = false;
              state.user = null;
              state.token = null;
            }
          } catch (error) {
            console.error("Rehydration error:", error);
          }
        }
      },
    }
  )
);

export default useAuthStore;