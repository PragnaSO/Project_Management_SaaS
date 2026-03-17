import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await loginUser(formData);
      onAuthSuccess(data);
      navigate('/');
    } catch (requestError) {
      if (!requestError.response) {
        setError('Cannot reach backend server on http://localhost:8080. Start backend and try again.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel intro-panel">
        <p className="eyebrow">Project flow, simplified</p>
        <h1>Coordinate teams, deadlines, and delivery in one workspace.</h1>
        <p className="muted-copy">
          Managers create projects, assign tasks, and monitor progress. Developers update work instantly from the kanban board.
        </p>
      </div>
      <form className="auth-panel form-panel" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Email
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            required
          />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
        <p className="muted-copy">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
