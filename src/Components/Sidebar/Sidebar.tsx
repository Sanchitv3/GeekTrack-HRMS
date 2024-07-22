import React from "react";
import { NavLink } from "react-router-dom";
import HRMS_LOGO from "../../assets/HRMS_LOGO.png";
import { GrUserManager } from "react-icons/gr";
import { RiDashboard3Fill } from "react-icons/ri";
import { GoProjectSymlink } from "react-icons/go";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdEventAvailable } from "react-icons/md";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { PiUserListDuotone } from "react-icons/pi";
import { LuFileSpreadsheet } from "react-icons/lu";
import { CiTimer } from "react-icons/ci";
import { MdOutlineReceiptLong } from "react-icons/md";

const Sidebar: React.FC = () => {
  return (
    <div className="h-[93vh] bg-white shadow-md w-34 fixed top-14 z-50">
      <div className="p-4 flex flex-col justify-between h-full">
        
        <nav className="mt-6">
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <RiDashboard3Fill size={24} className="mx-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/manageEmployees"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <GrUserManager size={24} className="mx-2" />
              Manage Employees
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <GoProjectSymlink size={24} className="mx-2" />
              Projects
            </NavLink>
            <NavLink
              to="/leaveRequests"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <FaRegCalendarXmark size={24} className="mx-2" />
              Leave Requests
            </NavLink>
            <NavLink
              to="/documents"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <IoDocumentsOutline size={24} className="mx-2" />
              Documents
            </NavLink>
            <NavLink
              to="/assign-employees"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <MdEventAvailable size={24} className="mx-2" />
              Assign Employees
            </NavLink>
            <NavLink
              to="/attendance-form"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <MdOutlineAssignmentInd size={24} className="mx-2" />
              Mark Attendance
            </NavLink>
            <NavLink
              to="/attendance-list"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <PiUserListDuotone size={24} className="mx-2" />
              Attendance List
            </NavLink>
            <NavLink
              to="/log-timesheet"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <LuFileSpreadsheet size={24} className="mx-2" />
              Log Timesheet
            </NavLink>
            <NavLink
              to="/timesheet-records"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <CiTimer size={24} className="mx-2" />
              Timesheet Records
            </NavLink>
            <NavLink
              to="/payrolls"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-white bg-[#0EA5E9] rounded-md font-bold"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-[#0EA5E9] hover:text-white rounded-md font-bold hover:translate-x-2 duration-700"
              }
            >
              <MdOutlineReceiptLong size={24} className="mx-2" />
              Payrolls
            </NavLink>
          </div>
        </nav>
        <div className="flex items-center justify-center">  
          <img className="h-8" src={HRMS_LOGO} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
