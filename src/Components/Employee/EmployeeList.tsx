import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { FaTrashAlt } from "react-icons/fa";

// Define the Employee type
interface Employee {
  id: string;
  name: string;
  email: string;
  deleted: boolean; 
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Employees"), (snapshot) => {
      const employeesData: Employee[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Employee;
        // Exclude deleted employees
        if (!data.deleted) {
          employeesData.push({ ...data, id: doc.id });
        }
      });
      setEmployees(employeesData);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await updateDoc(doc(db, "Employees", id), {
      deleted: true // Soft delete by setting 'deleted' field to true
    });
    setConfirmDelete(null);
  }, []);

  const confirmDeleteEmployee = (id: string) => {
    setConfirmDelete(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">Employee List</h1>
      <div className="space-y-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg"
          >
            <span className="text-lg">
              {employee.name} - {employee.email}
            </span>
            <button
              type="button"
              onClick={() => confirmDeleteEmployee(employee.id)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700 flex items-center"
            >
              <FaTrashAlt />
            </button>
            {confirmDelete === employee.id && (
              <div className="absolute flex justify-between items-center backdrop-blur-xl p-3 rounded-3xl w-[40rem] ">
                <p className="text-center">Are you sure you want to delete Employee: <b className="text-blue-900">{employee.name}</b> ?</p>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(employee.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:opacity-60 duration-500"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-60 duration-500"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
