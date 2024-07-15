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
      console.error(`Error updating leave request status to ${status}: `, error);
      alert(`Error updating leave request status to ${status}.`);
    }
  };

  const renderItem = ({ item }: { item: LeaveRequest }) => {
    const employee = employees.find(emp => emp.id === item.employeeID);
    const employeeName = employee ? employee.name : 'Unknown';
    
    return (
      <div style={styles.requestContainer}>
        <p>Employee Name: {employeeName}</p>
        <p>Start Date: {new Date(item.startDate).toLocaleDateString()}</p>
        <p>End Date: {new Date(item.endDate).toLocaleDateString()}</p>
        <p>Reason: {item.reason}</p>
        <p>Status: {item.status}</p>
        {item.status === "Pending" && (
          <div>
            <button onClick={() => handleUpdateStatus(item.id, "Approved")}>
              Approve
            </button>
            <button onClick={() => handleUpdateStatus(item.id, "Rejected")}>
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Leave Requests</h1>
      {leaveRequests.map((request) => (
        <div key={request.id} style={styles.requestContainer}>
          <p>Employee Name: {request.employeeID}</p>
          <p>Start Date: {new Date(request.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(request.endDate).toLocaleDateString()}</p>
          <p>Reason: {request.reason}</p>
          <p>Status: {request.status}</p>
          {request.status === "Pending" && (
            <div>
              <button onClick={() => handleUpdateStatus(request.id, "Approved")}>
                Approve
              </button>
              <button onClick={() => handleUpdateStatus(request.id, "Rejected")}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
  },
  requestContainer: {
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 10,
  },
};

export default LeaveRequests;
