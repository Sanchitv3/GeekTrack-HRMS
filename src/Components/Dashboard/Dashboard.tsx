import React from "react";
import AddEmployee from "../Employee/AddEmployee";
import EmployeeList from "../Employee/EmployeeList";



const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <AddEmployee />
          <EmployeeList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
