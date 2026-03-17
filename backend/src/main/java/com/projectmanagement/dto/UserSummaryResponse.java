package com.projectmanagement.dto;

import com.projectmanagement.model.User;
import com.projectmanagement.model.UserRole;

public class UserSummaryResponse {

    private Long id;
    private String name;
    private String email;
    private UserRole role;

    public UserSummaryResponse(Long id, String name, String email, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }
}
