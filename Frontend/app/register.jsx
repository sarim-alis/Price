// Imports.
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { register } from "../services/auth";
import { authStyles } from "../styles/auth";
import { colors } from "../styles/colors";

// Frontend.
export default function RegisterScreen() {
  // States.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle register.
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Toast.show({ type: "error", text1: "Error", text2: "Please fill in all fields" });
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      Toast.show({ 
        type: "success", 
        text1: "Registration Successful!", 
        text2: "Please check your email to verify your account.",
        visibilityTime: 5000
      });
      setTimeout(() => router.replace("/buyer-login"), 2000);
    } catch (error) {
      Toast.show({ type: "error", text1: "Registration Failed", text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={authStyles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={authStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={authStyles.overlay}>
            {/* Header */}
            <View style={authStyles.header}>
              <Text style={authStyles.welcomeText}>Create Account</Text>
              <Text style={authStyles.subtitleText}>Join us and start your journey</Text>
            </View>

            {/* Name */}
            <View style={authStyles.inputContainer}>
              <Text style={authStyles.label}>Name</Text>
              <View style={authStyles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.textMuted} style={authStyles.inputIcon} />
                <TextInput style={authStyles.input} placeholder="Enter your name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} autoCapitalize="words" />
              </View>
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

            {/* Register Button */}
            <TouchableOpacity onPress={handleRegister} disabled={loading} style={authStyles.buttonContainer}>
              <View style={authStyles.primaryButton}>
                {loading ? <ActivityIndicator color={colors.textLight} /> : <Text style={authStyles.buttonText}>Sign Up</Text>}
              </View>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={authStyles.linkContainer}>
              <Text style={authStyles.linkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={authStyles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
