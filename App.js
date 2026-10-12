import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { WEBSITE_URL } from "./src/config/backend";

export default function App() {
  const webViewRef = useRef(null);
  const [inWebsite, setInWebsite] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const openWebsite = useCallback(() => {
    setLoadError(false);
    setLoading(true);
    setInWebsite(true);
  }, []);

  const goHome = useCallback(() => {
    setInWebsite(false);
    setCanGoBack(false);
    setLoadError(false);
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!inWebsite) return false;
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      goHome();
      return true;
    });
    return () => subscription.remove();
  }, [inWebsite, canGoBack, goHome]);

  const modules = [
    { number: "01", title: "Current Affairs", detail: "Daily analysis for Prelims and Mains" },
    { number: "02", title: "Prelims Practice", detail: "PYQs, tests and performance review" },
    { number: "03", title: "Mains Answer Writing", detail: "Write, evaluate and improve answers" },
    { number: "04", title: "Study Material", detail: "Revision-ready UPSC resources" },
  ];

  if (inWebsite) {
    return (
      <SafeAreaView style={styles.webSafe}>
        <ExpoStatusBar style="light" />
        <StatusBar barStyle="light-content" backgroundColor="#101827" />
        <View style={styles.webHeader}>
          <Pressable onPress={goHome} style={styles.backButton} accessibilityRole="button">
            <Text style={styles.backText}>‹  Home</Text>
          </Pressable>
          <Text style={styles.webTitle}>SAMBHAV UPSC</Text>
          <View style={styles.headerSpacer} />
        </View>
        {loadError ? (
          <View style={styles.errorPanel}>
            <Text style={styles.errorTitle}>Website load nahi ho payi</Text>
            <Text style={styles.errorBody}>Internet connection check karke dobara try karein.</Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                setLoadError(false);
                setLoading(true);
                webViewRef.current?.reload();
              }}
            >
              <Text style={styles.primaryButtonText}>Retry</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => Linking.openURL(WEBSITE_URL)}>
              <Text style={styles.secondaryButtonText}>Open in browser</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.webContainer}>
            <WebView
              ref={webViewRef}
              source={{ uri: WEBSITE_URL }}
              style={styles.webView}
              javaScriptEnabled
              domStorageEnabled
              sharedCookiesEnabled
              thirdPartyCookiesEnabled
              setSupportMultipleWindows={false}
              startInLoadingState
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setLoadError(true);
              }}
              onHttpError={(event) => {
                if (event.nativeEvent.statusCode >= 500) setLoadError(true);
              }}
              onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
              onShouldStartLoadWithRequest={(request) => {
                const url = request.url || "";
                if (url.startsWith("https://") || url.startsWith("http://") || url.startsWith("about:")) return true;
                Linking.openURL(url).catch(() => {});
                return false;
              }}
              renderLoading={() => (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#D9A441" />
                  <Text style={styles.loadingText}>SAMBHAV UPSC load ho raha hai…</Text>
                </View>
              )}
            />
            {loading && (
              <View pointerEvents="none" style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#D9A441" />
                <Text style={styles.loadingText}>SAMBHAV UPSC load ho raha hai…</Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor="#101827" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>S</Text></View>
          <View>
            <Text style={styles.brand}>SAMBHAV <Text style={styles.brandAccent}>UPSC</Text></Text>
            <Text style={styles.tagline}>PREPARE WITH PURPOSE</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>YOUR UPSC JOURNEY, ONE PLACE</Text>
          <Text style={styles.heading}>Learn smarter.{"\n"}Prepare stronger.</Text>
          <Text style={styles.description}>Access your existing SAMBHAV UPSC account, dashboard and learning tools from one place.</Text>
          <Pressable style={styles.primaryButton} accessibilityRole="button" onPress={openWebsite}>
            <Text style={styles.primaryButtonText}>Open SAMBHAV UPSC dashboard ↗</Text>
          </Pressable>
          <Text style={styles.helper}>Uses the existing website login and backend. No separate account is created.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your learning modules</Text>
          <Text style={styles.sectionMeta}>BUILT FOR UPSC</Text>
        </View>
        {modules.map((module) => (
          <Pressable key={module.number} style={styles.moduleCard} onPress={openWebsite} accessibilityRole="button">
            <View style={styles.moduleNumber}><Text style={styles.moduleNumberText}>{module.number}</Text></View>
            <View style={styles.moduleCopy}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDetail}>{module.detail}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
        <Text style={styles.footer}>A strong foundation. A clearer path to your goal.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101827" },
  container: { flex: 1, padding: 22, paddingTop: 18, paddingBottom: 24 },
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
  secondaryButton: { paddingVertical: 13, alignItems: "center", marginTop: 8 },
  secondaryButtonText: { color: "#D9A441", fontWeight: "700", fontSize: 13 },
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
  webSafe: { flex: 1, backgroundColor: "#101827" },
  webHeader: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: "#29384D" },
  backButton: { paddingVertical: 8, paddingRight: 12 },
  backText: { color: "#D9A441", fontSize: 14, fontWeight: "700" },
  webTitle: { flex: 1, color: "#F8FAFC", fontSize: 14, fontWeight: "800", textAlign: "center" },
  headerSpacer: { width: 54 },
  webContainer: { flex: 1 },
  webView: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#101827", alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { color: "#B8C3D2", fontSize: 13 },
  errorPanel: { flex: 1, padding: 26, justifyContent: "center", backgroundColor: "#101827" },
  errorTitle: { color: "#F8FAFC", fontSize: 20, fontWeight: "800", marginBottom: 10 },
  errorBody: { color: "#B8C3D2", fontSize: 14, lineHeight: 21, marginBottom: 24 },
});
