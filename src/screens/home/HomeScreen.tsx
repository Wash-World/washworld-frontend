import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAppSelector } from "../../store";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

import { useMemberships } from "../../hooks/useMemberships";
import { useLocations } from "../../hooks/useLocations";
import { useWashHistory } from "../../hooks/useWashHistory";

const Card: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

export default function HomeScreen() {
  const user = useAppSelector((s) => s.auth.user);

  //Membership & price
  const { data: plans = [], isLoading: plansLoading } = useMemberships();
  const currentPlan = useMemo(() => plans.find((p) => p.plan === user.membership_plan), [plans, user.membership_plan]);
  const planPrice = currentPlan ? `${currentPlan.price},- kr` : "DKK 0,-";

  //Locations lookup
  const { data: locations = [] } = useLocations();
  const nameById = useMemo(() => Object.fromEntries(locations.map((l) => [l.Location_id, l.name])) as Record<string, string>, [locations]);

  // Wash history (most recent 5)
  const { data: history = [], isLoading: historyLoading, isError: historyError } = useWashHistory();
  const recent = history.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hello, {user?.name || "Guest"}</Text>

        <Text style={styles.sectionTitle}>Your car</Text>
        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{user?.carplate || "No plate"}</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Your location: <Text style={styles.locationNameText}>{user?.all_locations ? "All" : nameById[user.assigned_location_api_id] ?? `#${user.assigned_location_api_id}`}</Text>
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Your plan</Text>
        {plansLoading ? (
          <ActivityIndicator color={colors.greenBrand} />
        ) : (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{user?.membership_plan || "None"}</Text>
              <Text style={styles.planPrice}>{planPrice}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.upgradeLink}>Want to change plan?</Text>
            </TouchableOpacity>
          </Card>
        )}

        <Text style={styles.sectionTitle}>Your favourite locations</Text>
        {(user?.favorites || []).length === 0 ? (
          <Text style={styles.emptyText}>No favourites yet</Text>
        ) : (
          user.favorites.map((locId: string | number, i: React.Key | null | undefined) => (
            <Card key={i} style={styles.favoriteCard}>
              <Text style={styles.cardTitle}>{nameById[locId] || locId}</Text>
              <Ionicons name="heart" size={20} color={colors.error} />
            </Card>
          ))
        )}

        <Text style={styles.sectionTitle}>Recent washes</Text>
        {historyLoading ? (
          <ActivityIndicator color={colors.greenBrand} />
        ) : historyError ? (
          <Text style={styles.errorText}>Couldn’t load wash history.</Text>
        ) : recent.length === 0 ? (
          <Text style={styles.emptyText}>You haven’t washed yet.</Text>
        ) : (
          recent.map((w) => {
            const dateOnly = new Date(w.timestamp).toLocaleDateString();
            const locName = nameById[w.location_api_id] || w.location_api_id;
            const rating = w.feedbacks?.[0]?.rating ?? 0;

            // Border color by rating
            const borderColor = rating >= 4 ? colors.greenBrand : rating >= 2 ? colors.orange : colors.error;

            return (
              <Card key={w.wash_history_id} style={{ borderColor, borderWidth: 2 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{locName}</Text>
                  <Text style={styles.cardSubtitleSmall}>{dateOnly}</Text>
                </View>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color={i < rating ? colors.greenBrand : colors.gray40} />
                  ))}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { padding: 16 },
  greeting: { fontSize: 28, fontWeight: "700", marginBottom: 8 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: {
    fontSize: 14,
    color: colors.gray60,
    marginTop: 8,
  },
  cardSubtitleSmall: {
    fontSize: 12,
    color: colors.gray60,
  },

  planPrice: { fontSize: 16, fontWeight: "600" },
  upgradeLink: {
    marginTop: 8,
    color: colors.greenBrand,
    fontWeight: "500",
  },

  favoriteCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  starsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  locationNameText: {
    color: colors.greenBrand,
    fontWeight: "600",
  },

  errorText: {
    color: colors.error,
    textAlign: "center",
  },
  emptyText: {
    color: colors.gray60,
    fontStyle: "italic",
  },
});
