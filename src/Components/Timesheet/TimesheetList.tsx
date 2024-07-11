import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

interface Timesheet {
  id: string;
  employeeID: string;
  projectID: string;
  date: string;
  hoursWorked: number;
  status: string;
}

const TimesheetList: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Timesheets"), (snapshot) => {
      const timesheetsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Timesheet[];
      setTimesheets(timesheetsData);
    });

    return () => unsubscribe();
  }, []);

  const handleApproval = useCallback(async (id: string, status: string) => {
    await updateDoc(doc(db, "Timesheets", id), { status });
  }, []);

  return (
    <div>
      <h2>Timesheet List</h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Project ID</th>
            <th>Date</th>
            <th>Hours Worked</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>{timesheet.employeeID}</td>
              <td>{timesheet.projectID}</td>
              <td>{timesheet.date}</td>
              <td>{timesheet.hoursWorked}</td>
              <td>{timesheet.status}</td>
              <td>
                {timesheet.status === "Pending" && (
                  <>
                    <button onClick={() => handleApproval(timesheet.id, "Approved")}>Approve</button>
                    <button onClick={() => handleApproval(timesheet.id, "Rejected")}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetList;
