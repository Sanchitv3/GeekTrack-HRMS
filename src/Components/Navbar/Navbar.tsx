import React from "react";
import HRMS_LOGO from "../../assets/HRMS_LOGO.png";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between fixed w-screen">
        <div>
            <img src={HRMS_LOGO} alt="logo" className="h-10 w-auto "/>
        </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md py-1 px-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600">Get the code</button>
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
          <button className="flex items-center focus:outline-none">
            <span className="sr-only">User menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src="https://via.placeholder.com/150"
              alt="User avatar"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
