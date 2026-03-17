import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import { createProject, fetchDashboard } from '../services/api';

export default function Dashboard({ user }) {
  const [dashboard, setDashboard] = useState(null);
  const [projectForm, setProjectForm] = useState({ projectName: '', description: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await fetchDashboard();
      setDashboard(data);
    } catch (requestError) {
      setError('Unable to load dashboard data. Make sure the backend is running.');
    }
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await createProject(projectForm);
      setProjectForm({ projectName: '', description: '' });
      await loadDashboard();
    } catch (requestError) {
      setError('Project could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const stats = dashboard
    ? [
        { label: 'Total Projects', value: dashboard.totalProjects },
        { label: 'Completed Tasks', value: dashboard.completedTasks },
        { label: 'Pending Tasks', value: dashboard.pendingTasks },
        { label: 'In Progress', value: dashboard.inProgressTasks },
      ]
    : [];

  return (
    <div className="dashboard-page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h1>{user.role === 'MANAGER' ? 'Manage delivery across your portfolio.' : 'Track the work assigned to you.'}</h1>
          <p className="muted-copy">
            Monitor project velocity, task completion, and current execution health from a single dashboard.
          </p>
        </div>
        <div className="completion-panel">
          <span>Completion rate</span>
          <strong>{dashboard ? `${Math.round(dashboard.completionRate)}%` : '--'}</strong>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      {user.role === 'MANAGER' && (
        <section className="workspace-grid">
          <form className="panel" onSubmit={handleCreateProject}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Create project</p>
                <h2>Start a new delivery stream</h2>
              </div>
            </div>
            <label>
              Project name
              <input
                value={projectForm.projectName}
                onChange={(event) => setProjectForm((current) => ({ ...current, projectName: event.target.value }))}
                required
              />
            </label>
            <label>
              Description
              <textarea
                rows="4"
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
              />
            </label>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create project'}
            </button>
          </form>
          <div className="panel accent-surface">
            <p className="eyebrow">Manager view</p>
            <h2>See risk early</h2>
            <p className="muted-copy">
              Use project progress, in-progress load, and task completion to identify delivery bottlenecks before deadlines slip.
            </p>
          </div>
        </section>
      )}

      {error ? <p className="error-text">{error}</p> : null}

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>{user.role === 'MANAGER' ? 'All active projects' : 'Projects assigned to you'}</h2>
          </div>
        </div>
        <div className="project-grid">
          {dashboard?.projects?.length ? (
            dashboard.projects.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <div className="empty-state">No projects available yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
