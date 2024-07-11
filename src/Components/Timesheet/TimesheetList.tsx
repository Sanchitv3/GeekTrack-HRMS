import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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
      <table className="min-w-full bg-white border rounded-3xl">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Employee ID</th>
            <th className="py-2 px-4 border-b">Project ID</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Hours Worked</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td className="py-2 px-4 border-b">{timesheet.employeeID}</td>
              <td className="py-2 px-4 border-b">{timesheet.projectID}</td>
              <td className="py-2 px-4 border-b">{timesheet.date}</td>
              <td className="py-2 px-4 border-b">{timesheet.hoursWorked}</td>
              <td className="py-2 px-4 border-b">{timesheet.status}</td>
              <td className="py-2 px-4 border-b">
                {timesheet.status === "Pending" && (
                  <>
                    <button onClick={() => handleApproval(timesheet.id, "Approved")} className="bg-green-600 text-white font-semibold rounded-3xl"><CheckCircleIcon/></button>
                    <button onClick={() => handleApproval(timesheet.id, "Rejected")} className="bg-red-600 text-white font-semibold rounded-3xl"><CancelIcon/></button>
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
