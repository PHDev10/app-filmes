import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type Produtora = {
  id: number;
  nome: string;
  pais: string;
  ano: string;
};

export default function ProdutorasScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [produtoras, setProdutoras] = useState<Produtora[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [nome, setNome] = useState("");
  const [pais, setPais] = useState("");
  const [ano, setAno] = useState("");

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

  const handleCriar = async () => {
    if (!nome || !pais || !ano) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await db.runAsync(
        "INSERT INTO produtoras (nome, pais, ano) VALUES (?, ?, ?)",
        [nome, pais, ano],
      );
      setNome("");
      setPais("");
      setAno("");
      setModalVisible(false);
      fetchProdutoras();
    } catch (error) {
      console.error("Erro ao criar produtora", error);
    }
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
          <Button title=" + Adicionar " onPress={() => setModalVisible(true)} />
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
          <View
            style={[styles.card, { backgroundColor: "rgba(150,150,150,0.1)" }]}
          >
            <ThemedText type="smallBold">{item.nome}</ThemedText>
            <ThemedText type="default">
              Origem: {item.pais} | Ano: {item.ano}
            </ThemedText>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
              Nova Produtora
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="Nome do Estúdio"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="País de Origem"
              placeholderTextColor="#888"
              value={pais}
              onChangeText={setPais}
            />
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="Ano de Fundação"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={ano}
              onChangeText={setAno}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                color="#ff4444"
                onPress={() => setModalVisible(false)}
              />
              <Button title="Salvar" onPress={handleCriar} />
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.four,
    width: "100%",
    gap: Spacing.three,
  },
  botaoWrapper: {
    marginTop: 8,
    alignItems: "center",
    width: 200,
  },
  listContent: {
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
