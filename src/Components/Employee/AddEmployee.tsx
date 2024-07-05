import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { Timestamp, addDoc, collection, getDocs } from "firebase/firestore";

const AddEmployee: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [roleID, setRoleID] = useState("");
  const [roles, setRoles] = useState<{ id: string; roleName: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesCollection = await getDocs(collection(db, "Roles"));
      const rolesData = rolesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; roleName: string }[];
      setRoles(rolesData);
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await addDoc(collection(db, "Employees"), {
      name,
      email,
      phone,
      department,
      addressLine1,
      city,
      state,
      zipcode,
      country,
      dateOfJoining: Timestamp.fromDate(new Date(dateOfJoining)),
      roleID,
      deleted: false, // Default value for soft delete
    });
    alert(`Employee : ${name} added successfully.`);
    setName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setAddressLine1("");
    setCity("");
    setState("");
    setZipcode("");
    setCountry("");
    setDateOfJoining("");
    setRoleID("");
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between flex-col h-[90vh] w-[70vw] bg-gradient-to-b from-slate-100 to-slate-300 rounded-3xl shadow-xl p-10"
      >
        <div className="justify-around flex flex-col h-[80%] w-[80%] font-mono">
          <div className="justify-between flex items-center">
            <label className="font-bold">
              <i className="fa-solid fa-id-card"></i> Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800  focus:translate-x-2 duration-700"
              placeholder="Employee Name"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold">
              <i className="fa-solid fa-envelope"></i> Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Employee Email"
              className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              type="email"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold">
              <i className="fa-solid fa-phone"></i> Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="Employee Phone"
              type="number"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold">
              <i className="fa-solid fa-building"></i> Department
            </label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-md w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="Department"
              type="text"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-map-marker-alt"></i> Address Line 1
            </label>
            <textarea
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-md w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="Address Line 1"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-city"></i> City
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-md w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="City"
              type="text"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-flag-usa"></i> State
            </label>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-md w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="State"
              type="text"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-map-pin"></i> Zipcode
            </label>
            <input
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-md w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="Zipcode"
              type="text"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold shadow-slate-700">
              <i className="fa-solid fa-globe"></i> Country
            </label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-md w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="Country"
              type="text"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="font-bold">
              <i className="fa-regular fa-calendar"></i> Date of Joining
            </label>
            <input
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
              placeholder="Date of Joining"
              type="date"
            />
          </div>
          <div className="justify-between flex items-center">
            <label className="font-bold">
              <i className="fa-solid fa-user-tag"></i> Role
            </label>
            <select
              value={roleID}
              onChange={(e) => setRoleID(e.target.value)}
              className="border-none outline-none rounded-xl p-2 shadow-xl shadow-slate-700 w-[60%] bg-slate-800 text-slate-100 px-4 focus:outline-slate-800 focus:translate-x-2 duration-700"
            >
              <option value="" disabled>Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.roleName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-[80%]">
          <button
            className="bg-black shadow-xl text-white p-2 rounded-xl w-full font-bold font-mono"
            type="submit"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
