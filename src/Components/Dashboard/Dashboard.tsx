import React from 'react'
import { AssignProject, AttendanceRecords, DashboardBg, Documents, leaveRequest, LogTimesheet, MarkAttendance, Payroll, Projects, TimesheetRecords ,addEmp} from '../../assets'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='bg-contain bg-no-repeat h-full w-full' style={{backgroundImage: `url(${DashboardBg})`}}>
      <div className='bg-white/90 h-full w-full grid grid-cols-4 gap-10 p-10'>
            <Link
              to="/manageEmployees"
              className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={addEmp} alt="manage emp illustration" className='h-32'/>
              Manage Employees
            </Link>
            <Link
              to="/projects"
             className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={Projects} alt='Projects Illustration' className='h-32'/>
              Projects
            </Link>
            <Link
              to="/assign-employees"
             className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={AssignProject} alt="Assign Employees Illustration"/>
              Assign Employees
            </Link>
            <Link
              to="/leaveRequests"
             className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={leaveRequest} alt='Leave Request Illustration' className='h-32'/>
              Leave Requests
            </Link>
            <Link
              to="/documents"
              className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={Documents} alt='Documents Illustration' className='h-32'/>
              Documents
            </Link>
            
            <Link
              to="/attendance-form"
              className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={MarkAttendance} alt='Mark Attendance Illustration' className='h-32'/>
              Mark Attendance
            </Link>
            <Link
              to="/attendance-list"
             className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={AttendanceRecords} alt='Attendance Records Illustration' className='h-32'/>
              Attendance List
            </Link>
            <Link
              to="/log-timesheet"
             className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={LogTimesheet} alt='Log Timesheet Illustration' className='h-32'/>
              Log Timesheet
            </Link>
            <Link
              to="/timesheet-records"
              className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={TimesheetRecords} alt='Timesheet Records Illustration' className='h-32'/>
              Timesheet Records
            </Link>
            <Link
              to="/payrolls"
              className="flex flex-col justify-between items-center px-4 py-2 text-gray-700  rounded-md font-bold hover:translate-y-5 hover:scale-110 duration-700 shadow-xl backdrop-blur-md h-[20vh] w-[14vw]"
            >
              <img src={Payroll} alt="Payroll Illustration" className='h-32'/>
              Payrolls
            </Link>
      </div>
    </div>
  )
}

export default Dashboard