import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DEVELOPER',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await registerUser(formData);
      onAuthSuccess(data);
      navigate('/');
    } catch (requestError) {
      if (!requestError.response) {
        setError('Cannot reach backend server on http://localhost:8080. Start backend and try again.');
      } else if (requestError.response.status === 409) {
        setError('This email is already registered. Please use a different email.');
      } else if (requestError.response.status === 400) {
        setError('Please enter a valid email address like name@example.com.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel intro-panel accent-panel">
        <p className="eyebrow">Set up your workspace</p>
        <h1>Register as a manager or developer and start tracking work.</h1>
        <p className="muted-copy">
          The backend issues a JWT token on registration, so you land directly in the app with secure access enabled.
        </p>
      </div>
      <form className="auth-panel form-panel" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
          Full name
          <input
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </label>
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
        <label>
          Role
          <select value={formData.role} onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}>
            <option value="MANAGER">Manager</option>
            <option value="DEVELOPER">Developer</option>
          </select>
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="muted-copy">
          Already registered? <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
