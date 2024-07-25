import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc, query, where, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { BiCheckCircle, BiXCircle, BiHourglass } from "react-icons/bi"; 
import { LeaveBg } from "../../assets";

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

  const handleAutoApproveSickLeave = async (id: string) => {
    const leaveRequest = leaveRequests.find((request) => request.id === id);
    if (leaveRequest?.reason === "Sick") {
      await handleUpdateStatus(id, "Approved");
    }
  };

  const renderRequest = (request: LeaveRequest) => {
    const employee = employees.find((emp) => emp.id === request.employeeID);
    const employeeName = employee ? employee.name : "Unknown";

    let icon;
    switch (request.status) {
      case "Approved":
        icon = <BiCheckCircle color="green"/>;
        break;
      case "Rejected":
        icon = <BiXCircle color="red"/>;
        break;
      default:
        icon = <BiHourglass color="orange"/>;
    }
    // Automatically approve Sick leave requests
    
      if (request.reason === "Sick" && request.status === "Pending") {
        handleAutoApproveSickLeave(request.id);
      }

      return (
        <div
          key={request.id}
          className={`shadow-xl w-full p-4 rounded-lg ${
            request.status === "Approved" ? "outline-dashed outline-green-300" :
            request.status === "Rejected" ? "outline-dashed outline-red-300" :
            "outline-dashed outline-yellow-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            {icon}
            <div>
              <p><strong>Employee Name:</strong> {employeeName}</p>
              <p><strong>Start Date:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> {request.reason}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </div>
          </div>
          {request.status === "Pending" && (
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleUpdateStatus(request.id, "Approved")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-xl duration-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus(request.id, "Rejected")}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-xl duration-700"
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
      <div className="flex">
        <img src={LeaveBg} alt="Bg" className="h-60 fixed right-0"/>
      <div className="grid grid-cols-3 gap-10 w-[75%]">
        {leaveRequests.map(renderRequest)}
      </div>
      </div>
      
    </div>
  );
};

export default LeaveRequests;
