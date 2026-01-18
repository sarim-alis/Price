import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { isLoggedIn } from "../services/auth";
import { colors } from "../styles/colors";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    };
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
