import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface Timesheet {
  description: string;
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
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center">Timesheet List</h2>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-no-wrap shadow-2xl border rounded-lg" style={{borderCollapse:"separate"}}>
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Hours Worked</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timesheets.map((timesheet) => (
              <tr key={timesheet.id} className="hover:bg-gray-50">
                <td className="border-t px-4 py-2">{employees[timesheet.employeeID] || "Unknown"}</td>
                <td className="border-t px-4 py-2">{projects[timesheet.projectID] || "Unknown"}</td>
                <td className="border-t px-4 py-2">{timesheet.description || "Undefined"}</td>
                <td className="border-t px-4 py-2">{timesheet.date.split("T")[0]}</td>
                <td className="border-t px-4 py-2">{timesheet.hoursWorked}</td>
                <td className="border-t px-4 py-2">{timesheet.status}</td>
                <td className="border-t px-4 py-2">
                  {timesheet.status === "Pending" && (
                    <>
                      <button onClick={() => handleApproval(timesheet.id, "Approved")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"><CheckCircleIcon /></button>
                      <button onClick={() => handleApproval(timesheet.id, "Rejected")} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"><CancelIcon /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimesheetList;
