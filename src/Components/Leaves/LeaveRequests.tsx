import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc, query, where, addDoc, getDocs } from "firebase/firestore";
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
    const fetchLeaveRequests = () => {
      const unsubscribe = onSnapshot(collection(db, "LeaveRequests"), (querySnapshot) => {
        const requests: LeaveRequest[] = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() } as LeaveRequest);
        });
        setLeaveRequests(requests);
      });

      return unsubscribe;
    };

    const fetchEmployees = () => {
      const unsubscribe = onSnapshot(collection(db, "Employees"), (querySnapshot) => {
        const employeesData: Employee[] = [];
        querySnapshot.forEach((doc) => {
          employeesData.push({ id: doc.id, name: doc.data().name } as Employee);
        });
        setEmployees(employeesData);
      });

      return unsubscribe;
    };

    const leaveRequestsUnsubscribe = fetchLeaveRequests();
    const employeesUnsubscribe = fetchEmployees();

    return () => {
      leaveRequestsUnsubscribe();
      employeesUnsubscribe();
    };
  }, []);

  const updateAttendanceRecords = async (employeeID: string, startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        const attendanceQuery = query(
          collection(db, "Attendance"),
          where("employeeID", "==", employeeID),
          where("date", "==", dateStr)
        );
        const querySnapshot = await getDocs(attendanceQuery);

        if (!querySnapshot.empty) {
          const attendanceDoc = querySnapshot.docs[0];
          const attendanceDocRef = doc(db, "Attendance", attendanceDoc.id);
          await updateDoc(attendanceDocRef, { status: "Leave" });
        } else {
          await addDoc(collection(db, "Attendance"), {
            date: dateStr,
            status: "Leave",
            employeeID,
          });
        }
        current.setDate(current.getDate() + 1);
      }
    } catch (error) {
      console.error("Error updating attendance records: ", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const leaveRequestRef = doc(db, "LeaveRequests", id);
      await updateDoc(leaveRequestRef, { status });

      if (status === "Approved") {
        const leaveRequest = leaveRequests.find((request) => request.id === id);
        if (leaveRequest) {
          await updateAttendanceRecords(
            leaveRequest.employeeID,
            leaveRequest.startDate,
            leaveRequest.endDate
          );
        }
      }

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

  const renderRequest = (request: LeaveRequest) => {
    const employee = employees.find((emp) => emp.id === request.employeeID);
    const employeeName = employee ? employee.name : "Unknown";

    return (
      <div key={request.id} className="shadow-2xl w-[80%] p-4 rounded-3xl">
        <p>
          <b>Employee Name:</b> {employeeName}
        </p>
        <p>
          <b>Start Date:</b> {new Date(request.startDate).toLocaleDateString()}
        </p>
        <p>
          <b>End Date:</b> {new Date(request.endDate).toLocaleDateString()}
        </p>
        <p>
          <b>Reason:</b> {request.reason}
        </p>
        <p>
          <b>Status:</b> {request.status}
        </p>
        {request.status === "Pending" && (
          <div className="w-full flex justify-evenly p-2">
            <button
              onClick={() => handleUpdateStatus(request.id, "Approved")}
              className="p-2 bg-green-500 rounded-3xl hover:translate-y-1 duration-700 hover:opacity-80 text-white"
            >
              Approve
            </button>
            <button
              onClick={() => handleUpdateStatus(request.id, "Rejected")}
              className="p-2 bg-red-500 rounded-3xl hover:translate-y-1 duration-700 hover:opacity-80 text-white"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-serif font-semibold tracking-wider text-center">
        Leave Requests
      </h1>
      <div className="grid grid-cols-3 gap-10">
        {leaveRequests.map(renderRequest)}
      </div>
    </div>
  );
};

export default LeaveRequests;
