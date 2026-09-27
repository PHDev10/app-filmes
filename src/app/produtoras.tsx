import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
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

type Produtora = {
  id: number;
  nome: string;
  pais: string;
  ano: string;
};

export default function ProdutorasScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [produtoras, setProdutoras] = useState<Produtora[]>([]);

  const fetchProdutoras = async () => {
    try {
      const result = await db.getAllAsync<Produtora>(
        "SELECT * FROM produtoras ORDER BY id DESC",
      );
      setProdutoras(result);
    } catch (error) {
      console.error("Erro ao buscar produtoras", error);
    }
  };

  useEffect(() => {
    fetchProdutoras();
  }, []);

  const abrirModalCriacao = () => {
    router.push("/produtora-form");
  };

  const abrirModalEdicao = (produtora: Produtora) => {
    router.push({
      pathname: "/produtora-form",
      params: {
        id: produtora.id,
        nome: produtora.nome,
        pais: produtora.pais,
        ano: produtora.ano,
      },
    });
  };

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
        <ThemedText type="subtitle">Estúdios (Produtoras)</ThemedText>
        <View style={styles.botaoWrapper}>
          <Button title=" + Adicionar " onPress={abrirModalCriacao} />
        </View>
      </View>

      <FlatList
        data={produtoras}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: "center" }}>
            Nenhuma produtora cadastrada.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => abrirModalEdicao(item)}
            style={[styles.card, { backgroundColor: "rgba(150,150,150,0.1)" }]}
          >
            <ThemedText type="smallBold">{item.nome}</ThemedText>
            <ThemedText type="default">
              Origem: {item.pais} | Ano: {item.ano}
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
