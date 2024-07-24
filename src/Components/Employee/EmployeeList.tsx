import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";

// Define the Employee type
interface Employee {
  id: string;
  name: string;
  email: string;
  deleted: boolean;
  deletedAt: string;
  roleID: string; // Added roleID to Employee type
}

interface Role {
  id: string;
  roleName: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const permissions = useSelector((state:RootState)=>state.permission.permissionData)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Employees"), (snapshot) => {
      const employeesData: Employee[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Employee;
        employeesData.push({ ...data, id: doc.id });
      });
      setEmployees(employeesData);
    });

    const fetchRoles = async () => {
      const rolesCollection = await getDocs(collection(db, "Roles"));
      const rolesData = rolesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Role[];
      setRoles(rolesData);
    };

    fetchRoles();

    return () => unsubscribe();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const deletedAt = new Date().toLocaleString();
    await updateDoc(doc(db, "Employees", id), {
      deleted: true,
      deletedAt,
    });
    setConfirmDelete(null);
  }, []);

  const handleRoleChange = useCallback(async (id: string, newRoleID: string) => {
    await updateDoc(doc(db, "Employees", id), {
      roleID: newRoleID
    });
  }, []);

  const confirmDeleteEmployee = (id: string) => {
    setConfirmDelete(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const filteredEmployees = employees.filter(employee => showDeleted || !employee.deleted);

  const getRoleName = (roleID: string) => {
    const role = roles.find(r => r.id === roleID);
    return role ? role.roleName : 'Unknown Role';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">Employee List</h1>
      <div className="flex justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          <span>Show Deleted Employees</span>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className={employee.deleted ? 'bg-red-200' : ''}>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">
                  {permissions.some((permission)=>permission.name.includes('update_user')) ? <select
                    value={employee.roleID}
                    onChange={(e) => handleRoleChange(employee.id, e.target.value)}
                    className="border-none outline-none rounded p-2 bg-slate-800 text-slate-100"
                    disabled={employee.deleted} // Disable role change for deleted employees
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.roleName}</option>
                    ))}
                  </select> : <p>{getRoleName(employee.roleID)}</p>}
                </td>
                {permissions.some((permission)=>permission.name.includes('delete_user'))?(<td className="py-2 px-4 border-b">
                  <button
                    type="button"
                    onClick={() => confirmDeleteEmployee(employee.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700 flex items-center disabled:opacity-30"
                    disabled={employee.deleted}
                  >
                    <FaTrashAlt />
                  </button>
                  {confirmDelete === employee.id && (
                    <div className="flex justify-between items-center p-3 rounded shadow-lg absolute backdrop-blur-lg ">
                      <p className="mr-4 max-w-[60%]">Are you sure you want to delete Employee: <b>{employee.name}</b>?</p>
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
                </td>):<td className="py-2 px-4 border-b">Not authorised</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
