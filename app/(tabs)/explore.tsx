import { API_BASE_URL, batteryApi } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LogScreen() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [statsLogged, setStatsLogged] = useState(false);
  const [stats, setStats] = useState({
    totalRecords: 0,
    lastExport: null as Date | null,
    avgVoltage: 0,
    avgBattery: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const data = await batteryApi.getLastMonth();
      if (data.length > 0) {
        const avgVoltage =
          data.reduce((sum, d) => sum + d.voltage, 0) / data.length;
        const avgBattery =
          data.reduce((sum, d) => sum + d.percentage, 0) / data.length;

        setStats({
          totalRecords: data.length,
          lastExport: new Date(),
          avgVoltage: avgVoltage,
          avgBattery: avgBattery,
        });
      }
    } catch {
      // Use mock stats as fallback - only log once
      if (!statsLogged) {
        console.log("📱 Log page using demo statistics");
        setStatsLogged(true);
      }
      setStats({
        totalRecords: 720, // 30 days * 24 hours
        lastExport: null,
        avgVoltage: 11.7,
        avgBattery: 76.5,
      });
    }
  }, [statsLogged]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleDownloadCSV = async () => {
    try {
      setIsDownloading(true);

      // Open CSV export URL in browser
      const csvUrl = `${API_BASE_URL}/api/battery/export-csv`;
      const supported = await Linking.canOpenURL(csvUrl);

      if (supported) {
        await Linking.openURL(csvUrl);
        Alert.alert("Success", "CSV download started!");
        setStats((prev) => ({ ...prev, lastExport: new Date() }));
      } else {
        Alert.alert("Error", "Cannot open URL: " + csvUrl);
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
      Alert.alert(
        "Info",
        "Backend server is not running. Please start the server to download CSV files."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Battery Log</Text>
        <Text style={styles.subtitle}>History & Data Export</Text>
      </View>

      {/* Download CSV Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="cloud-download-outline" size={48} color="#8BA339" />
          </View>

          <Text style={styles.cardTitle}>Export Log Data</Text>
          <Text style={styles.cardDescription}>
            Download complete battery monitoring data in CSV format for analysis
          </Text>

          <TouchableOpacity
            style={[
              styles.downloadButton,
              isDownloading && styles.downloadButtonDisabled,
            ]}
            onPress={handleDownloadCSV}
            activeOpacity={0.7}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="download-outline" size={24} color="#FFFFFF" />
            )}
            <Text style={styles.downloadButtonText}>
              {isDownloading ? "Opening..." : "Download CSV File"}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#8BA339" />
              <Text style={styles.infoText}>
                Last export: {formatTimeAgo(stats.lastExport)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#8BA339"
              />
              <Text style={styles.infoText}>
                Total records: {stats.totalRecords.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Log Summary Card */}
      <View style={styles.cardContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Log Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats.totalRecords}</Text>
              <Text style={styles.summaryLabel}>Data Points</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {stats.avgVoltage.toFixed(1)}v
              </Text>
              <Text style={styles.summaryLabel}>Avg Voltage</Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.round(stats.avgBattery)}%
              </Text>
              <Text style={styles.summaryLabel}>Avg Battery</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>30</Text>
              <Text style={styles.summaryLabel}>Days Tracked</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 42,
    fontWeight: "700",
    color: "#6B7B28",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#8BA339",
    fontWeight: "500",
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8EFBE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6B7B28",
    marginBottom: 10,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: "#8BA339",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "center",
    shadowColor: "#8BA339",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  downloadButtonDisabled: {
    backgroundColor: "#999999",
    shadowColor: "#999999",
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoContainer: {
    marginTop: 20,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#E8EFBE",
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7B28",
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    marginHorizontal: 5,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8BA339",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  spacer: {
    height: 100,
  },
});
