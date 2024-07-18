import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { programmingIllustration } from "../../assets";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

      // Sort attendance records by date
      attendanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAttendanceRecords(attendanceData);
    };

    fetchEmployees();
    fetchAttendanceRecords();
  }, []);

  const getEmployeeName = (employeeID: string) => {
    const employee = employees.find((emp) => emp.id === employeeID);
    return employee ? employee.name : "Unknown";
  };

  const filteredAttendanceRecords = selectedDate
    ? attendanceRecords.filter(
        (record) => new Date(record.date).toDateString() === selectedDate.toDateString()
      )
    : attendanceRecords;

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-center text-4xl font-mono p-4">Attendance Records</h1>
      <img src={programmingIllustration} alt="illustration" className="h-[25%] w-[25%]" />

      <div className="m-4 bg-black rounded-xl">
        <label className="font-bold p-4 text-white">Filter By Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          placeholderText="Select a date"
          className="p-2 m-2 border rounded-xl focus:outline-red-600"
        />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {filteredAttendanceRecords.map((record) => (
          <div key={record.id} className="p-2 rounded-xl shadow-lg">
            <p><b>Date: </b>{new Date(record.date).toLocaleDateString()}</p>
            <p><b>Status:</b> {record.status}</p>
            <p><b>Employee:</b> {getEmployeeName(record.employeeID)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceList;
