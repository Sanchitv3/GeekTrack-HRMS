import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDoc, getDocs, query, where, doc } from "firebase/firestore";
import { timesheet } from "../../assets";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getAuth } from "firebase/auth";

interface Project {
  id: string;
  name: string;
}

const TimesheetForm: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employeeID, setEmployeeID] = useState<string>("");
  const [projectID, setProjectID] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setEmployeeID(currentUser.uid);
    }
    const fetchProjects = async () => {
      try {
        const queryResult = query(
          collection(db, "Employees"),
          where("email", "==", currentUser?.email || "")
        );
        const employeeData = await getDocs(queryResult);
        if (!employeeData.empty) {
          const EmpID = employeeData.docs[0];
          const projectID = employeeData.docs[0].get("projectID");
          setEmployeeID(EmpID.id);
          if (projectID) {
            const projectDoc = await getDoc(doc(db, "Projects", projectID));
            if (projectDoc.exists()) {
              const projectData = {
                id: projectDoc.id,
                ...projectDoc.data(),
              } as Project;
              setProjects([projectData]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "Timesheets"), {
      employeeID,
      projectID,
      date,
      hoursWorked,
      description,
      status: "Pending"
    });
    // Reset form
    setProjectID("");
    setDate("");
    setHoursWorked(0);
    setDescription("");
    alert("Timesheet Logged successfuly!");
  };

  return (
    <div className="h-[86vh] w-full flex justify-center items-center flex-col">
      <h1 className="font-mono font-bold text-4xl mb-6">LOG TIMESHEET</h1>
      <div className="flex w-full justify-around items-center">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center w-[40vw] p-12 gap-6 shadow-lg rounded-3xl backdrop-blur-xl">
          <label className="font-bold">Project: <AccountTreeIcon/></label>
          <select value={projectID} onChange={(e) => setProjectID(e.target.value)} required className="p-4 rounded-3xl px-8 bg-slate-50">
            <option value="" disabled>Select a Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <label className="font-bold">Date: <CalendarMonthIcon/></label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="p-4 rounded-3xl px-8 bg-slate-50"/>
          <label className="font-bold">Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="p-4 rounded-3xl px-8 bg-slate-50"/>
          <label className="font-bold">Hours Worked: <AccessTimeIcon/></label>
          <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(Number(e.target.value))} required min="0" max="24" className="p-4 rounded-3xl px-8 bg-slate-50"/>
          <button type="submit" className="bg-blue-500 text-white font-semibold rounded-3xl p-4 hover:bg-blue-800 hover:translate-y-2 duration-700">Submit Timesheet</button>
        </form>
        <img src={timesheet} alt="illustration" className="h-[30vh] "/>
      </div>
    </div>
  );
};

export default TimesheetForm;
