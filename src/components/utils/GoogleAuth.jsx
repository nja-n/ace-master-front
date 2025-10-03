import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../methods";
import { emit } from "./eventBus";

const GoogleButton = ({ onAuthenticated, referralCode }) => {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google Response:", response);

      // exchange code for access_token
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }
      );

      const userInfo = await res.json();

      // send access_token (or id_token) to your backend
      const backendRes = await fetch(googleAuth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.access_token, ref: referralCode }),
      });

      const jwtToken = await backendRes.json();
      localStorage.setItem("accessToken", jwtToken.accessToken);
      localStorage.setItem("refreshToken", jwtToken.refreshToken);
      emit("user:refresh");
      onAuthenticated(true);
    },
    onError: (err) => console.log("Google Login Failed:", err),
  });

  return (
    <Button
      variant="outlined"
      onClick={() => login()}
      sx={{
        borderColor: "white",
        color: "white",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
      fullWidth
    >
      Connect Google <Google />
    </Button>
  );
};

export default GoogleButton;
