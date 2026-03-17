import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TaskBoard from '../components/TaskBoard.jsx';
import { createTask, fetchProject, fetchProjectTasks, fetchUsers, updateTaskStatus } from '../services/api';

export default function ProjectPage({ user }) {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState({
    taskName: '',
    description: '',
    assignedToUserId: '',
    deadline: '',
  });

  useEffect(() => {
    loadProjectPage();
  }, [projectId]);

  async function loadProjectPage() {
    try {
      const [projectData, taskData, userData] = await Promise.all([
        fetchProject(projectId),
        fetchProjectTasks(projectId),
        fetchUsers(),
      ]);
      setProject(projectData);
      setTasks(taskData);
      setUsers(userData);
    } catch (requestError) {
      setError('Unable to load project data.');
    }
  }

  async function handleTaskCreate(event) {
    event.preventDefault();
    setError('');
    try {
      await createTask({
        ...taskForm,
        projectId: Number(projectId),
        assignedToUserId: taskForm.assignedToUserId ? Number(taskForm.assignedToUserId) : null,
        deadline: taskForm.deadline || null,
      });
      setTaskForm({ taskName: '', description: '', assignedToUserId: '', deadline: '' });
      await loadProjectPage();
    } catch (requestError) {
      setError('Task could not be created.');
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      const updatedTask = await updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (requestError) {
      setError('Task status update failed.');
    }
  }

  return (
    <div className="project-page">
      <Link to="/" className="back-link">
        Back to dashboard
      </Link>

      <section className="panel project-summary-panel">
        <div>
          <p className="eyebrow">Project board</p>
          <h1>{project?.projectName || 'Loading project...'}</h1>
          <p className="muted-copy">{project?.description || 'Project description will appear here.'}</p>
        </div>
        <div className="project-summary-meta">
          <span>Created by {project?.createdBy?.name || '-'}</span>
          <strong>{project ? `${Math.round(project.progress)}% complete` : '--'}</strong>
        </div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      {(user.role === 'MANAGER' || user.role === 'DEVELOPER') && (
        <section className="workspace-grid project-grid-top">
          <form className="panel" onSubmit={handleTaskCreate}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Create task</p>
                <h2>Add work to this project</h2>
              </div>
            </div>
            <label>
              Task name
              <input
                value={taskForm.taskName}
                onChange={(event) => setTaskForm((current) => ({ ...current, taskName: event.target.value }))}
                required
              />
            </label>
            <label>
              Description
              <textarea
                rows="3"
                value={taskForm.description}
                onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))}
              />
            </label>
            <label>
              Assign to user
              <select
                value={taskForm.assignedToUserId}
                onChange={(event) => setTaskForm((current) => ({ ...current, assignedToUserId: event.target.value }))}
              >
                <option value="">Unassigned</option>
                {users.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Deadline
              <input
                type="date"
                value={taskForm.deadline}
                onChange={(event) => setTaskForm((current) => ({ ...current, deadline: event.target.value }))}
              />
            </label>
            <button type="submit" className="primary-button">
              Create task
            </button>
          </form>
          <div className="panel accent-surface">
            <p className="eyebrow">Workflow</p>
            <h2>Use drag and drop or quick-move buttons</h2>
            <p className="muted-copy">
              Move tasks across To Do, In Progress, and Done to keep the board current and expose blockers early.
            </p>
          </div>
        </section>
      )}

      <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  );
}
