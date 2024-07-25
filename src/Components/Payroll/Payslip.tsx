import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EmployeeSalary } from './PayrollManagement';
import { Geekyants_Logo} from '../../assets';

interface PayslipProps {
  employeeSalary: EmployeeSalary;
  month: string;
  year: number;
}

const Payslip: React.FC<PayslipProps> = ({ employeeSalary, month, year }) => {
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.addImage(Geekyants_Logo, 'SVG', 30, 30, 100, 20);
    doc.setFontSize(16);
    doc.text(`Payslip For ${month} ${year}`, 14, 20);
    autoTable(doc, {
      startY: 50,
      body: [
        ['Employee Name', employeeSalary.name],
        ['Month', `${month}`],
        ['Year', `${year}`],
        ['Base Salary', `+ Rs.${employeeSalary.baseSalary.toFixed(2)}`],
        ['Variable Salary', `+ Rs.${employeeSalary.variableSalary.toFixed(2)}`],
        ['Deductions', `- Rs.${employeeSalary.deductions.toFixed(2)}`],
        ['Total Salary', `  Rs.${employeeSalary.netSalary.toFixed(2)}`],
      ],
    });
    doc.save(`Payslip_${employeeSalary.name}_${month}_${year}.pdf`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Payslip for {employeeSalary.name}</h2>
      <button
        onClick={handleDownloadPdf}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-2xl hover:translate-y-1 duration-700 "
      >
        Download Payslip as PDF
      </button>
    </div>
  );
};

export default Payslip;
