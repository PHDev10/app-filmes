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

type Filme = {
  id: number;
  titulo: string;
  duracao: string;
  genero: string;
};

export default function FilmesScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [duracao, setDuracao] = useState("");
  const [genero, setGenero] = useState("");

  const fetchFilmes = async () => {
    try {
      const result = await db.getAllAsync<Filme>(
        "SELECT * FROM filmes ORDER BY id DESC",
      );
      setFilmes(result);
    } catch (error) {
      console.error("Erro ao buscar filmes", error);
    }
  };

  useEffect(() => {
    fetchFilmes();
  }, []);

  const abrirModalCriacao = () => {
    setSelectedId(null);
    setTitulo("");
    setDuracao("");
    setGenero("");
    setModalVisible(true);
  };

  const abrirModalEdicao = (filme: Filme) => {
    setSelectedId(filme.id);
    setTitulo(filme.titulo);
    setDuracao(filme.duracao);
    setGenero(filme.genero);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSelectedId(null);
    setTitulo("");
    setDuracao("");
    setGenero("");
  };

  const handleSalvar = async () => {
    if (!titulo || !duracao || !genero) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (selectedId) {
        // Atualizar
        await db.runAsync(
          "UPDATE filmes SET titulo = ?, duracao = ?, genero = ? WHERE id = ?",
          [titulo, duracao, genero, selectedId],
        );
      } else {
        // Criar
        await db.runAsync(
          "INSERT INTO filmes (titulo, duracao, genero) VALUES (?, ?, ?)",
          [titulo, duracao, genero],
        );
      }
      fecharModal();
      fetchFilmes();
    } catch (error) {
      console.error("Erro ao salvar filme", error);
    }
  };

  const handleDeletar = async () => {
    if (!selectedId) return;
    try {
      // Deletar
      await db.runAsync("DELETE FROM filmes WHERE id = ?", [selectedId]);
      fecharModal();
      fetchFilmes();
    } catch (error) {
      console.error("Erro ao deletar filme", error);
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
        <ThemedText type="subtitle">Catálogo de Filmes</ThemedText>
        <View style={styles.botaoWrapper}>
          <Button title=" + Adicionar " onPress={abrirModalCriacao} />
        </View>
      </View>

      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: "center" }}>
            Nenhum filme cadastrado.
          </ThemedText>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => abrirModalEdicao(item)}
            style={[styles.card, { backgroundColor: "rgba(150,150,150,0.1)" }]}
          >
            <ThemedText type="smallBold">{item.titulo}</ThemedText>
            <ThemedText type="default">
              Duração: {item.duracao} | Gênero: {item.genero}
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
              {selectedId ? "Editar Filme" : "Novo Filme"}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="Título do Filme"
              placeholderTextColor="#888"
              value={titulo}
              onChangeText={setTitulo}
            />
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="Duração (ex: 2h 15m)"
              placeholderTextColor="#888"
              value={duracao}
              onChangeText={setDuracao}
            />
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="Gênero (ex: Ação, Drama)"
              placeholderTextColor="#888"
              value={genero}
              onChangeText={setGenero}
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
