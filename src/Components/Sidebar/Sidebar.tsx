import React from "react";
import { Link } from "react-router-dom";
import HRMS_LOGO from "../../assets/HRMS_LOGO.png"

const Sidebar: React.FC = () => {
  return (
    <div className="h-[93vh] bg-white shadow-md w-34 fixed top-14 z-50">
      <div className="p-4 flex flex-col justify-between h-full">
        
        <nav className="mt-6">
          <div className="space-y-1">
            <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-9 9h6m-6 0v-6m0 6L9 15m6 6h3m-3 0l-3-3"
                />
              </svg>
              Dashboard
            </Link>
            <Link to="/manageEmployees" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 16H7a4 4 0 00-4 4v2h5m0-6V4a4 4 0 014-4h6a4 4 0 014 4v12m-10 0h10"
                />
              </svg>
              Manage Employees
            </Link>
            <Link to="/projects" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7h18M3 12h18M3 17h18"
                />
              </svg>
              Projects
            </Link>
            <Link to="/leaveRequests" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 4h10m2 0a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h14z"
                />
              </svg>
              Leave Requests
            </Link>
            <Link to="/documents" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16h10M7 12h10m-7-4h3m10-1a2 2 0 01-2 2h-1.293l-.293.293a1 1 0 01-.707.293h-4a1 1 0 01-.707-.293L12 9H4a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1z"
                />
              </svg>
              Documents
            </Link>
            <Link to="/assign-employees" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-1a3 3 0 013-3h6a3 3 0 013 3v1M9 7h.01M15 7h.01M12 12h.01M3 12a9 9 0 0118 0 9 9 0 01-18 0z"
                />
              </svg>
              Reports
            </Link>
            <Link to="/attendance-form" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-1a3 3 0 013-3h6a3 3 0 013 3v1M9 7h.01M15 7h.01M12 12h.01M3 12a9 9 0 0118 0 9 9 0 01-18 0z"
                />
              </svg>
              Mark Attendance
            </Link>
            <Link to="/attendance-list" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-1a3 3 0 013-3h6a3 3 0 013 3v1M9 7h.01M15 7h.01M12 12h.01M3 12a9 9 0 0118 0 9 9 0 01-18 0z"
                />
              </svg>
              Attendance List
            </Link>
            <Link to="/log-timesheet" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-1a3 3 0 013-3h6a3 3 0 013 3v1M9 7h.01M15 7h.01M12 12h.01M3 12a9 9 0 0118 0 9 9 0 01-18 0z"
                />
              </svg>
              Log Timesheet
            </Link>
            <Link to="/timesheet-records" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md">
              <svg
                className="w-6 h-6 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-1a3 3 0 013-3h6a3 3 0 013 3v1M9 7h.01M15 7h.01M12 12h.01M3 12a9 9 0 0118 0 9 9 0 01-18 0z"
                />
              </svg>
              Timesheet Records
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center">
          <img
            className="h-8"
            src={HRMS_LOGO}
            alt="Logo"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
