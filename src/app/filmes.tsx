import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";

type Filme = { id: number; titulo: string; duracao: string; genero: string };

export default function FilmesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filmes, setFilmes] = useState<Filme[]>([]);

  const fetchFilmes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@filmes");
      if (jsonValue != null) {
        setFilmes(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Erro ao ler filmes do AsyncStorage", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFilmes();
    }, []),
  );

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + BottomTabInset,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle">Catálogo de Filmes</ThemedText>
        <View style={styles.botaoWrapper}>
          <Button
            title=" + Adicionar "
            onPress={() => router.push("/filme-form")}
          />
        </View>
      </View>

      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: "center" }}>
            Nenhum filme salvo no AsyncStorage.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({ pathname: "/filme-form", params: { ...item } })
            }
            style={[styles.card, { backgroundColor: "rgba(150,150,150,0.1)" }]}
          >
            <ThemedText type="smallBold">{item.titulo}</ThemedText>
            <ThemedText type="default">
              Duração: {item.duracao} | Gênero: {item.genero}
            </ThemedText>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.four,
    width: "100%",
    gap: Spacing.three,
  },
  botaoWrapper: { marginTop: 8, alignItems: "center", width: 200 },
  listContent: { gap: Spacing.three, paddingBottom: Spacing.six },
  card: { padding: Spacing.three, borderRadius: Spacing.two },
});
