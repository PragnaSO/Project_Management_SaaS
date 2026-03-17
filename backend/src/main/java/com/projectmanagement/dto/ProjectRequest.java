package com.projectmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectRequest {

    @NotBlank
    private String projectName;

    private String description;

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
