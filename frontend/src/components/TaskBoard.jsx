const columns = [
  { key: 'TODO', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'DONE', label: 'Done' },
];

export default function TaskBoard({ tasks, onStatusChange }) {
  function handleDrop(nextStatus, event) {
    event.preventDefault();
    const taskId = Number(event.dataTransfer.getData('taskId'));
    if (taskId) {
      onStatusChange(taskId, nextStatus);
    }
  }

  return (
    <section className="kanban-grid">
      {columns.map((column) => {
        const items = tasks.filter((task) => task.status === column.key);
        return (
          <div
            key={column.key}
            className="kanban-column"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(column.key, event)}
          >
            <div className="kanban-column-header">
              <h3>{column.label}</h3>
              <span>{items.length}</span>
            </div>
            <div className="kanban-stack">
              {items.map((task) => (
                <article
                  key={task.id}
                  className="task-card"
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('taskId', String(task.id))}
                >
                  <div className="task-card-header">
                    <h4>{task.taskName}</h4>
                    <span className="task-chip">{column.label}</span>
                  </div>
                  <p>{task.description || 'No task description provided.'}</p>
                  <div className="task-meta">
                    <span>{task.assignedTo ? `Assigned to ${task.assignedTo.name}` : 'Unassigned'}</span>
                    <span>{task.deadline || 'No deadline'}</span>
                  </div>
                  <div className="task-actions">
                    {column.key !== 'TODO' && (
                      <button type="button" className="ghost-button" onClick={() => onStatusChange(task.id, column.key === 'DONE' ? 'IN_PROGRESS' : 'TODO')}>
                        Move left
                      </button>
                    )}
                    {column.key !== 'DONE' && (
                      <button type="button" className="ghost-button" onClick={() => onStatusChange(task.id, column.key === 'TODO' ? 'IN_PROGRESS' : 'DONE')}>
                        Move right
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {!items.length && <div className="empty-column">Drop a task here.</div>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
