import React, { useEffect } from "react";
import { GeekyLogo,loginIllustration } from "../../assets";
import LoginButton from "./LoginButton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";
const LoginScreen = () => {
  const navigate= useNavigate();
  useEffect(()=>{
    const auth=getAuth(app);
    const isLoggedIn= onAuthStateChanged(auth,(user)=>{
      if(user){
        navigate('/dashboard');
      }
      else{
        console.log('logged out');
      }
    })
    return ()=>isLoggedIn();
  },[navigate])
  return (
    <div className="bg-[#849BDA]/[0.4] bg-gradient-to-r from-[#4D62B3]/[0.3] flex w-[100vw] h-[100vh] max-[480px]:flex-col justify-center items-center gap-4 p-5">
      <div className="flex justify-center items-center">
        <img src={loginIllustration} alt="illustration" />
      </div>
      <div className="flex justify-center items-center xl:scale-125">
        <div id="loginBox" className="flex justify-start flex-col gap-4 p-5">
          <img src={GeekyLogo} alt="GeekyAnts Logo" className="w-[50%]" />
          <span className="font-bold text-lg tracking-wider">
            Log In to Your Account
          </span>
          <LoginButton/>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
