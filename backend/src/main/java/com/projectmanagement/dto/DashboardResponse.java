package com.projectmanagement.dto;

import java.util.List;

public class DashboardResponse {

    private long totalProjects;
    private long completedTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private double completionRate;
    private List<ProjectResponse> projects;

    public DashboardResponse(long totalProjects, long completedTasks, long pendingTasks, long inProgressTasks, double completionRate, List<ProjectResponse> projects) {
        this.totalProjects = totalProjects;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.completionRate = completionRate;
        this.projects = projects;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public List<ProjectResponse> getProjects() {
        return projects;
    }
}
