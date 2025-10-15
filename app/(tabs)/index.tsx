import { batteryApi, BatteryData } from "@/services/api";
import { websocketService } from "@/services/websocket";
import styles from "@/styles/homeStyles";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

// Mock data for development (when backend is not available)
const MOCK_DATA: BatteryData = {
  id: "mock-1",
  voltage: 11.84,
  percentage: 78,
  timestamp: Date.now(),
  dateTime: new Date().toISOString(),
};

const generateMockHistoricalData = (): BatteryData[] => {
  const data: BatteryData[] = [];
  const now = Date.now();
  for (let i = 9; i >= 0; i--) {
    data.push({
      id: `mock-${i}`,
      voltage: 11.5 + Math.random() * 0.5,
      percentage: 75 + Math.random() * 10,
      timestamp: now - i * 3600000, // 1 hour intervals
      dateTime: new Date(now - i * 3600000).toISOString(),
    });
  }
  return data;
};

export default function HomeScreen() {
  const [batteryData, setBatteryData] = useState<BatteryData | null>(null);
  const [historicalData, setHistoricalData] = useState<BatteryData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const [demoModeLogged, setDemoModeLogged] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch latest data
      const latest = await batteryApi.getLatest();
      if (latest) {
        setBatteryData(latest);
        setUseMockData(false);
      }

      // Fetch historical data for chart
      const historical = await batteryApi.getLastMonth();
      if (historical.length > 0) {
        setHistoricalData(historical);
      }
    } catch {
      // Only log once to reduce console noise
      if (!demoModeLogged) {
        console.log("📱 Backend offline - using demo mode with mock data");
        setDemoModeLogged(true);
      }

      // Use mock data as fallback
      setBatteryData(MOCK_DATA);
      setHistoricalData(generateMockHistoricalData());
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  }, [demoModeLogged]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
    setupWebSocket();

    return () => {
      websocketService.disconnect();
    };
  }, [fetchInitialData]);

  const setupWebSocket = () => {
    const socket = websocketService.connect();

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to real-time data");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from real-time data");
    });

    websocketService.onBatteryData((data: BatteryData) => {
      console.log("Received real-time data:", data);
      setBatteryData(data);

      // Update historical data
      setHistoricalData((prev) => {
        const newData = [...prev, data];
        // Keep only last 30 data points for chart
        return newData.slice(-30);
      });
    });
  };

  const getBatteryColor = (level: number) => {
    if (level >= 60) return "#8BA339";
    if (level >= 30) return "#F59E0B";
    return "#EF4444";
  };

  const getVoltageStatus = (voltage: number) => {
    if (voltage >= 10.5 && voltage <= 12.6) return "System Healthy";
    if (voltage < 10.5) return "Low Voltage";
    return "High Voltage";
  };

  const calculateVoltageProgress = (voltage: number) => {
    const min = 10.5;
    const max = 12.6;
    const percentage = ((voltage - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  // Prepare chart data from historical data
  const prepareChartData = () => {
    if (historicalData.length === 0) {
      return {
        labels: Array(10).fill(""),
        datasets: [{ data: Array(10).fill(0), strokeWidth: 3 }],
      };
    }

    // Take last 10 data points
    const last10 = historicalData.slice(-10);

    return {
      labels: last10.map((_, index) => ""),
      datasets: [
        {
          data: last10.map((d) => d.voltage || 0),
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartData = prepareChartData();
  const batteryLevel = batteryData?.percentage || 0;
  const voltage = batteryData?.voltage || 0;
  const voltageProgress = calculateVoltageProgress(voltage);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#8BA339" />
        <Text style={{ marginTop: 16, color: "#666666" }}>
          Loading battery data...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Status Badge */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi!</Text>
          <Text style={styles.welcomeText}>Welcome back user</Text>
        </View>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isConnected
                  ? "#8BA339"
                  : useMockData
                  ? "#F59E0B"
                  : "#EF4444",
              },
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? "Live Data" : useMockData ? "Demo Mode" : "Offline"}
          </Text>
        </View>
      </View>

      {/* Battery Level Card - Enhanced */}
      <View style={styles.batteryCard}>
        <View style={styles.batteryContent}>
          <View style={styles.cardHeader}>
            <Ionicons name="battery-charging" size={24} color="#FFFFFF" />
            <Text style={styles.cardTitle}>Battery Level</Text>
          </View>
          <Text style={styles.batteryPercentage}>{batteryLevel}%</Text>
          <View style={styles.estimatedContainer}>
            <Ionicons name="time-outline" size={18} color="#FFFFFF" />
            <Text style={styles.estimatedDistance}>
              {batteryData?.dateTime
                ? new Date(batteryData.dateTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "No data"}
            </Text>
          </View>
        </View>
        <View style={styles.batteryBar}>
          <View
            style={[
              styles.batteryFill,
              {
                height: `${batteryLevel}%`,
                backgroundColor: getBatteryColor(batteryLevel),
              },
            ]}
          />
        </View>
      </View>

      {/* Voltage Info Card - Full Width */}
      <View style={styles.voltageInfoCard}>
        <View style={styles.voltageHeader}>
          <View style={styles.voltageIconLarge}>
            <Ionicons name="flash" size={36} color="#8BA339" />
          </View>
          <View style={styles.voltageHeaderText}>
            <Text style={styles.voltageLabel}>Current Voltage</Text>
            <Text style={styles.voltageValue}>{voltage.toFixed(2)}v</Text>
          </View>
        </View>

        <View style={styles.voltageStatusContainer}>
          <View style={styles.voltageStatusBadge}>
            <Ionicons
              name={
                voltage >= 10.5 && voltage <= 12.6
                  ? "checkmark-circle"
                  : "warning"
              }
              size={16}
              color={voltage >= 10.5 && voltage <= 12.6 ? "#8BA339" : "#F59E0B"}
            />
            <Text style={styles.voltageStatusText}>
              {getVoltageStatus(voltage)}
            </Text>
          </View>
          <View style={styles.voltageRange}>
            <Text style={styles.voltageRangeLabel}>Normal Range</Text>
            <Text style={styles.voltageRangeValue}>10.5v - 12.6v</Text>
          </View>
        </View>

        <View style={styles.voltageProgress}>
          <View style={styles.voltageProgressBar}>
            <View
              style={[
                styles.voltageProgressFill,
                { width: `${voltageProgress}%` },
              ]}
            />
          </View>
          <View style={styles.voltageProgressLabels}>
            <Text style={styles.voltageProgressLabel}>10.5v</Text>
            <Text style={styles.voltageProgressLabel}>12.6v</Text>
          </View>
        </View>
      </View>

      {/* Voltage Chart Card - Enhanced */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Voltage Monitor</Text>
            <Text style={styles.chartSubtitle}>Real-time Data</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(139, 163, 57, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "0",
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: "#e0e0e0",
              strokeDasharray: "0",
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          segments={4}
        />
        <View style={styles.chartFooter}>
          <View style={styles.chartLegend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Voltage Level</Text>
          </View>
          <Text style={styles.chartRange}>
            {historicalData.length} data points
          </Text>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}
