import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <header className="topbar">
      <div>
        <Link to="/" className="brand-mark">
          FlowForge
        </Link>
        <p className="brand-copy">Project management SaaS for managers and developers.</p>
      </div>
      <nav className="topbar-nav">
        <Link className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} to="/">
          Dashboard
        </Link>
        <div className="user-pill">
          <span>{user?.name}</span>
          <small>{user?.role}</small>
        </div>
        <button type="button" className="ghost-button" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}
