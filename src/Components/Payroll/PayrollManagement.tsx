import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, updateDoc, doc, addDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import Modal from '../Modal/Modal';

interface Employee {
  id: string;
  name: string;
  email: string;
  deleted: boolean;
  deletedAt: string;
  roleID: string;
}

interface EmployeeSalary {
  id: string;
  name: string;
  baseSalary: number;
  deductions: number;
  variableSalary: number;
  netSalary: number;
  processed: boolean;
}

interface Payroll {
  id: string;
  month: string;
  year: number;
  employeeSalaries: EmployeeSalary[];
}

const calculateNetSalary = (baseSalary: number, deductions: number, variableSalary: number): number => {
  return baseSalary + variableSalary - deductions;
};

const PayrollManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [editingSalary, setEditingSalary] = useState<{ [key: string]: EmployeeSalary }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<{ payrollId: string, employeeId: string } | null>(null);

  useEffect(() => {
    const unsubscribeEmployees = onSnapshot(collection(db, 'Employees'), (snapshot) => {
      const employeesData: Employee[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Employee;
        employeesData.push({ ...data, id: doc.id });
      });
      setEmployees(employeesData);
    });

    const unsubscribePayroll = onSnapshot(collection(db, 'Payroll'), (snapshot) => {
      const payrollData: Payroll[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Payroll;
        payrollData.push({ ...data, id: doc.id });
      });
      setPayroll(payrollData);
    });

    return () => {
      unsubscribeEmployees();
      unsubscribePayroll();
    };
  }, []);

  const filteredEmployees = employees.filter(employee => !employee.deleted);

  const handleProcessPayroll = useCallback(async () => {
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();

    const payrollQuery = query(collection(db, 'Payroll'), where('month', '==', month), where('year', '==', year));
    const querySnapshot = await getDocs(payrollQuery);

    if (!querySnapshot.empty) {
      alert(`Payroll for ${month} ${year} has already been processed.`);
      return;
    }

    const newPayroll: Payroll = {
      id: '',
      month,
      year,
      employeeSalaries: filteredEmployees.map(employee => {
        const baseSalary = 21000;
        const variableSalary = 5000;
        const deductions = 2500;
        const netSalary = calculateNetSalary(baseSalary, deductions, variableSalary);
        return {
          id: employee.id,
          name: employee.name,
          baseSalary,
          deductions,
          variableSalary,
          netSalary,
          processed: false,
        };
      }),
    };

    const payrollDoc = await addDoc(collection(db, 'Payroll'), newPayroll);
    await updateDoc(payrollDoc, { id: payrollDoc.id });
  }, [filteredEmployees]);

  const handleProcessSalary = useCallback(async (payrollId: string, employeeId: string) => {
    const payrollDoc = doc(db, 'Payroll', payrollId);
    const payrollSnapshot = await getDoc(payrollDoc);
    const payrollData = payrollSnapshot.data() as Payroll;

    const updatedEmployeeSalaries = payrollData.employeeSalaries.map(employeeSalary => {
      if (employeeSalary.id === employeeId) {
        return { ...employeeSalary, processed: true };
      }
      return employeeSalary;
    });

    await updateDoc(payrollDoc, { employeeSalaries: updatedEmployeeSalaries });
  }, []);

  const handleEditSalaryChange = (employeeId: string, field: string, value: number) => {
    setEditingSalary(prevState => {
      const updatedSalary = {
        ...prevState[employeeId],
        [field]: value,
        netSalary: calculateNetSalary(
          field === 'baseSalary' ? value : prevState[employeeId].baseSalary,
          field === 'deductions' ? value : prevState[employeeId].deductions,
          field === 'variableSalary' ? value : prevState[employeeId].variableSalary
        ),
      };
      return {
        ...prevState,
        [employeeId]: updatedSalary,
      };
    });
  };

  const handleSaveEdits = async () => {
    if (!currentEdit) return;
    
    const { payrollId, employeeId } = currentEdit;
    const payrollDoc = doc(db, 'Payroll', payrollId);
    const payrollSnapshot = await getDoc(payrollDoc);
    const payrollData = payrollSnapshot.data() as Payroll;

    const updatedEmployeeSalaries = payrollData.employeeSalaries.map(employeeSalary => {
      if (employeeSalary.id === employeeId) {
        return { ...editingSalary[employeeId], processed: false };
      }
      return employeeSalary;
    });

    await updateDoc(payrollDoc, { employeeSalaries: updatedEmployeeSalaries });
    setEditingSalary(prevState => {
      const { [employeeId]: _, ...rest } = prevState;
      return rest;
    });
    setIsModalOpen(false);
    setCurrentEdit(null);
  };

  const openEditModal = (payrollId: string, employeeSalary: EmployeeSalary) => {
    setEditingSalary({ [employeeSalary.id]: employeeSalary });
    setCurrentEdit({ payrollId, employeeId: employeeSalary.id });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold mb-6">Payroll Management</h1>
      <button
        onClick={handleProcessPayroll}
        className="bg-blue-600 text-white py-2 px-4 rounded-md mb-4"
      >
        Process Payroll
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Month</th>
              <th className="py-2 px-4 border-b">Year</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((payrollItem) => (
              <tr key={payrollItem.id}>
                <td className="py-2 px-4 border-b">{payrollItem.month}</td>
                <td className="py-2 px-4 border-b">{payrollItem.year}</td>
                <td className="py-2 px-4 border-b">
                  {payrollItem.employeeSalaries.map((employeeSalary) => (
                    <div key={employeeSalary.id} className="mb-2">
                      <span className='font-bold text-slate-600 block'>{employeeSalary.name}:</span>
                      <button
                        onClick={() => openEditModal(payrollItem.id, employeeSalary)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded-md mr-2"
                      >
                        Edit Salary
                      </button>
                      <button
                        onClick={() => handleProcessSalary(payrollItem.id, employeeSalary.id)}
                        className={`py-1 px-3 rounded-md ${employeeSalary.processed ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'}`}
                        disabled={employeeSalary.processed}
                      >
                        {employeeSalary.processed ? 'Processed' : 'Process Salary'}
                      </button>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentEdit && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <label className="block">
              Base Salary:
              <input
                type="number"
                value={editingSalary[currentEdit.employeeId]?.baseSalary}
                onChange={(e) => handleEditSalaryChange(currentEdit.employeeId, 'baseSalary', Number(e.target.value))}
                placeholder="Base Salary"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-4"
              />
            </label>
            <label className="block">
              Deductions:
              <input
                type="number"
                value={editingSalary[currentEdit.employeeId]?.deductions}
                onChange={(e) => handleEditSalaryChange(currentEdit.employeeId, 'deductions', Number(e.target.value))}
                placeholder="Deductions"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-4"
              />
            </label>
            <label className="block">
              Variable Salary:
              <input
                type="number"
                value={editingSalary[currentEdit.employeeId]?.variableSalary}
                onChange={(e) => handleEditSalaryChange(currentEdit.employeeId, 'variableSalary', Number(e.target.value))}
                placeholder="Variable Salary"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-4"
              />
            </label>
            <button
              onClick={handleSaveEdits}
              className="bg-green-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PayrollManagement;
