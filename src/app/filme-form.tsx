import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function FilmeFormScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [titulo, setTitulo] = useState((params.titulo as string) || "");
  const [duracao, setDuracao] = useState((params.duracao as string) || "");
  const [genero, setGenero] = useState((params.genero as string) || "");

  const handleSalvar = () => {
    router.back();
  };

  return (
    <ThemedView
      style={[styles.container, { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom }]}
    >
      <ThemedText type="subtitle" style={styles.title}>
        {isEditing ? "Editar Filme" : "Novo Filme"}
      </ThemedText>

      <View style={styles.formContent}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.text }]}
          placeholder="Título do Filme"
          placeholderTextColor="#888"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.text }]}
          placeholder="Duração (ex: 2h 15m)"
          placeholderTextColor="#888"
          value={duracao}
          onChangeText={setDuracao}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.text }]}
          placeholder="Gênero (ex: Ação, Drama)"
          placeholderTextColor="#888"
          value={genero}
          onChangeText={setGenero}
        />

        <View style={styles.actionButtons}>
          <View style={styles.buttonWrapper}>
            <Button title="Cancelar" color="#ff4444" onPress={() => router.back()} />
          </View>
          {isEditing && (
            <View style={styles.buttonWrapper}>
              <Button title="Deletar" color="#ff8800" onPress={() => router.back()} />
            </View>
          )}
          <View style={styles.buttonWrapper}>
            <Button title={isEditing ? "Atualizar" : "Salvar"} onPress={handleSalvar} />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.four },
  title: { marginBottom: Spacing.four, textAlign: "center" },
  formContent: { gap: 15 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  actionButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 10 },
  buttonWrapper: { flex: 1 },
});