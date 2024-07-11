import React from "react";
import AddEmployee from "../Employee/AddEmployee";
import EmployeeList from "../Employee/EmployeeList";
import TimesheetForm from "../Timesheet/TimesheetForm";
import TimesheetList from "../Timesheet/TimesheetList";



const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>dashboard</h1>
    <TimesheetForm/>
    <TimesheetList/>
    </div>
    
  );
};

export default Dashboard;
