// src/screens/help/HelpScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useAppSelector } from "../../store";
import colors from "../../constants/colors";
import { LAN_IP } from "../../constants/env";

export default function HelpScreen() {
  const token = useAppSelector((s) => s.auth.token);

  // We’ll store whatever the backend sends us here
  const [helpData, setHelpData] = useState<{
    faqs: { question: string; answer: string }[];
    contact: { email: string; phone: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHelp = async () => {
      console.log("[HelpScreen] Starting fetchHelp…");
      if (!token) {
        console.log("[HelpScreen] No token found in Redux.");
        setError("You must be logged in to view help.");
        setLoading(false);
        return;
      }

      try {
        const url = `http://${LAN_IP}:3000/api/help`;
        console.log("[HelpScreen] Fetching", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("[HelpScreen] Response status:", res.status);

        if (res.status === 401) {
          setError("Not authenticated (401).");
        } else if (res.status === 403) {
          setError("You need a Brilliant membership to view this (403).");
        } else {
          // Attempt to parse JSON
          const json = await res.json().catch((err) => {
            console.warn("[HelpScreen] Failed to parse JSON:", err);
            return null;
          });

          console.log("[HelpScreen] Received JSON:", json);

          if (!json || typeof json !== "object") {
            setError("Invalid response from server.");
          } else {
            // Make sure we have at least empty arrays/objects
            const safeFaqs = Array.isArray(json.faqs) ? json.faqs : [];
            const safeContact = json.contact && typeof json.contact === "object" ? json.contact : { email: "", phone: "" };

            setHelpData({
              faqs: safeFaqs,
              contact: safeContact,
            });
          }
        }
      } catch (fetchErr) {
        console.warn("[HelpScreen] Fetch threw an error:", fetchErr);
        setError("Failed to load help content.");
      } finally {
        setLoading(false);
      }
    };

    fetchHelp();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.greenBrand} />
        <Text style={styles.loadingText}>Loading help…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!helpData) {
    return (
      <View style={styles.center}>
        <Text>No data to show.</Text>
      </View>
    );
  }

  // At this point, helpData is a valid object
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {helpData.faqs.length > 0 ? (
        helpData.faqs.map((faq, idx) => (
          <View key={idx} style={styles.faqItem}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noFaqs}>No FAQs available.</Text>
      )}

      <Text style={styles.contactTitle}>Contact:</Text>
      <Text style={styles.contactText}>{helpData.contact.email}</Text>
      <Text style={styles.contactText}>{helpData.contact.phone}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 8,
    color: colors.gray60,
  },
  error: {
    color: colors.error,
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  faqItem: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  answer: {
    fontSize: 14,
    color: colors.gray60,
  },
  noFaqs: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.gray60,
    marginBottom: 16,
  },
  contactTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "600",
  },
  contactText: {
    fontSize: 14,
    color: colors.gray60,
    marginTop: 4,
  },
});
