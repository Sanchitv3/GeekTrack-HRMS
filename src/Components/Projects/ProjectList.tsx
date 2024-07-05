import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { FaTrashAlt } from "react-icons/fa";

interface Project {
  id: string;
  name: string;
  description: string;
  deleted: boolean;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Projects"), (snapshot) => {
      const projectsData: Project[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Project;
        projectsData.push({ ...data, id: doc.id });
      });
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddProject = useCallback(async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    await addDoc(collection(db, "Projects"), {
      name: projectName,
      description: projectDescription,
      deleted: false,
    });
    setProjectName("");
    setProjectDescription("");
  }, [projectName, projectDescription]);

  const handleDeleteProject = useCallback(async (id: string) => {
    await updateDoc(doc(db, "Projects", id), {
      deleted: true,
    });
    setConfirmDelete(null);
  }, []);

  const filteredProjects = projects.filter(project => showDeleted || !project.deleted);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">Project List</h1>
      <form onSubmit={handleAddProject} className="mb-6">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            className="border p-2 rounded"
            required
          />
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Project Description"
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Project</button>
        </div>
      </form>
      <div className="flex justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          <span>Show Deleted Projects</span>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className={project.deleted ? 'bg-red-200' : ''}>
                <td className="py-2 px-4 border-b">{project.name}</td>
                <td className="py-2 px-4 border-b">{project.description}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(project.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
                    disabled={project.deleted}
                  >
                    <FaTrashAlt />
                  </button>
                  {confirmDelete === project.id && (
                    <div className="flex justify-between items-center p-3 rounded shadow-lg absolute backdrop-blur-lg">
                      <p className="mr-4 max-w-[60%]">Are you sure you want to delete Project: <b>{project.name}</b>?</p>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:opacity-60 duration-500"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-60 duration-500"
                        >
                          No
                        </button>
                      </div>
                    </div>
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

export default ProjectList;
