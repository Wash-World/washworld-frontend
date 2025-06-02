// src/screens/help/HelpScreen.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useAppSelector } from "../../store";
import colors from "../../constants/colors";
import { LAN_IP } from "../../constants/env";

export default function HelpScreen() {
  const token = useAppSelector((s) => s.auth.token);

  const [helpContent, setHelpContent] = useState<{
    faqs: { question: string; answer: string }[];
    contact: { email: string; phone: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHelpContent = async () => {
      if (!token) {
        setErrorMessage("You must be logged in to view help.");
        setIsLoading(false);
        return;
      }

      try {
        const url = `http://${LAN_IP}:3000/api/help`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Read raw response text first
        const rawText = await response.text();

        try {
          const parsedBody = JSON.parse(rawText);

          if (!response.ok) {
            // If NestJS returned an error, it usually includes { statusCode, message, error }
            const messageField = parsedBody.message;
            const displayMessage = Array.isArray(messageField) ? messageField.join(", ") : messageField || "Unknown error";
            setErrorMessage(displayMessage);
          } else {
            // 200 OK: extract faqs and contact safely
            const parsedFaqs = Array.isArray(parsedBody.faqs) ? parsedBody.faqs : [];
            const parsedContact = parsedBody.contact && typeof parsedBody.contact === "object" ? parsedBody.contact : { email: "", phone: "" };
            setHelpContent({ faqs: parsedFaqs, contact: parsedContact });
          }
        } catch {
          // JSON.parse failed (invalid JSON)
          if (!response.ok) {
            setErrorMessage(rawText || "Server returned an error.");
          } else {
            setErrorMessage("Invalid JSON from server.");
          }
        }
      } catch (fetchError) {
        console.warn("[HelpScreen] Fetch error:", fetchError);
        setErrorMessage("Failed to load help content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHelpContent();
  }, [token]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.greenBrand} />
          <Text style={styles.loadingText}>Loading help…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!helpContent) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.noDataText}>No help content available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>Help &amp; FAQ</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {helpContent.faqs.length > 0 ? (
            helpContent.faqs.map((faqItem, idx) => (
              <View key={idx} style={styles.faqItem}>
                <Text style={styles.question}>{faqItem.question}</Text>
                <Text style={styles.answer}>{faqItem.answer}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noFaqs}>No FAQs available.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.contactLabel}>Email:</Text>
          <Text style={styles.contactValue}>{helpContent.contact.email}</Text>
          <Text style={styles.contactLabel}>Phone:</Text>
          <Text style={styles.contactValue}>{helpContent.contact.phone}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 8,
    color: colors.gray60,
    fontSize: 14,
  },
  error: {
    color: colors.error,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  noDataText: {
    color: colors.gray60,
    fontSize: 14,
    textAlign: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.greenBrand,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray40,
    paddingBottom: 4,
    color: colors.gray80,
  },
  faqItem: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.gray80,
  },
  answer: {
    fontSize: 14,
    color: colors.gray60,
    lineHeight: 20,
  },
  noFaqs: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.gray60,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray80,
    marginTop: 8,
  },
  contactValue: {
    fontSize: 14,
    color: colors.gray60,
    marginBottom: 4,
  },
});
