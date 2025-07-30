import './App.css';

import React from 'react';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import HabitTracker from './components'; // renamed from App to HabitTracker
import Login from './components/Login';
import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { user, logout } = useAuth();

  return (
    <Router>
      {user && (
        <nav>
          <span>Hi, {user.email}</span>
          <button onClick={logout}>Logout</button>
        </nav>
      )}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/tracker" /> : <Login />} />
        <Route path="/tracker" element={<PrivateRoute><HabitTracker /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
