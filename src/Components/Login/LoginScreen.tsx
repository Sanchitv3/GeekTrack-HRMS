import React, { useEffect } from "react";
import { bgIllustration, GeekyLogo,} from "../../assets";
import LoginButton from "./LoginButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Save user data to local storage
        localStorage.setItem('user', JSON.stringify({
          name: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        }));
        navigate('/dashboard');
      } else {
        console.log('logged out');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    // <div className="bg-white flex w-[100vw] h-[100vh] max-[480px]:flex-col justify-center items-center gap-4 p-5">
    <div>
      <div className="flex justify-center items-center">
        <img src={bgIllustration} alt="illustration" className="h-[75vh] w-auto"/>
      </div>
      <div className="flex justify-center items-center xl:scale-125">
        <div id="loginBox" className="flex justify-start flex-col gap-4 p-5">
          <img src={GeekyLogo} alt="GeekyAnts Logo" className="w-[50%]" />
          <span className="font-bold text-lg tracking-wider">
            Log In to Your Account
          </span>
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
