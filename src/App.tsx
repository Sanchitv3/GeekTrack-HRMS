import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import LoginScreen from "./Components/Login/LoginScreen";
import ProtectedRoute from "./Components/ProtectedRoute";
import Layout from "./Components/Layout";
import AddEmployee from "./Components/Employee/AddEmployee";
import ProjectList from "./Components/Projects/ProjectList";
import AssignEmployees from "./Components/Projects/AssignEmployees";
import EmployeeList from "./Components/Employee/EmployeeList";
import ManageEmployees from "./Components/Employee/ManageEmployees";
import LeaveRequests from "./Components/Leaves/LeaveRequests";
import AttendanceForm from "./Components/Attendance/AttendanceForm";
import AttendanceList from "./Components/Attendance/AttendanceList";
import TimesheetList from "./Components/Timesheet/TimesheetList";
import TimesheetForm from "./Components/Timesheet/TimesheetForm";
import PayrollManagement from "./Components/Payroll/PayrollManagement";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import {upatePermissions} from './Components/Store/permissionsSlice';

import { RootState } from "./Components/Store/store";
import Documents from "./Components/Documents/Documents";

export interface PermissionType {
  id: string;
  name: string;
  entity: string;
  operation: string;
}

function App() {
  const fetchUserPermissions = async (userRole: string) => {
    try {
      // Fetch role details
      const roleDoc = await getDocs(
        query(collection(db, "Roles"), where("roleName", "==", userRole))
      );
      const roleData = roleDoc.docs[0]?.data();
      const permissionIds = roleData?.permissions;
      if (!permissionIds) {
        throw new Error("Role permissions not found");
      }
      // Fetch complete permission data
      const permissionsData: PermissionType[] = await Promise.all(
        permissionIds.map(async (permissionId: string) => {
          const permissionDoc = await getDoc(
            doc(db, "Permissions", permissionId)
          );
          return {
            id: permissionDoc.id,
            ...permissionDoc.data(),
          } as PermissionType;
        })
      );
      return permissionsData;
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const userData = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRoleData = async (userEmail: string) => {
      const employeesQuery = query(collection(db, "Employees"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(employeesQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const roleID = userDoc.data()?.roleID;
        if (roleID) {
          const roleDocRef = doc(db, "Roles", roleID);
          const roleDoc = await getDoc(roleDocRef);
          return roleDoc.data()?.roleName || null;
        }
      }
      return null;
    };

    const initializePermissions = async () => {
      if (userData) {
        const userRole = await fetchRoleData(userData.email);
        if (userRole) {
          const permissionsData = await fetchUserPermissions(userRole);
          if (permissionsData) {
            dispatch(upatePermissions(permissionsData));
          }
        }
      }
    };

    initializePermissions();
  }, [dispatch, userData]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/assign-employees" element={<AssignEmployees />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/manageEmployees" element={<ManageEmployees />} />
            <Route path="/leaveRequests" element={<LeaveRequests />} />
            <Route path="/attendance-form" element={<AttendanceForm />} />
            <Route path="/attendance-list" element={<AttendanceList />} />
            <Route path="/timesheet-records" element={<TimesheetList />} />
            <Route path="/log-timesheet" element={<TimesheetForm />} />
            <Route path="/payrolls" element={<PayrollManagement />} />
            <Route path="/Documents" element={<Documents />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
