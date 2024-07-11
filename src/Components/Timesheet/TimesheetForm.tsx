import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { timesheet } from "../../assets";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Project {
  id: string;
  name: string;
}

const TimesheetForm: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employeeID, setEmployeeID] = useState<string>(""); // Replace with actual employee ID from auth context
  const [projectID, setProjectID] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [hoursWorked, setHoursWorked] = useState<number>(0);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = await getDocs(collection(db, "Projects"));
      const projectsData = projectsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);
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
      status: "Pending"
    });
    // Reset form
    setProjectID("");
    setDate("");
    setHoursWorked(0);
  };

  return (
    <div className="h-[86vh] w-full flex justify-center items-center flex-col">
      <h1 className="font-mono font-bold text-4xl mb-6">LOG TIMESHEET</h1>
      <div className="flex w-full justify-around items-center">
    <form onSubmit={handleSubmit} className=" flex flex-col justify-center w-[40vw] p-12 gap-6 shadow-lg rounded-3xl backdrop-blur-xl">
      <label className="font-bold">Project: <AccountTreeIcon/></label>
      <select value={projectID} onChange={(e) => setProjectID(e.target.value)} required className="p-4 rounded-3xl px-8 bg-slate-50">
        <option value="" disabled>Select a Project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>
      <label className="font-bold">Date: <CalendarMonthIcon/></label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="p-4 rounded-3xl px-8 bg-slate-50"/>
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
