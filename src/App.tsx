import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginScreen from './Components/Login/LoginScreen';
import ProtectedRoute from './Components/ProtectedRoute';
import Layout from './Components/Layout';
import AddEmployee from './Components/Employee/AddEmployee';
import ProjectList from './Components/Projects/ProjectList';
import AssignEmployees from './Components/Projects/AssignEmployees';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addEmployee" element={<AddEmployee/>}/>
            <Route path="/projects" Component={ProjectList} />
            <Route path="/assign-employees" Component={AssignEmployees} />
          </Route>
        </Route>
    </Routes>
  </Router>
  );
}

export default App;
