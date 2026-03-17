import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import Register from './pages/Register.jsx';
import { clearAuth, fetchCurrentUser, getStoredAuth, storeAuth } from './services/api';
import './App.css';

function ProtectedLayout({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={onLogout} />
      <main className="content-shell">{children}</main>
    </div>
  );
}

function ProtectedRoute({ user, onLogout, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <ProtectedLayout user={user} onLogout={onLogout}>
      {children}
    </ProtectedLayout>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const auth = getStoredAuth();
    return auth
      ? { id: auth.id, name: auth.name, email: auth.email, role: auth.role }
      : null;
  });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth?.token) {
      setAuthReady(true);
      return;
    }

    fetchCurrentUser()
      .then((profile) => {
        setUser(profile);
        storeAuth({ ...auth, ...profile });
      })
      .catch(() => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setAuthReady(true));
  }, []);

  function handleAuthSuccess(payload) {
    storeAuth(payload);
    setUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
  }

  function handleLogout() {
    clearAuth();
    setUser(null);
  }

  if (!authReady) {
    return <div className="screen-state">Loading workspace...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onAuthSuccess={handleAuthSuccess} />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onAuthSuccess={handleAuthSuccess} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute user={user} onLogout={handleLogout}>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute user={user} onLogout={handleLogout}>
            <ProjectPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}
