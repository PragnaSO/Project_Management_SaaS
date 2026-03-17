package com.projectmanagement.controller;

import com.projectmanagement.dto.DashboardResponse;
import com.projectmanagement.dto.ProjectRequest;
import com.projectmanagement.dto.ProjectResponse;
import com.projectmanagement.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(@Valid @RequestBody ProjectRequest request, Authentication authentication) {
        return projectService.createProject(request, authentication);
    }

    @GetMapping
    public List<ProjectResponse> getProjects(Authentication authentication) {
        return projectService.getProjects(authentication);
    }

    @GetMapping("/{projectId}")
    public ProjectResponse getProject(@PathVariable Long projectId) {
        return projectService.getProject(projectId);
    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard(Authentication authentication) {
        return projectService.getDashboard(authentication);
    }
}
