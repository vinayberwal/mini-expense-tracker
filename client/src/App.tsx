import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Settings, CreditCard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';

function Sidebar() {
  return (
    <div className="sidebar glass-panel">
      <div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)' }}>
          <CreditCard size={28} />
          <span>Expenso</span>
        </h2>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Receipt size={20} />
          Expenses
        </NavLink>
        <div className="nav-item" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
          <Settings size={20} />
          Settings
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
