import { Platform, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function FilmesScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Detalhes do Filme</ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoWrapper}>
          <ThemedView style={styles.infoBlock}>
            <ThemedText type="defaultSemiBold">Título:</ThemedText>
            <ThemedText type="default">Homem-Aranha: Um Novo Dia</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoBlock}>
            <ThemedText type="defaultSemiBold">Duração:</ThemedText>
            <ThemedText type="default">2 horas e 25 minutos</ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoBlock}>
            <ThemedText type="defaultSemiBold">
              Classificação Indicativa:
            </ThemedText>
            <ThemedText type="default">
              Não recomendado para menores de 12 anos
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoBlock}>
            <ThemedText type="defaultSemiBold">Gênero:</ThemedText>
            <ThemedText type="default">
              Ação, Aventura e Ficção Científica.
            </ThemedText>
          </ThemedView> 

          <ThemedView style={styles.infoBlock}>
            <ThemedText type="defaultSemiBold">Sinopse:</ThemedText>
            <ThemedText type="default">
              Após ter sua identidade apagada da memória de todos, Peter Parker
              vive isolado e tenta seguir em frente de forma anônima. Enquanto
              concilia a rotina da faculdade com o trabalho e o fardo de ser
              herói em tempo integral, ele enfrenta uma misteriosa e poderosa
              ameaça urbana que surge em Nova York. Sozinho e levado ao seu
              limite físico e mental, ele é forçado a lidar com as consequências
              de seu passado e a aceitar alianças inesperadas para proteger a
              cidade.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    width: "100%",
  },
  titleContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  infoWrapper: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  infoBlock: {
    gap: Spacing.one,
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
});
