package com.projectmanagement.service;

import com.projectmanagement.dto.DashboardResponse;
import com.projectmanagement.dto.ProjectRequest;
import com.projectmanagement.dto.ProjectResponse;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.Task;
import com.projectmanagement.model.TaskStatus;
import com.projectmanagement.model.User;
import com.projectmanagement.model.UserRole;
import com.projectmanagement.repository.ProjectRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectService(ProjectRepository projectRepository, UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);

        Project project = new Project();
        project.setProjectName(request.getProjectName());
        project.setDescription(request.getDescription());
        project.setCreatedBy(currentUser);

        Project savedProject = projectRepository.save(project);
        return ProjectResponse.from(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);
        List<Project> projects = currentUser.getRole() == UserRole.MANAGER
                ? projectRepository.findAllWithTasks()
                : projectRepository.findAssignedProjects(currentUser.getId());

        return projects.stream().map(ProjectResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found."));
        project.getTasks().size();
        return ProjectResponse.from(project);
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Authentication authentication) {
        List<ProjectResponse> projects = getProjects(authentication);
        List<Task> visibleTasks = projects.stream()
                .flatMap(project -> project.getTasks().stream())
                .map(taskResponse -> {
                    Task task = new Task();
                    task.setStatus(taskResponse.getStatus());
                    return task;
                })
                .toList();

        long completedTasks = visibleTasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
        long pendingTasks = visibleTasks.stream().filter(task -> task.getStatus() == TaskStatus.TODO).count();
        long inProgressTasks = visibleTasks.stream().filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS).count();
        double completionRate = visibleTasks.isEmpty() ? 0 : (completedTasks * 100.0) / visibleTasks.size();

        return new DashboardResponse(
                projects.size(),
                completedTasks,
                pendingTasks,
                inProgressTasks,
                completionRate,
                projects
        );
    }
}
