import React from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const WEBSITE_URL = "https://sambhavupsc.online";

const modules = [
  { number: "01", title: "Current Affairs", detail: "Daily analysis for Prelims and Mains" },
  { number: "02", title: "Prelims Practice", detail: "PYQs, tests and performance review" },
  { number: "03", title: "Mains Answer Writing", detail: "Write, evaluate and improve answers" },
  { number: "04", title: "Study Material", detail: "Revision-ready UPSC resources" },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor="#101827" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>S</Text></View>
          <View>
            <Text style={styles.brand}>SAMBHAV <Text style={styles.brandAccent}>UPSC</Text></Text>
            <Text style={styles.tagline}>PREPARE WITH PURPOSE</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR UPSC JOURNEY, ONE PLACE</Text>
          <Text style={styles.heading}>Learn smarter.{ "\n" }Prepare stronger.</Text>
          <Text style={styles.description}>A focused workspace for current affairs, practice, answer writing and revision.</Text>
          <Pressable style={styles.primaryButton} accessibilityRole="button" onPress={() => Linking.openURL(WEBSITE_URL)}>
            <Text style={styles.primaryButtonText}>Open SAMBHAV UPSC website ↗</Text>
          </Pressable>
          <Text style={styles.helper}>Your existing website account and backend remain the source of truth.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your learning modules</Text>
          <Text style={styles.sectionMeta}>BUILT FOR UPSC</Text>
        </View>
        {modules.map((module) => (
          <View key={module.number} style={styles.moduleCard}>
            <View style={styles.moduleNumber}><Text style={styles.moduleNumberText}>{module.number}</Text></View>
            <View style={styles.moduleCopy}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDetail}>{module.detail}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
        <Text style={styles.footer}>A strong foundation. A clearer path to your goal.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101827" },
  container: { padding: 22, paddingTop: 18, paddingBottom: 36 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 30 },
  brandMark: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#D9A441", alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#101827", fontSize: 25, fontWeight: "900" },
  brand: { color: "#F8FAFC", fontSize: 17, fontWeight: "800", letterSpacing: 1.1 },
  brandAccent: { color: "#D9A441" },
  tagline: { color: "#9CA8BA", fontSize: 9, letterSpacing: 2, marginTop: 3 },
  hero: { backgroundColor: "#192538", borderColor: "#2B3A50", borderWidth: 1, borderRadius: 24, padding: 22, marginBottom: 28 },
  eyebrow: { color: "#D9A441", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 14 },
  heading: { color: "#FFFFFF", fontSize: 34, lineHeight: 40, fontWeight: "800", letterSpacing: -0.8 },
  description: { color: "#B8C3D2", fontSize: 14, lineHeight: 22, marginTop: 13, marginBottom: 22 },
  primaryButton: { backgroundColor: "#D9A441", paddingVertical: 15, paddingHorizontal: 14, borderRadius: 13, alignItems: "center" },
  primaryButtonText: { color: "#101827", fontWeight: "800", fontSize: 13 },
  helper: { color: "#9CA8BA", fontSize: 11, lineHeight: 17, marginTop: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 13 },
  sectionTitle: { color: "#F8FAFC", fontSize: 18, fontWeight: "800" },
  sectionMeta: { color: "#8493A8", fontSize: 9, letterSpacing: 1.1, fontWeight: "700" },
  moduleCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#192538", borderColor: "#29384D", borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 10 },
  moduleNumber: { width: 39, height: 39, borderRadius: 12, backgroundColor: "#24344A", alignItems: "center", justifyContent: "center", marginRight: 13 },
  moduleNumberText: { color: "#D9A441", fontSize: 12, fontWeight: "800" },
  moduleCopy: { flex: 1 },
  moduleTitle: { color: "#F8FAFC", fontSize: 14, fontWeight: "700" },
  moduleDetail: { color: "#9CA8BA", fontSize: 11, marginTop: 5, lineHeight: 16 },
  chevron: { color: "#D9A441", fontSize: 25, marginLeft: 8 },
  footer: { color: "#718096", fontSize: 11, textAlign: "center", marginTop: 18 },
});
