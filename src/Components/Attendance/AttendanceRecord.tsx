import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

interface Attendance {
    id: string;
    date: string; // Storing date as string for simplicity
    status: string;
}

const AttendanceRecord: React.FC = () => {
    const [employeeID, setEmployeeID] = useState<string | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            const fetchEmployeeID = async () => {
                const employeesQuery = query(
                    collection(db, "Employees"),
                    where("email", "==", currentUser.email)
                );
                const querySnapshot = await getDocs(employeesQuery);
                if (!querySnapshot.empty) {
                    const employeeDoc = querySnapshot.docs[0];
                    setEmployeeID(employeeDoc.id);
                }
            };

            fetchEmployeeID();
        }
    }, []);

    useEffect(() => {
        if (employeeID) {
            const attendanceQuery = query(
                collection(db, "Attendance"),
                where("employeeID", "==", employeeID)
            );

            const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
                const attendanceData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Attendance, "id">),
                }));
                attendanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setAttendanceRecords(attendanceData);
            });

            return () => unsubscribe();
        }
    }, [employeeID]);

    return (
        <div className=''>
            <h1 className='font-bold text-xl text-center'>Attendance Record</h1>
            <div className='grid grid-cols-5 gap-8'>
                {attendanceRecords.map(record => (
                    <div key={record.id} className='p-4 border-b-4'>
                        <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                        <p>Status: {record.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default AttendanceRecord;
