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
                setAttendanceRecords(attendanceData);
            });

            return () => unsubscribe();
        }
    }, [employeeID]);

    return (
        <div style={styles.main}>
            <h1 style={styles.title}>Attendance Record</h1>
            <div style={styles.attendanceRecords}>
                {attendanceRecords.map(record => (
                    <div key={record.id} style={styles.attendanceItem}>
                        <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                        <p>Status: {record.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    main: {
        marginTop: '40px',
    },
    attendanceRecords: {
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '0 16px',
    },
    attendanceItem: {
        padding: '16px',
        borderBottom: '1px solid #ccc',
        marginBottom: '8px',
    },
    title: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '8px',
    },
};

export default AttendanceRecord;
