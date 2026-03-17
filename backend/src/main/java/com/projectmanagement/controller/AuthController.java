package com.projectmanagement.controller;

import com.projectmanagement.dto.AuthResponse;
import com.projectmanagement.dto.LoginRequest;
import com.projectmanagement.dto.RegisterRequest;
import com.projectmanagement.dto.UserSummaryResponse;
import com.projectmanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.authenticate(request);
    }

    @GetMapping("/me")
    public UserSummaryResponse currentUser(Authentication authentication) {
        return userService.getCurrentUserSummary(authentication);
    }

    @GetMapping("/users")
    public List<UserSummaryResponse> users() {
        return userService.getAllUsers();
    }
}
