import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const abrirModalCriacao = () => {
    setSelectedId(null);
    setNome("");
    setPais("");
    setAno("");
    setModalVisible(true);
  };

  const abrirModalEdicao = (produtora: Produtora) => {
    setSelectedId(produtora.id);
    setNome(produtora.nome);
    setPais(produtora.pais);
    setAno(produtora.ano);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSelectedId(null);
    setNome("");
    setPais("");
    setAno("");
  };

  const handleSalvar = async () => {
    if (!nome || !pais || !ano) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (selectedId) {
        // Atualizar
        await db.runAsync(
          "UPDATE produtoras SET nome = ?, pais = ?, ano = ? WHERE id = ?",
          [nome, pais, ano, selectedId],
        );
      } else {
        // Criar
        await db.runAsync(
          "INSERT INTO produtoras (nome, pais, ano) VALUES (?, ?, ?)",
          [nome, pais, ano],
        );
      }
      fecharModal();
      fetchProdutoras();
    } catch (error) {
      console.error("Erro ao salvar produtora", error);
    }
  };

  const handleDeletar = async () => {
    if (!selectedId) return;
    try {
      // Deletar
      await db.runAsync("DELETE FROM produtoras WHERE id = ?", [selectedId]);
      fecharModal();
      fetchProdutoras();
    } catch (error) {
      console.error("Erro ao deletar produtora", error);
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

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
              {selectedId ? "Editar Produtora" : "Nova Produtora"}
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
              <View style={styles.buttonWrapper}>
                <Button
                  title="Cancelar"
                  color="#ff4444"
                  onPress={fecharModal}
                />
              </View>
              {selectedId && (
                <View style={styles.buttonWrapper}>
                  <Button
                    title="Deletar"
                    color="#ff8800"
                    onPress={handleDeletar}
                  />
                </View>
              )}
              <View style={styles.buttonWrapper}>
                <Button
                  title={selectedId ? "Atualizar" : "Salvar"}
                  onPress={handleSalvar}
                />
              </View>
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
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
});
