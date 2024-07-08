import React, { useState, useEffect } from "react";
import HRMS_LOGO from "../../assets/HRMS_LOGO.png";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<{ name: string, photoURL: string, email: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      localStorage.removeItem('user');
      setUser(null);
      window.location.reload();
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between fixed w-screen z-50">
      <div>
        <img src={HRMS_LOGO} alt="logo" className="h-10 w-auto " />
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md py-1 px-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600">btn</button>
        <div className="relative">
          <button className="focus:outline-none">
            <span className="sr-only">View notifications</span>
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C6.67 6.165 6 7.388 6 8.722V14l-1.405 1.595A2.032 2.032 0 014 16.6V17h5m2 4a3 3 0 006 0H9a3 3 0 006 0z"
              />
            </svg>
          </button>
        </div>
        <div className="relative">
          <button className="flex items-center focus:outline-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span className="sr-only">User menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src={user?.photoURL}
              alt="User avatar"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-fit bg-white opacity-95 rounded-md shadow-lg py-1">
              <div className="px-4 py-2">
                <p className="text-gray-700">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-500 hover:text-white w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
