import { HashRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';

import ForgotPassword from './pages/ForgotPassword';

import Login from './pages/Login';

import Register from './pages/Register';

import Dashboard from './pages/Dashboard';

import VerificationRequest from './pages/VerificationRequest';

import TrackVerification from './pages/TrackVerification';

export default function App() {


  return (

    <AuthProvider>

      <HashRouter>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
  path="/verification-request"
  element={<VerificationRequest />}
/>

<Route
  path="/track-verification"
  element={<TrackVerification />}
/>

        </Routes>

      </HashRouter>

    </AuthProvider>

  );
}

