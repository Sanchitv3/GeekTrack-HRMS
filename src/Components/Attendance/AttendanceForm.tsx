import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import AttendanceRecord from "./AttendanceRecord";
interface Attendance {
    id: string;
    date: Date;
    status: string;
  }
  
  const AttendanceForm: React.FC = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [status, setStatus] = useState<string>("Present");
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
      const validDate = new Date().toLocaleDateString();
      if (!date || !status || !employeeID || date.toLocaleDateString() !== validDate) {
        alert("Error: Please fill all the fields correctly.");
        return;
      }
  
      try {
        await addDoc(collection(db, "Attendance"), {
          date: date.toISOString(),
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
      <div style={styles.container} className="flex flex-col items-center gap-[20px] mt-[40px]">
        <div style={styles.formInputs} className="mb-[16px]">
          <label className="mb-[8px] text-gray-500">Date: {new Date().toISOString().split("T")[0]}</label>
        </div>
        <div style={styles.formInputs}>
          <label className="mb-[8px] text-gray-500">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-[8px] rounded-md border">
            <option value="WFH">Working from Home</option>
            <option value="WFO">Working from Office</option>
          </select>
        </div>
        <button onClick={handleSubmit} style={styles.btn}>Submit Attendance</button>
        <AttendanceRecord/>
      </div>
    );
  };
  const styles: { [key: string]: React.CSSProperties } = {
    btn: {
      marginTop: "24px",
      backgroundColor: "#3B82F6",
      padding: "10px 20px",
      borderRadius: "24px",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    },
  };
  
  export default AttendanceForm;