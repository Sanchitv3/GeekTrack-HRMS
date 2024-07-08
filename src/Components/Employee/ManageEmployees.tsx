import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManageEmployees = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">Manage Employees</h1>
      <div className="flex justify-center space-x-4">
        <button 
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => navigate('/employee-list')}
        >
          Employee List
        </button>
        <button 
          className="bg-green-500 text-white p-2 rounded"
          onClick={() => navigate('/addEmployee')}
        >
          Add Employee
        </button>
      </div>
    </div>
  );
}

export default ManageEmployees;
