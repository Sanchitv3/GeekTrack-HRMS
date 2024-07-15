import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

interface LeaveRequest {
  id: string;
  employeeID: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface Employee {
  id: string;
  name: string;
}

const LeaveRequests: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "LeaveRequests"));
        const requests: LeaveRequest[] = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() } as LeaveRequest);
        });
        setLeaveRequests(requests);
      } catch (error) {
        console.error("Error fetching leave requests: ", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Employees"));
        const employeesData: Employee[] = [];
        querySnapshot.forEach((doc) => {
          employeesData.push({ id: doc.id, name: doc.data().name } as Employee);
        });
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchLeaveRequests();
    fetchEmployees();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const leaveRequestRef = doc(db, "LeaveRequests", id);
      await updateDoc(leaveRequestRef, { status });
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
      alert(`Leave request ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error(
        `Error updating leave request status to ${status}: `,
        error
      );
      alert(`Error updating leave request status to ${status}.`);
    }
  };

  const renderRequest = (request: LeaveRequest) => {
    const employee = employees.find((emp) => emp.id === request.employeeID);
    const employeeName = employee ? employee.name : "Unknown";

    return (
      <div key={request.id} className="shadow-2xl w-[25%] p-4 rounded-3xl">
        <p><b></b>Employee Name: {employeeName}</p>
        <p>Start Date: {new Date(request.startDate).toLocaleDateString()}</p>
        <p>End Date: {new Date(request.endDate).toLocaleDateString()}</p>
        <p>Reason: {request.reason}</p>
        <p>Status: {request.status}</p>
        {request.status === "Pending" && (
          <div className="w-full flex justify-evenly p-2">
            <button
              onClick={() => handleUpdateStatus(request.id, "Approved")}
              className="p-2 bg-green-500 rounded-3xl hover:translate-y-1 duration-700 hover:opacity-80 text-white" 
            >
              Approve
            </button>
            <button onClick={() => handleUpdateStatus(request.id, "Rejected")} className="p-2 bg-red-500 rounded-3xl hover:translate-y-1 duration-700 hover:opacity-80 text-white">
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-serif font-semibold tracking-wider text-center">Leave Requests</h1>
      <div className="flex gap-10">
      {leaveRequests.map(renderRequest)}
      </div>
    </div>
  );
};

export default LeaveRequests;
