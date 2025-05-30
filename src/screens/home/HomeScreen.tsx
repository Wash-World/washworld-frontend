// src/screens/home/HomeScreen.tsx

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

  // 1️⃣ Membership & price
  const { data: plans = [], isLoading: plansLoading } = useMemberships();
  const currentPlan = useMemo(() => plans.find((p) => p.plan === user.membership_plan), [plans, user.membership_plan]);
  const planPrice = currentPlan ? `${currentPlan.price},- kr` : "DKK 0,-";

  // 2️⃣ Locations lookup (for favorites & history)
  const { data: locations = [] } = useLocations();
  const nameById = useMemo(() => Object.fromEntries(locations.map((l) => [l.Location_id, l.name])) as Record<string, string>, [locations]);

  // 3️⃣ Wash history (most recent 5)
  const { data: history = [], isLoading: historyLoading, isError: historyError } = useWashHistory();
  const recent = history.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Greeting */}
        <Text style={styles.greeting}>Hello, {user?.name || "Guest"}</Text>

        {/* Your car */}
        <Text style={styles.sectionTitle}>Your car</Text>
        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{user?.carplate || "No plate"}</Text>
            <TouchableOpacity>
              <Ionicons name="pencil" size={20} color={colors.gray80} />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardSubtitle}>Last wash: {user?.lastWashDate || "—"}</Text>
          <Text style={styles.cardHighlight}>You washed your car {user?.daysSinceWash || 0} days ago</Text>
        </Card>

        {/* Your plan */}
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
              <Text style={styles.upgradeLink}>Want to upgrade?</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Favorites */}
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

        {/* Recent washes */}
        <Text style={styles.sectionTitle}>Recent washes</Text>
        {historyLoading ? (
          <ActivityIndicator color={colors.greenBrand} />
        ) : historyError ? (
          <Text style={styles.errorText}>Couldn’t load wash history.</Text>
        ) : recent.length === 0 ? (
          <Text style={styles.emptyText}>You haven’t washed yet.</Text>
        ) : (
          recent.map((w) => {
            const date = new Date(w.timestamp).toLocaleString();
            const locName = nameById[w.location_api_id] || w.location_api_id;
            // if your backend returned feedbacks relation:
            const rating = w.feedbacks?.[0]?.rating;
            return (
              <Card key={w.wash_history_id}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{locName}</Text>
                  <Text style={styles.cardSubtitleSmall}>{date}</Text>
                </View>
                {rating != null && <Text style={styles.ratingText}>Your rating: {rating} / 5</Text>}
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
    fontSize: 12,
    color: colors.gray60,
    marginTop: 4,
  },
  cardSubtitleSmall: {
    fontSize: 12,
    color: colors.gray60,
  },
  cardHighlight: {
    marginTop: 8,
    fontSize: 14,
    color: colors.greenBrand,
    fontWeight: "500",
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

  ratingText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray80,
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
