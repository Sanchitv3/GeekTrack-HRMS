import React from "react";
import AddEmployee from "../Employee/AddEmployee";
import EmployeeList from "../Employee/EmployeeList";
import LogoutButton from "../Logout/LogoutButton";

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <LogoutButton/>
      <AddEmployee/>
      <EmployeeList />
    </div>
  );
};

export default Dashboard;
