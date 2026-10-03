import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Button, Linking, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de GPS negada.");
        return;
      }

      let currentLoc = await Location.getCurrentPositionAsync({});
      setLocation(currentLoc);
    })();
  }, []);

  const abrirNoMapa = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
      Linking.openURL(url);
    }
  };

  let locationText = "Buscando satélite...";
  if (errorMsg) {
    locationText = errorMsg;
  } else if (location) {
    locationText = `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            App de Filmes
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          Informações dos melhores filmes em cartaz
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Localização (GPS)"
            hint={<ThemedText type="code">{locationText}</ThemedText>}
          />

          {location && (
            <View style={styles.mapButtonWrapper}>
              <Button
                title="Ver no Google Maps"
                onPress={abrirNoMapa}
                color="#208AEF"
              />
            </View>
          )}

          <HintRow
            title="Armazenamento"
            hint={<ThemedText type="small">AsyncStorage Ativado</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", flexDirection: "row" },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: { textAlign: "center" },
  code: { textTransform: "uppercase" },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  mapButtonWrapper: {
    marginTop: -5,
    marginBottom: 10,
    paddingHorizontal: Spacing.four,
  },
});
