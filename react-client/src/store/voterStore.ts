import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, authHeaders } from "@/lib/api";

interface Voter {
  _id: string;
  epicId: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  constituency_number: string;
  constituency_name: string;
  state?: string;
  state_number?: number;
  part_number: string;
  part_name: string;
  polling_station: string;
  photo: string;
  qr_code: string;
  createdAt: string;
  updatedAt: string;
}

interface VoterState {
  voter: Voter | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (epicId: string, password: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useVoterStore = create<VoterState>()(
  persist(
    (set, get) => ({
      voter: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (epicId, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/voters/login", { epicId, password });

          const { user, accessToken } = response.data.data;

          set({
            voter: user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || error.message || "Login failed";

          set({ error: message, isLoading: false });
          throw error;
        }
      },
      fetchProfile: async () => {
        const { accessToken } = get();

        if (!accessToken) return;

        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/voters/profile", {
            headers: authHeaders(accessToken),
          });

          set({
            voter: response.data.data,
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch profile";

          // If unauthorized, maybe logout?
          if (error.response?.status === 401) {
            set({
              voter: null,
              accessToken: null,
              isAuthenticated: false,
              error: message,
              isLoading: false,
            });
          } else {
            set({ error: message, isLoading: false });
          }
        }
      },
      logout: async () => {
        const { accessToken } = get();

        try {
          if (accessToken) {
            await api.post(
              "/voters/logout",
              {},
              {
                headers: authHeaders(accessToken),
              },
            );
          }
        } catch (error) {
          console.error("Logout failed on server", error);
        } finally {
          set({ voter: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "voter-storage",
    },
  ),
);
