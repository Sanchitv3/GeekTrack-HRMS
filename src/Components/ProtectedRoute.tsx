import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app, db } from '../firebase';
import LoginScreen from './Login/LoginScreen';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import LogoutButton from './Logout/LogoutButton';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [roleData, setRoleData] = useState<string | null>(null);
  const [isRoleFetched, setIsRoleFetched] = useState<boolean>(false);
  const [isDeleted,setIsDeleted]= useState<string | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchUserRole = async (userEmail: string) => {
      // Query the Employees collection where the email matches
      const employeesQuery = query(collection(db, 'Employees'), where('email', '==', userEmail));
      const querySnapshot = await getDocs(employeesQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const roleID = userDoc.data()?.roleID;
        setIsDeleted(userDoc.data().deleted);
        if (roleID) {
          const roleDocRef = doc(db, 'Roles', roleID);
          const roleDoc = await getDoc(roleDocRef);
          if (roleDoc.exists()) {
            setRoleData(roleDoc.data()?.roleName || null);
          }
        }
      }
      setIsRoleFetched(true);
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        await fetchUserRole(user.email || '');
      } else {
        setIsAuthenticated(false);
        setIsRoleFetched(true);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // useEffect(() => {
  //   const checkRole = async () => {
  //     if (isAuthenticated && isRoleFetched) {
  //       if ((roleData !== 'Admin' && roleData !== 'SuperAdmin')) {
  //         // Sign out non-admin users
  //         await signOut(auth);
  //         setIsAuthenticated(false);
  //       }
  //     }
  //   };
  //   checkRole();
  // }, [isAuthenticated, isRoleFetched, roleData, auth, isDeleted]);

  if (isAuthenticated === null || !isRoleFetched) {
    return (
      <div className='flex justify-center items-center w-[100vw] h-[100vh]'>
        <div className='w-20 h-20 rounded-full border-gray-300 border border-t-red-700 border-t-4 animate-spin m-10'></div>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return ((roleData === 'Admin' || roleData === 'SuperAdmin') && !isDeleted) ? <Outlet /> : (
    <div className='flex justify-center items-center w-[100vw] h-[100vh]'>
      <span className='absolute bg-red-700 text-white font-mono text-2xl animate-pulse'>
        Error: Access Denied! Your role is not authorized.
      </span>
      <div className='absolute mt-28'>
      <LogoutButton/>  
      </div>
      
    </div>
  );
};

export default ProtectedRoute;
