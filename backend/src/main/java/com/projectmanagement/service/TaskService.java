package com.projectmanagement.service;

import com.projectmanagement.dto.TaskRequest;
import com.projectmanagement.dto.TaskResponse;
import com.projectmanagement.dto.TaskStatusUpdateRequest;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.Task;
import com.projectmanagement.model.User;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found."));

        User assignedUser = null;
        if (request.getAssignedToUserId() != null) {
            assignedUser = userService.getUserById(request.getAssignedToUserId());
        }

        Task task = new Task();
        task.setTaskName(request.getTaskName());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setAssignedTo(assignedUser);
        task.setDeadline(request.getDeadline());

        Task savedTask = taskRepository.save(task);
        return TaskResponse.from(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectIdWithAssignee(projectId).stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long taskId, TaskStatusUpdateRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found."));

        task.setStatus(request.getStatus());
        return TaskResponse.from(taskRepository.save(task));
    }
}
