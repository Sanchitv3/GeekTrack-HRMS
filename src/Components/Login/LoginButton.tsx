import React from "react";
import { GoogleIcon } from "../../assets";
import { app } from "../../firebase";
import { signInWithPopup,getAuth,GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
const LoginButton = () => {
  const navigate= useNavigate();
  const login=()=>{
    const provider = new GoogleAuthProvider();
    const auth= getAuth(app);
    signInWithPopup(auth,provider)
    .then((result)=>{
      console.log(result);
      navigate('/dashboard');
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  return (
    <div>
      <button
        className="bg-[#FC5A5A] text-white p-2 rounded-md flex justify-center items-center gap-4 w-[20rem] hover:translate-y-1 hover:translate-x-1 hover:bg-gradient-to-r from-[#FC5A5A] to-red-700 duration-500"
        onClick={() => login()}
      >
        <img src={GoogleIcon} alt="Google Icon" />
        Continue with Google
      </button>
    </div>
  );
};

export default LoginButton;
