import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';
import LoginScreen from './Login/LoginScreen';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  if (isAuthenticated === null) {
    return <div className='flex justify-center items-center w-[100vw] h-[100vh]'>
      <div className='w-20 h-20 rounded-full border-gray-300 border border-t-red-700 border-t-4 animate-spin m-10'>
    </div>
    Loading...
    </div>
  }

  return isAuthenticated ? <Outlet /> : (<><span className='absolute bg-red-700 text-white font-mono text-2xl animate-pulse'>Error : You are not logged in !</span> <LoginScreen /> </>);
};

export default ProtectedRoute;
