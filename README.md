# Project Management SaaS

A full-stack project management application with a Spring Boot backend, React frontend, and MySQL schema.

## Structure

- `backend` - Spring Boot API with JWT authentication, project management, and task tracking
- `frontend` - React + Vite client with dashboard, auth pages, and kanban board
- `database` - MySQL schema for users, projects, and tasks

## Backend setup

1. Update the MySQL credentials in `backend/src/main/resources/application.properties`.
2. Create the database using `database/schema.sql` or allow Hibernate to create tables.
3. Start the backend from `backend`:
   - `mvn spring-boot:run`

## Frontend setup

1. Install dependencies from `frontend`:
   - `npm install`
2. Start the frontend:
   - `npm run dev`
3. Open `http://localhost:5173`

## API summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/users`
- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/dashboard`
- `GET /api/projects/{projectId}`
- `POST /api/tasks`
- `GET /api/tasks/project/{projectId}`
- `PUT /api/tasks/{taskId}/status`

## Notes

- Managers can create projects and tasks.
- Developers can view assigned projects and update task status.
- JWT authentication is enabled for all protected endpoints.
