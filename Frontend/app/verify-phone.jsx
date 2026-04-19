import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { sendPhoneVerification, verifyPhone, resendPhoneVerification, getUser } from "../services/auth";
import { authStyles } from "../styles/auth";
import { colors } from "../styles/colors";

export default function VerifyPhone() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadUserPhone();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const loadUserPhone = async () => {
    const user = await getUser();
    if (user?.phone) {
      setPhone(user.phone);
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Toast.show({ type: "error", text1: "Error", text2: "Please enter a valid phone number" });
      return;
    }
    setLoading(true);
    try {
      await sendPhoneVerification(phone);
      setOtpSent(true);
      setCountdown(60);
      Toast.show({ 
        type: "success", 
        text1: "OTP Sent", 
        text2: "Check the server console for your OTP code" 
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Toast.show({ type: "error", text1: "Error", text2: "Please enter the 6-digit OTP code" });
      return;
    }
    setLoading(true);
    try {
      await verifyPhone(otp);
      Toast.show({ 
        type: "success", 
        text1: "Phone Verified!", 
        text2: "You can now use all features" 
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Toast.show({ type: "error", text1: "Verification Failed", text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await resendPhoneVerification(phone);
      setCountdown(60);
      Toast.show({ 
        type: "success", 
        text1: "OTP Resent", 
        text2: "Check the server console for your new OTP code" 
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container} edges={["top", "bottom"]}>
      <View style={authStyles.overlay}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={authStyles.header}>
          <Ionicons name="phone-portrait-outline" size={60} color={colors.primary} />
          <Text style={[authStyles.welcomeText, { marginTop: 20 }]}>Verify Phone Number</Text>
          <Text style={authStyles.subtitleText}>
            {otpSent 
              ? "Enter the 6-digit code sent to your phone" 
              : "Enter your phone number to receive verification code"}
          </Text>
        </View>

        {!otpSent ? (
          <>
            <View style={authStyles.inputContainer}>
              <Text style={authStyles.label}>Phone Number</Text>
              <View style={authStyles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={colors.textMuted} style={authStyles.inputIcon} />
                <TextInput 
                  style={authStyles.input} 
                  placeholder="03001234567" 
                  placeholderTextColor={colors.textMuted} 
                  value={phone} 
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleSendOTP} 
              disabled={loading} 
              style={authStyles.buttonContainer}
            >
              <View style={authStyles.primaryButton}>
                {loading ? (
                  <ActivityIndicator color={colors.textLight} />
                ) : (
                  <Text style={authStyles.buttonText}>Send OTP</Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={authStyles.inputContainer}>
              <Text style={authStyles.label}>OTP Code</Text>
              <View style={authStyles.inputWrapper}>
                <Ionicons name="key-outline" size={20} color={colors.textMuted} style={authStyles.inputIcon} />
                <TextInput 
                  style={authStyles.input} 
                  placeholder="Enter 6-digit code" 
                  placeholderTextColor={colors.textMuted} 
                  value={otp} 
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleVerifyOTP} 
              disabled={loading} 
              style={authStyles.buttonContainer}
            >
              <View style={authStyles.primaryButton}>
                {loading ? (
                  <ActivityIndicator color={colors.textLight} />
                ) : (
                  <Text style={authStyles.buttonText}>Verify OTP</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={authStyles.linkContainer}>
              <Text style={authStyles.linkText}>Didn't receive code? </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={countdown > 0}>
                <Text style={[authStyles.link, countdown > 0 && { opacity: 0.5 }]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
