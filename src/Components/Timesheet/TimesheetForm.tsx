import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

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
    <form onSubmit={handleSubmit}>
      <select value={projectID} onChange={(e) => setProjectID(e.target.value)} required>
        <option value="" disabled>Select a Project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(Number(e.target.value))} required min="0" max="24"/>
      <button type="submit" className="bg-blue-500 rounded-3xl p-4">Submit Timesheet</button>
    </form>
  );
};

export default TimesheetForm;
