import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { verifyEmail } from "../services/auth";
import { authStyles } from "../styles/auth";
import { colors } from "../styles/colors";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { token } = useLocalSearchParams();

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setError("Invalid verification link");
      setLoading(false);
    }
  }, [token]);

  const handleVerification = async () => {
    try {
      await verifyEmail(token);
      setVerified(true);
      Toast.show({ 
        type: "success", 
        text1: "Email Verified!", 
        text2: "You can now log in to your account." 
      });
    } catch (err) {
      setError(err.message);
      Toast.show({ type: "error", text1: "Verification Failed", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container} edges={["top", "bottom"]}>
      <View style={authStyles.overlay}>
        <View style={authStyles.header}>
          {loading ? (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[authStyles.welcomeText, { marginTop: 20 }]}>Verifying Email...</Text>
              <Text style={authStyles.subtitleText}>Please wait while we verify your email address</Text>
            </>
          ) : verified ? (
            <>
              <Ionicons name="checkmark-circle" size={80} color={colors.success} />
              <Text style={[authStyles.welcomeText, { marginTop: 20 }]}>Email Verified!</Text>
              <Text style={authStyles.subtitleText}>Your email has been successfully verified</Text>
              
              <TouchableOpacity 
                onPress={() => router.replace("/role-selection")} 
                style={[authStyles.buttonContainer, { marginTop: 40 }]}
              >
                <View style={authStyles.primaryButton}>
                  <Text style={authStyles.buttonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Ionicons name="close-circle" size={80} color={colors.error} />
              <Text style={[authStyles.welcomeText, { marginTop: 20 }]}>Verification Failed</Text>
              <Text style={authStyles.subtitleText}>{error || "Unable to verify your email"}</Text>
              
              <TouchableOpacity 
                onPress={() => router.replace("/role-selection")} 
                style={[authStyles.buttonContainer, { marginTop: 40 }]}
              >
                <View style={authStyles.primaryButton}>
                  <Text style={authStyles.buttonText}>Back to Login</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
