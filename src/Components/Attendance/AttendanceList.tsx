import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

interface Attendance {
    id: string;
    date: string;
    status: string;
    employeeID: string;
}

interface Employee {
    id: string;
    name: string;
    email: string;
}

const AttendanceList: React.FC = () => {
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const employeesQuery = collection(db, 'Employees');
            const querySnapshot = await getDocs(employeesQuery);
            const employeesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Employee[];
            setEmployees(employeesData);
        };

        const fetchAttendanceRecords = async () => {
            const attendanceQuery = collection(db, 'Attendance');
            const querySnapshot = await getDocs(attendanceQuery);
            const attendanceData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Attendance[];
            setAttendanceRecords(attendanceData);
        };

        fetchEmployees();
        fetchAttendanceRecords();
    }, []);

    const getEmployeeName = (employeeID: string) => {
        const employee = employees.find(emp => emp.id === employeeID);
        return employee ? employee.name : 'Unknown';
    };

    return (
        <div style={styles.main}>
            <h1 style={styles.title}>Attendance Records</h1>
            <div style={styles.attendanceRecords}>
                {attendanceRecords.map(record => (
                    <div key={record.id} style={styles.attendanceItem}>
                        <p>Date: {new Date(record.date).toLocaleString()}</p>
                        <p>Status: {record.status}</p>
                        <p>Employee: {getEmployeeName(record.employeeID)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

export default AttendanceList;
