import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <div>
          <p className="eyebrow">Project</p>
          <h3>{project.projectName}</h3>
        </div>
        <span className="badge">{Math.round(project.progress)}% done</span>
      </div>
      <p className="muted-copy">{project.description || 'No description added yet.'}</p>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${project.progress}%` }} />
      </div>
      <div className="project-card-footer">
        <span>{project.tasks.length} tasks</span>
        <Link to={`/projects/${project.id}`} className="primary-link">
          Open board
        </Link>
      </div>
    </article>
  );
}
