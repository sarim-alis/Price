import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { getUser } from "../services/auth";

export default function PhoneVerificationGuard({ children, requireVerification = true }) {
  const router = useRouter();

  useEffect(() => {
    if (requireVerification) {
      checkPhoneVerification();
    }
  }, [requireVerification]);

  const checkPhoneVerification = async () => {
    const user = await getUser();
    if (user && !user.phoneVerified) {
      Alert.alert(
        "Phone Verification Required",
        "You need to verify your phone number to perform this action.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Verify Now", 
            onPress: () => router.push("/verify-phone")
          }
        ]
      );
    }
  };

  return children;
}
