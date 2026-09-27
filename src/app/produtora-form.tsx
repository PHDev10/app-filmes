import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function ProdutoraFormScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [nome, setNome] = useState((params.nome as string) || "");
  const [pais, setPais] = useState((params.pais as string) || "");
  const [ano, setAno] = useState((params.ano as string) || "");

  const handleSalvar = () => {
    router.back();
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom },
      ]}
    >
      <ThemedText type="subtitle" style={styles.title}>
        {isEditing ? "Editar Produtora" : "Nova Produtora"}
      </ThemedText>

      <View style={styles.formContent}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.text }]}
          placeholder="Nome do Estúdio"
          placeholderTextColor="#888"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.text }]}
          placeholder="País de Origem"
          placeholderTextColor="#888"
          value={pais}
          onChangeText={setPais}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.text }]}
          placeholder="Ano de Fundação"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={ano}
          onChangeText={setAno}
        />

        <View style={styles.actionButtons}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancelar"
              color="#ff4444"
              onPress={() => router.back()}
            />
          </View>
          {isEditing && (
            <View style={styles.buttonWrapper}>
              <Button
                title="Deletar"
                color="#ff8800"
                onPress={() => router.back()}
              />
            </View>
          )}
          <View style={styles.buttonWrapper}>
            <Button
              title={isEditing ? "Atualizar" : "Salvar"}
              onPress={handleSalvar}
            />
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  buttonWrapper: { flex: 1 },
});
