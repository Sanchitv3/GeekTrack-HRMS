import React from "react";
import TimesheetForm from "../Timesheet/TimesheetForm";
import TimesheetList from "../Timesheet/TimesheetList";



const Dashboard: React.FC = () => {
  return (
    <div>
    <TimesheetForm/>
    <TimesheetList/>
    </div>
    
  );
};

export default Dashboard;
