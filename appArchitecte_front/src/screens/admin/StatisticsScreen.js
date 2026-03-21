import React from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import { Text, Card } from "react-native-paper";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 40;

export default function StatisticsScreen({ stats }) {
  const userPieData = [
    { name: "Actifs", population: stats.active_users, color: "#22d3ee", legendFontColor: "#333", legendFontSize: 13 },
    { name: "Inactifs", population: stats.inactive_users, color: "#a78bfa", legendFontColor: "#333", legendFontSize: 13 }
  ];

  return (
    <ScrollView style={{ flex: 1 }}>
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Répartition des utilisateurs</Text>
          <PieChart
            data={userPieData}
            width={screenWidth}
            height={200}
            chartConfig={{ color: () => "#000" }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>Utilisateurs actifs vs inactifs</Text>
          <LineChart
            data={{ labels: ["Actifs", "Inactifs"], datasets: [{ data: [stats.active_users, stats.inactive_users] }] }}
            width={screenWidth}
            height={200}
            chartConfig={{
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(31,31,31,${opacity})`,
              labelColor: () => "#6b7280",
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#c7a17a" }
            }}
            style={styles.chartStyle}
            fromZero
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    borderRadius: 20, backgroundColor: "#ffffff", marginBottom: 22, paddingVertical: 18, paddingHorizontal: 10,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 3, borderWidth: 1, borderColor: "#f2f2f2"
  },
  chartTitle: { fontSize: 16, fontWeight: "600", color: "#1f1f1f", marginBottom: 15, textAlign: "center" },
  chartStyle: { borderRadius: 14 }
});