import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { AssignEmp } from "../../assets";

interface Employee {
  id: string;
  name: string;
  projectID?: string;
  deleted?: boolean;
}

interface Project {
  id: string;
  name: string;
  deleted?:Boolean;
}

const AssignEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [employeeProjectSelections, setEmployeeProjectSelections] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const savedSelections = localStorage.getItem("employeeProjectSelections");
    if (savedSelections) {
      setEmployeeProjectSelections(JSON.parse(savedSelections));
    }

    const unsubscribeEmployees = onSnapshot(collection(db, "Employees"), (snapshot) => {
      const employeesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
      setEmployees(employeesData);
    });

    const unsubscribeProjects = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsData);
    });

    return () => {
      unsubscribeEmployees();
      unsubscribeProjects();
    };
  }, []);

  const handleAssignProject = async (employeeID: string, projectID: string) => {
    await updateDoc(doc(db, "Employees", employeeID), {
      projectID
    });
  };

  const handleUnassignProject = async (employeeID: string) => {
    await updateDoc(doc(db, "Employees", employeeID), {
      projectID: ""
    });
  };

  const handleProjectSelectionChange = (employeeID: string, projectID: string) => {
    const updatedSelections = { ...employeeProjectSelections, [employeeID]: projectID };
    setEmployeeProjectSelections(updatedSelections);
    localStorage.setItem("employeeProjectSelections", JSON.stringify(updatedSelections));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex justify-center w-full h-full flex-col">
     <h1 className="text-center text-3xl font-bold mb-6 font-mono">Assign Employees to Project</h1>
      <img src={AssignEmp} alt="Assign Emp Illustration" className="h-60"/>
      <div className="overflow-x-auto">
      <table className="w-full whitespace-no-wrap shadow-2xl border rounded-lg" style={{borderCollapse:"separate"}}>
      <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border-b">Employee Name</th>
              <th className="py-2 px-4 border-b">Current Project</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className={employee.deleted ? "opacity-40" : ""}>
                <td className={`py-2 px-4 ${employee.deleted ? "text-slate-900" : ""}`}>{employee.name}</td>
                <td className="py-2 px-4">{employee.projectID ? projects.find(project => project.id === employee.projectID)?.name : "None"}</td>
                <td className="py-2 px-4 space-x-2">
                  <select
                    value={employeeProjectSelections[employee.id] || ""}
                    onChange={(e) => handleProjectSelectionChange(employee.id, e.target.value)}
                    className="border p-2 rounded"
                    disabled={employee.deleted}
                  >
                    <option value="" disabled>Select a Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id} disabled={project.deleted===true}>{project.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAssignProject(employee.id, employeeProjectSelections[employee.id])}
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={!employeeProjectSelections[employee.id] || employee.projectID === employeeProjectSelections[employee.id] || employee.deleted}
                  >
                    Assign
                  </button>
                  {employee.projectID && (
                    <button
                      type="button"
                      onClick={() => handleUnassignProject(employee.id)}
                      className="bg-red-500 text-white p-2 rounded"
                      disabled={employee.deleted}
                    >
                      Unassign
                    </button>
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

export default AssignEmployees;
