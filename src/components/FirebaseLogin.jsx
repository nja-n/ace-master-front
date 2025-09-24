
import { Google, HowToRegSharp } from "@mui/icons-material";
import { Box, Button, Link, Typography } from "@mui/material";
import { signInAnonymously, signInWithPopup } from "firebase/auth";
import { useLoading } from "../components/LoadingContext";
import { auth, facebookProvider, googleProvider } from "../firebase-config";
import { firebaseAuth, pre } from "./methods";

const FirebaseLogin = ({ onAuthenticated }) => {
  const { setLoading } = useLoading();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(); // Firebase ID token
      await sendTokenToBackend(token);
      setLoading(false);
    } catch (err) {
      setLoading(false)
      alert("Google login Failed");
      console.log("Google login Failed:" + err);
    }
  };

  const handleFacebookLogin = async () => {
    const result = await signInWithPopup(auth, facebookProvider);
    const token = await result.user.getIdToken();
    await sendTokenToBackend(token);
  };

  const sendTokenToBackend = async (firebaseIdToken) => {
    const response = await fetch(firebaseAuth, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: firebaseIdToken })
    });
    const jwtToken = await response.json();
    localStorage.setItem("accessToken", jwtToken.accessToken);
    localStorage.setItem("refreshToken", jwtToken.refreshToken);
    onAuthenticated(true);
  };

  async function handleGuestLogin() {
    try {
      setLoading(true);
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      const idToken = await user.getIdToken();

      await sendTokenToBackend(idToken);
    } catch (error) {
      console.error("Guest sign-in failed:", error);
      alert("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // const handleDevLogin = async () =>{
  //   let uid = window.prompt("Id here");
  //   const response = await fetch(`${pre}auth/dev`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id: uid })
  //   });
  //   const jwtToken = await response.json();
  //   localStorage.setItem("accessToken", jwtToken.accessToken);
  //   localStorage.setItem("refreshToken", jwtToken.refreshToken);
  //   onAuthenticated(true);
  // }

  //   import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";

  // async function upgradeGuestAccount(auth) {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await linkWithPopup(auth.currentUser, provider);
  //     console.log("Guest upgraded to registered:", result.user);
  //   } catch (error) {
  //     console.error("Upgrade failed:", error);
  //   }
  // }


  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleGoogleLogin}
          sx={{
            borderColor: 'white',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          fullWidth
        >
          Connect Google <Google />
        </Button>
        {/* <Button
        variant="outlined"
        onClick={handleFacebookLogin}
        sx={{
          borderColor: 'white',
          color: 'white',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
        fullWidth
      >
        Connect Facebook <Facebook />
      </Button> */}
        <Button
          variant="outlined"
          onClick={handleGuestLogin}
          sx={{
            borderColor: 'white',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          fullWidth
        >
          Continue as Guest <HowToRegSharp />
        </Button>
        {/* <Button
          variant="outlined"
          onClick={handleDevLogin}
          sx={{
            borderColor: 'white',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          fullWidth
        >
          Continue as Dev <HowToRegSharp />
        </Button> */}
      </Box>
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="white">
          By continuing, you agree to our{" "}
          <Link
            href={"/terms"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#90caf9", textDecoration: "underline" }}
          >
            Terms 
          </Link>
          { " " } & { " " }
          <Link
            href={"/privacy"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#90caf9", textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
          .
        </Typography>
      </Box>
    </>
  );
}

export default FirebaseLogin;
