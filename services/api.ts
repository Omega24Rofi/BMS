import { API_CONFIG } from "@/config/api.config";
import axios from "axios";

// API Configuration
export const API_BASE_URL = API_CONFIG.BASE_URL;

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface BatteryData {
  id: string;
  voltage: number;
  percentage: number;
  timestamp: number;
  dateTime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  startDate?: string;
  endDate?: string;
}

export interface SystemStatus {
  mqtt: {
    connected: boolean;
    broker: string;
    topic: string;
  };
  firebase: {
    connected: boolean;
    database: string;
  };
  websocket: {
    active: boolean;
    clients: number;
  };
}

// API Methods
export const batteryApi = {
  // Get latest battery data
  getLatest: async (): Promise<BatteryData | null> => {
    try {
      const response = await apiClient.get<ApiResponse<BatteryData>>(
        "/api/battery/latest"
      );
      return response.data.data || null;
    } catch (error) {
      // Silent fail for demo mode - error will be caught by component
      throw error;
    }
  },

  // Get last month data
  getLastMonth: async (): Promise<BatteryData[]> => {
    try {
      const response = await apiClient.get<ApiResponse<BatteryData[]>>(
        "/api/battery/last-month"
      );
      return response.data.data || [];
    } catch (error) {
      // Silent fail for demo mode - error will be caught by component
      throw error;
    }
  },

  // Get data by date range
  getByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<BatteryData[]> => {
    try {
      const response = await apiClient.get<ApiResponse<BatteryData[]>>(
        "/api/battery/range",
        {
          params: { startDate, endDate },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching date range data:", error);
      return [];
    }
  },

  // Get system status
  getStatus: async (): Promise<SystemStatus | null> => {
    try {
      const response = await apiClient.get<
        ApiResponse<{ status: SystemStatus }>
      >("/api/battery/status");
      return response.data.data?.status || null;
    } catch (error) {
      console.error("Error fetching system status:", error);
      return null;
    }
  },

  // Export CSV
  exportCSV: async (
    startDate?: string,
    endDate?: string
  ): Promise<Blob | null> => {
    try {
      const response = await apiClient.get("/api/battery/export-csv", {
        params: { startDate, endDate },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error downloading CSV:", error);
      return null;
    }
  },
};

export default apiClient;
