package com.projectmanagement.dto;

import com.projectmanagement.model.Task;
import com.projectmanagement.model.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {

    private Long id;
    private String taskName;
    private String description;
    private TaskStatus status;
    private LocalDate deadline;
    private LocalDateTime createdAt;
    private Long projectId;
    private UserSummaryResponse assignedTo;

    public static TaskResponse from(Task task) {
        TaskResponse response = new TaskResponse();
        response.id = task.getId();
        response.taskName = task.getTaskName();
        response.description = task.getDescription();
        response.status = task.getStatus();
        response.deadline = task.getDeadline();
        response.createdAt = task.getCreatedAt();
        response.projectId = task.getProject().getId();
        if (task.getAssignedTo() != null) {
            response.assignedTo = UserSummaryResponse.from(task.getAssignedTo());
        }
        return response;
    }

    public Long getId() {
        return id;
    }

    public String getTaskName() {
        return taskName;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getProjectId() {
        return projectId;
    }

    public UserSummaryResponse getAssignedTo() {
        return assignedTo;
    }
}
