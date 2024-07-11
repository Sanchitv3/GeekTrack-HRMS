import React from 'react';
import { useNavigate } from 'react-router-dom';
import { empList, pic1 } from '../../assets';
import { addEmp } from '../../assets';

const ManageEmployees = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col bg-contain bg-no-repeat h-full w-full " style={{backgroundImage: `url(${pic1})`}}>
      <div className='w-full h-full bg-white/90 rounded-3xl flex flex-col gap-16'>
      <h1 className="text-center text-3xl font-bold mb-6 font-mono">Manage Employees</h1>
      {/* <img src={pic1} alt="illustration" className='h-[50%] w-[50%]'/> */}
      <div className="flex justify-center gap-14">
        <button 
          className="text-black p-6 rounded-2xl shadow-lg shadow-slate-600 flex flex-col justify-center items-center h-40 w-40 font-bold backdrop-blur-3xl hover:translate-y-5 duration-700 hover:scale-110"
          onClick={() => navigate('/employee-list')}
        >
        <img src={empList} alt='add Employee Icon' /> Employee List
        </button>
        <button 
          className="text-black p-4 rounded-2xl shadow-lg shadow-slate-600 flex flex-col justify-center items-center h-40 w-40 font-bold backdrop-blur-3xl hover:translate-y-5 duration-700 hover:scale-110"
          onClick={() => navigate('/addEmployee')}
        >
        <img src={addEmp} alt='add Employee Icon' />  Add Employee
        </button>
      </div>
      </div>
    </div>
  );
}

export default ManageEmployees;
