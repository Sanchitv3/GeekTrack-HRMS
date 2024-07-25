import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import AttendanceRecord from "./AttendanceRecord";
import { MarkAttendance } from "../../assets";

interface Attendance {
  id: string;
  date: Date;
  status: string;
}

const AttendanceForm: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<string>("WFH");
  const [employeeID, setEmployeeID] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const fetchEmployeeID = async () => {
        const employeesQuery = query(
          collection(db, "Employees"),
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(employeesQuery);
        if (!querySnapshot.empty) {
          const employeeDoc = querySnapshot.docs[0];
          setEmployeeID(employeeDoc.id);
        }
      };

      fetchEmployeeID();
    }
  }, []);

  const handleSubmit = async () => {
    const validDate = new Date().toISOString().split("T")[0];
    if (!date || !status || !employeeID || date.toISOString().split("T")[0] !== validDate) {
      alert("Error: Please fill all the fields correctly.");
      return;
    }

    try {
      const attendanceQuery = query(
        collection(db, "Attendance"),
        where("employeeID", "==", employeeID),
        where("date", "==", date.toISOString().split("T")[0])
      );
      const querySnapshot = await getDocs(attendanceQuery);
      if (!querySnapshot.empty) {
        alert("Error: Attendance has already been marked for today.");
        return;
      }

      await addDoc(collection(db, "Attendance"), {
        date: date.toISOString().split("T")[0],
        status,
        employeeID: employeeID,
      });
      alert("Success: Attendance record submitted successfully.");
    } catch (error) {
      console.error("Error submitting attendance record: ", error);
      alert("Error: Error submitting attendance record.");
    }
  };

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col items-center gap-[20px]">
        <div className="flex flex-row">
          <img src={MarkAttendance} alt="Mark Attendance Illustration"  className="h-60"/>
          <div className="flex flex-col justify-center">
        <div className="mb-[16px] flex flex-col">
          <label className="mb-[8px] text-gray-500">Date: {new Date().toISOString().split("T")[0]}</label>
        </div>
        <div className="flex items-center gap-2">
          <label className="mb-[8px] text-gray-500">Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-[8px] rounded-md border">
            <option value="WFH">Working from Home</option>
            <option value="WFO">Working from Office</option>
          </select>
        </div>
        </div>
        </div>
        <button onClick={handleSubmit} className="bg-[#3B82F6] p-4 text-white rounded-3xl font-bold hover:translate-y-1 duration-700 hover:opacity-65">
          Submit Attendance
        </button>
      </div>
      <AttendanceRecord />
    </div>
  );
};

export default AttendanceForm;
