import React from 'react';
import { app } from '../../firebase';
import { getAuth,signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate= useNavigate();
    const LogOut=()=>{
        const auth=getAuth(app);
        signOut(auth).then(res=>{
            alert('Logged out Successfuly!');
            navigate('/');
        })

    }
  return (
    <div>
        <button type='button' onClick={LogOut} className='bg-red-500 rounded-3xl p-2 text-white font-bold font-mono hover:bg-red-700'>LogOut</button>
    </div>
  )
}

export default LogoutButton;