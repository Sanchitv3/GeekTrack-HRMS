import React from "react";
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
function App() {
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
            <Route path="leaveRequests" element={<LeaveRequests />} />
            <Route path="attendance-form" element={<AttendanceForm />} />
            <Route path="attendance-list" element={<AttendanceList />} />
            <Route path="timesheet-records" element={<TimesheetList />} />
            <Route path="log-timesheet" element={<TimesheetForm />} />
            <Route path="payrolls" element={<PayrollManagement />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
