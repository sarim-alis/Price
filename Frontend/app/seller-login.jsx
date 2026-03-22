// Imports.
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { sellerLogin } from "../services/auth";
import { authStyles } from "../styles/auth";
import { colors } from "../styles/colors";

// Frontend.
export default function SellerLogin() {
  // States.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle login.
  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Error", text2: "Please fill in all fields" });
      return;
    }
    setLoading(true);
    try {
      await sellerLogin(email, password);
      Toast.show({ type: "success", text1: "Success", text2: "Login successful!" });
      router.replace("/(seller-tabs)/dashboard");
    } catch (error) {
      Toast.show({ type: "error", text1: "Login Failed", text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={authStyles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={authStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={authStyles.overlay}>
            {/* Back Button */}
            <TouchableOpacity 
              onPress={() => router.replace("/role-selection")} 
              style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            {/* Header */}
            <View style={authStyles.header}>
              <Text style={authStyles.welcomeText}>Seller Login</Text>
              <Text style={authStyles.subtitleText}>Sign in to your seller account</Text>
            </View>

            {/* Email */}
            <View style={authStyles.inputContainer}>
              <Text style={authStyles.label}>Email</Text>
              <View style={authStyles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={authStyles.inputIcon} />
                <TextInput style={authStyles.input} placeholder="Enter your email" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
              </View>
            </View>

            {/* Password */}
            <View style={authStyles.inputContainer}>
              <Text style={authStyles.label}>Password</Text>
              <View style={authStyles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={authStyles.inputIcon} />
                <TextInput style={authStyles.input} placeholder="Enter your password" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={authStyles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} style={authStyles.buttonContainer}>
              <View style={authStyles.primaryButton}>
                {loading ? <ActivityIndicator color={colors.textLight} /> : <Text style={authStyles.buttonText}>Sign In</Text>}
              </View>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={authStyles.linkContainer}>
              <Text style={authStyles.linkText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/seller-register")}>
                <Text style={authStyles.link}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
