// Imports.
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { sellerRegister } from "../services/auth";
import { authStyles } from "../styles/auth";
import { colors } from "../styles/colors";

// Frontend.
export default function SellerRegister() {
  // States.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle CNIC formatting.
  const handleCnicChange = (text) => {
    // Remove all non-numeric characters.
    const numbers = text.replace(/[^0-9]/g, '');
    
    // Limit to 13 digits.
    const limitedNumbers = numbers.slice(0, 13);
    
    // Format with hyphens.
    let formatted = limitedNumbers;
    if (limitedNumbers.length > 5) {
      formatted = limitedNumbers.slice(0, 5) + '-' + limitedNumbers.slice(5);
    }
    if (limitedNumbers.length > 12) {
      formatted = limitedNumbers.slice(0, 5) + '-' + limitedNumbers.slice(5, 12) + '-' + limitedNumbers.slice(12);
    }
    setCnic(formatted);
  };

  // Handle register.
  const handleRegister = async () => {
    if (!name || !email || !password || !cnic) {
      Toast.show({ type: "error", text1: "Error", text2: "Please fill in all required fields" });
      return;
    }
    setLoading(true);
    try {
      await sellerRegister(name, email, password, cnic);
      Toast.show({ 
        type: "success", 
        text1: "Registration Successful!", 
        text2: "Please check your email to verify your account.",
        visibilityTime: 5000
      });
      setTimeout(() => router.replace("/seller-login"), 2000);
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
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.replace("/role-selection")} style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            {/* Header */}
            <View style={authStyles.header}>
              <Text style={authStyles.welcomeText}>Create Seller Account</Text>
              <Text style={authStyles.subtitleText}>Join us and start selling</Text>
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

            {/* CNIC */}
            <View style={authStyles.inputContainer}>
              <Text style={authStyles.label}>CNIC</Text>
              <View style={authStyles.inputWrapper}>
                <Ionicons name="card-outline" size={20} color={colors.textMuted} style={authStyles.inputIcon} />
                <TextInput style={authStyles.input} placeholder="33205-2456871-1" placeholderTextColor={colors.textMuted} value={cnic} onChangeText={handleCnicChange} keyboardType="numeric" maxLength={15} />
              </View>
            </View>

            {/* Password */ }
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
              <TouchableOpacity onPress={() => router.push("/seller-login")}>
                <Text style={authStyles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
