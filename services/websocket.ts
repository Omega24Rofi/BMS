import { io, Socket } from "socket.io-client";
import { API_BASE_URL, BatteryData } from "./api";

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected to real-time data");
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      this.reconnectAttempts++;
      // Only log on first few attempts to reduce noise
      if (this.reconnectAttempts <= 2) {
        console.warn("🔴 WebSocket connection failed - using demo mode");
      }
    });

    this.socket.on("error", (error) => {
      // Reduce error noise in console
      if (this.reconnectAttempts <= 2) {
        console.warn("🔴 WebSocket error - backend might be offline");
      }
    });
  }

  onBatteryData(callback: (data: BatteryData) => void) {
    if (!this.socket) {
      console.warn("Socket not initialized. Call connect() first.");
      return;
    }
    this.socket.on("battery-data", callback);
  }

  offBatteryData(callback?: (data: BatteryData) => void) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off("battery-data", callback);
    } else {
      this.socket.off("battery-data");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
