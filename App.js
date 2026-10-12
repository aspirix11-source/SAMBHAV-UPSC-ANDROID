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

/**
 * Phase 1: Android app shell around the existing SAMBHAV UPSC web app.
 * This intentionally reuses the deployed website's current auth/session,
 * API routes and data rather than reimplementing or bypassing them.
 */
export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const reload = useCallback(() => {
    setLoadError(false);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor="#101827" />
      <View style={styles.topBar}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>S</Text></View>
        <View style={styles.brandCopy}>
          <Text style={styles.brand}>SAMBHAV <Text style={styles.brandAccent}>UPSC</Text></Text>
          <Text style={styles.tagline}>PREPARE WITH PURPOSE</Text>
        </View>
        <Pressable
          onPress={() => Linking.openURL(WEBSITE_URL)}
          style={styles.externalButton}
          accessibilityRole="button"
          accessibilityLabel="Open website in browser"
        >
          <Text style={styles.externalButtonText}>↗</Text>
        </Pressable>
      </View>

      <View style={styles.webContainer}>
        {loadError ? (
          <View style={styles.errorPanel}>
            <Text style={styles.errorTitle}>SAMBHAV UPSC load nahi ho paya</Text>
            <Text style={styles.errorBody}>Internet connection check karke dobara try karein.</Text>
            <Pressable style={styles.primaryButton} onPress={reload} accessibilityRole="button">
              <Text style={styles.primaryButtonText}>Retry</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => Linking.openURL(WEBSITE_URL)} accessibilityRole="button">
              <Text style={styles.secondaryButtonText}>Open in browser</Text>
            </Pressable>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: WEBSITE_URL }}
            style={styles.webView}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            cacheEnabled
            setSupportMultipleWindows={false}
            onLoadStart={() => { setLoading(true); setLoadError(false); }}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setLoading(false); setLoadError(true); }}
            onHttpError={(event) => {
              if (event.nativeEvent.statusCode >= 500) {
                setLoading(false);
                setLoadError(true);
              }
            }}
            onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
            onFileDownload={({ nativeEvent }) => {
              const url = nativeEvent?.downloadUrl;
              if (url) Linking.openURL(url).catch(() => {});
            }}
            onShouldStartLoadWithRequest={(request) => {
              const url = request.url || "";
              if (url.startsWith("https://") || url.startsWith("http://") || url.startsWith("about:")) return true;
              Linking.openURL(url).catch(() => {});
              return false;
            }}
          />
        )}
        {loading && !loadError && (
          <View pointerEvents="none" style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#D9A441" />
            <Text style={styles.loadingText}>SAMBHAV UPSC load ho raha hai…</Text>
          </View>
        )}
      </View>
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>Your existing account • Existing website backend</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#101827" },
  topBar: { height: 62, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 11, borderBottomWidth: 1, borderBottomColor: "#29384D" },
  brandMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#D9A441", alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#101827", fontSize: 23, fontWeight: "900" },
  brandCopy: { flex: 1 },
  brand: { color: "#F8FAFC", fontSize: 15, fontWeight: "800", letterSpacing: 0.7 },
  brandAccent: { color: "#D9A441" },
  tagline: { color: "#9CA8BA", fontSize: 8, letterSpacing: 1.7, marginTop: 3 },
  externalButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#192538", alignItems: "center", justifyContent: "center" },
  externalButtonText: { color: "#D9A441", fontSize: 22, fontWeight: "700" },
  webContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  webView: { flex: 1, backgroundColor: "#FFFFFF" },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#101827", alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { color: "#B8C3D2", fontSize: 13 },
  errorPanel: { flex: 1, padding: 26, justifyContent: "center", backgroundColor: "#101827" },
  errorTitle: { color: "#F8FAFC", fontSize: 20, fontWeight: "800", marginBottom: 10 },
  errorBody: { color: "#B8C3D2", fontSize: 14, lineHeight: 21, marginBottom: 24 },
  primaryButton: { backgroundColor: "#D9A441", paddingVertical: 15, paddingHorizontal: 14, borderRadius: 13, alignItems: "center" },
  primaryButtonText: { color: "#101827", fontWeight: "800", fontSize: 13 },
  secondaryButton: { paddingVertical: 13, alignItems: "center", marginTop: 8 },
  secondaryButtonText: { color: "#D9A441", fontWeight: "700", fontSize: 13 },
  bottomBar: { minHeight: 28, justifyContent: "center", alignItems: "center", backgroundColor: "#101827", borderTopWidth: 1, borderTopColor: "#29384D" },
  bottomText: { color: "#718096", fontSize: 9 },
});
