import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import UserLogin from '../src/components/UserLogin.js';
import UserSignup from '../src/components/UserSignup.js'
import UserChat from '../src/components/UserChat.js';
import AdminDashboard from '../src/components/Admin/AdminDashboard.js';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLogin/>} />
      <Route path="/signup" element={<UserSignup/>} />
       <Route path="/chat" element={<UserChat/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;


