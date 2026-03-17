package com.projectmanagement.dto;

import com.projectmanagement.model.Project;
import com.projectmanagement.model.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {

    private Long id;
    private String projectName;
    private String description;
    private LocalDateTime createdAt;
    private UserSummaryResponse createdBy;
    private double progress;
    private List<TaskResponse> tasks;

    public static ProjectResponse from(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.id = project.getId();
        response.projectName = project.getProjectName();
        response.description = project.getDescription();
        response.createdAt = project.getCreatedAt();
        response.createdBy = UserSummaryResponse.from(project.getCreatedBy());
        response.tasks = project.getTasks().stream().map(TaskResponse::from).toList();
        long completed = project.getTasks().stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();
        response.progress = project.getTasks().isEmpty()
                ? 0
                : (completed * 100.0) / project.getTasks().size();
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public UserSummaryResponse getCreatedBy() {
        return createdBy;
    }

    public double getProgress() {
        return progress;
    }

    public List<TaskResponse> getTasks() {
        return tasks;
    }
}
