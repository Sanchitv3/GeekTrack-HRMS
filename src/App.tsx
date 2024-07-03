import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import LoginScreen from './Components/Login/LoginScreen';
import ProtectedRoute from './Components/ProtectedRoute';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
    </Routes>
  </Router>
  );
}

export default App;
