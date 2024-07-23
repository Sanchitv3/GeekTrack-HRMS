import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { setUser, clearUser } from '../Store/userSlice';
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, app } from "../../firebase";
import HRMS_LOGO from "../../assets/HRMS_LOGO.png";

interface Employee {
  id: string;
  name: string;
  email: string;
  roleID: string;
  roleName?: string;
  addressLine1: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
}

interface Role {
  id: string;
  roleName: string;
}

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmployeesAndRoles = async () => {
      try {
        const employeesSnapshot = await getDocs(collection(db, "Employees"));
        const rolesSnapshot = await getDocs(collection(db, "Roles"));
        
        const rolesMap: Record<string, string> = {};
        rolesSnapshot.forEach(doc => {
          rolesMap[doc.id] = doc.data().roleName;
        });

        const employeesData = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          roleName: rolesMap[doc.data().roleID],
        })) as Employee[];

        setEmployees(employeesData);
        setRoles(rolesSnapshot.docs.map(doc => ({ id: doc.id, roleName: doc.data().roleName })));
      } catch (error) {
        console.error("Error fetching employees and roles:", error);
      }
    };

    fetchEmployeesAndRoles();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      dispatch(setUser(JSON.parse(userData)));
    }
  }, [dispatch]);

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      localStorage.removeItem('user');
      dispatch(clearUser());
      window.location.reload();
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(value) ||
      employee.email.toLowerCase().includes(value)
    );
    setFilteredEmployees(filtered);
  };

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setEditEmployee(null);
    setIsEditing(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editEmployee) {
      setEditEmployee({
        ...editEmployee,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    if (editEmployee) {
      const employeeDoc = doc(db, "Employees", editEmployee.id);
      await updateDoc(employeeDoc, {
        name: editEmployee.name,
        email: editEmployee.email,
        addressLine1: editEmployee.addressLine1,
        city: editEmployee.city,
        state: editEmployee.state,
        zipcode: editEmployee.zipcode,
        country: editEmployee.country,
        phone: editEmployee.phone,
      });

      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === editEmployee.id ? editEmployee : emp
        )
      );

      closeModal();
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between fixed w-screen z-50">
      <div>
        <img src={HRMS_LOGO} alt="logo" className="h-10 w-auto" />
      </div>
      <div className="flex items-center relative">
        <input
          type="text"
          placeholder="Search..."
          className="rounded-3xl py-2 px-4 shadow-xl bg bg-gray-200 placeholder-slate-600 focus:outline-slate-500"
          value={searchInput}
          onChange={handleSearch}
        />
        {searchInput && (
          <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md z-10">
            {filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => openModal(employee)}
              >
                {employee.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="focus:outline-none">
            <span className="sr-only">View notifications</span>
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C6.67 6.165 6 7.388 6 8.722V14l-1.405 1.595A2.032 2.032 0 014 16.6V17h5m2 4a3 3 0 006 0H9a3 3 0 006 0z"
              />
            </svg>
          </button>
        </div>
        <div className="relative">
          <button className="flex items-center focus:outline-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span className="sr-only">User menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src={user?.photoURL}
              alt="User avatar"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-fit bg-white opacity-95 rounded-md shadow-lg py-1">
              <div className="px-4 py-2">
                <p className="text-gray-700">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-500 hover:text-white w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg w-[300px]">
            <h2 className="text-xl font-semibold mb-2">Employee Details</h2>
            {!isEditing ? (
              <div className="flex flex-col space-y-2">
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Role:</strong> {selectedEmployee.roleName}</p>
                <p><strong>Address:</strong> {selectedEmployee.addressLine1}, {selectedEmployee.city}, {selectedEmployee.state}, {selectedEmployee.zipcode}, {selectedEmployee.country}</p>
                <p><strong>Phone Number:</strong> {selectedEmployee.phone}</p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 ">
                <label className="font-bold">
              <i className="fa-solid fa-id-card"></i> Name
            </label>
                <input
                  type="text"
                  name="name"
                  value={editEmployee?.name || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="Name"
                />
                <label className="font-bold">
              <i className="fa-solid fa-envelope"></i> Email
            </label>
                <input
                  type="text"
                  name="email"
                  value={editEmployee?.email || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="Email"
                />
                <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-map-marker-alt"></i> Address Line 1
            </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={editEmployee?.addressLine1 || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="Address"
                />
                <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-city"></i> City
            </label>
                <input
                  type="text"
                  name="city"
                  value={editEmployee?.city || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="City"
                />
                <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-flag-usa"></i> State
            </label>
                <input
                  type="text"
                  name="state"
                  value={editEmployee?.state || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="State"
                />
                <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-map-pin"></i> Zipcode
            </label>
                <input
                  type="text"
                  name="zipcode"
                  value={editEmployee?.zipcode || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="Zipcode"
                />
                <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-globe"></i> Country
            </label>
                <input
                  type="text"
                  name="country"
                  value={editEmployee?.country || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="Country"
                />
                <label className="font-bold">
              <i className="fa-solid fa-phone"></i> Phone
            </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editEmployee?.phone || ""}
                  onChange={handleEditChange}
                  className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
                  placeholder="Phone Number"
                />
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            )}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
