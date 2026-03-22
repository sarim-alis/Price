// Frontend.
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { roleSelectionStyles as styles } from "../styles/role-selection";

export default function RoleSelection() {
  const router = useRouter();

  // Handle role select.
  const handleRoleSelect = (role) => {
    if (role === "buyer") {
      router.replace("/buyer-login");
    } else {
      router.replace("/seller-login");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Zod Mobile</Text>
        <Text style={styles.subtitle}>Choose how you want to continue</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect("buyer")} activeOpacity={0.8}>
            <Text style={styles.buttonText}>I am buyer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect("seller")} activeOpacity={0.8}>
            <Text style={styles.buttonText}>I am seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
