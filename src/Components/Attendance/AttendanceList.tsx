import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { programmingIllustration } from "../../assets";

interface Attendance {
  id: string;
  date: string;
  status: string;
  employeeID: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

const AttendanceList: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesQuery = collection(db, "Employees");
      const querySnapshot = await getDocs(employeesQuery);
      const employeesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
      setEmployees(employeesData);
    };

    const fetchAttendanceRecords = async () => {
      const attendanceQuery = collection(db, "Attendance");
      const querySnapshot = await getDocs(attendanceQuery);
      const attendanceData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Attendance[];
      setAttendanceRecords(attendanceData);
    };

    fetchEmployees();
    fetchAttendanceRecords();
  }, []);

  const getEmployeeName = (employeeID: string) => {
    const employee = employees.find((emp) => emp.id === employeeID);
    return employee ? employee.name : "Unknown";
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-center text-4xl font-mono p-4">Attendance Records</h1>
      <img src={programmingIllustration} alt="illustration" className="h-[25%] w-[25%]"/>
      <div className="grid grid-cols-4 gap-6">
        {attendanceRecords.map((record) => (
          <div key={record.id} className="p-2 rounded-xl shadow-lg ">
            <p><b>Date: </b>{new Date(record.date).toLocaleString()}</p>
            <p><b>Status:</b> {record.status}</p>
            <p><b>Employee:</b> {getEmployeeName(record.employeeID)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceList;
