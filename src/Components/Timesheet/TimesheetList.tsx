import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface Timesheet {
  id: string;
  employeeID: string;
  projectID: string;
  date: string;
  hoursWorked: number;
  status: string;
  employeeName?: string;
  projectName?: string;
}

const TimesheetList: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [employees, setEmployees] = useState<{ [key: string]: string }>({});
  const [projects, setProjects] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesSnapshot = await getDocs(collection(db, "Employees"));
      const employeesData: { [key: string]: string } = {};
      employeesSnapshot.forEach(doc => {
        employeesData[doc.id] = doc.data().name;
      });
      setEmployees(employeesData);
    };

    const fetchProjects = async () => {
      const projectsSnapshot = await getDocs(collection(db, "Projects"));
      const projectsData: { [key: string]: string } = {};
      projectsSnapshot.forEach(doc => {
        projectsData[doc.id] = doc.data().name;
      });
      setProjects(projectsData);
    };

    fetchEmployees();
    fetchProjects();
  }, []);

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
          <tr className="text-left">
            <th className="py-2 px-4 border-b">Employee Name</th>
            <th className="py-2 px-4 border-b">Project Name</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Hours Worked</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id}>
              <td className="py-2 px-4 border-b">{employees[timesheet.employeeID] || "Unknown"}</td>
              <td className="py-2 px-4 border-b">{projects[timesheet.projectID] || "Unknown"}</td>
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
