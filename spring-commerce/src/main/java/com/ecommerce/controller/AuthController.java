package com.ecommerce.controller;

import com.ecommerce.dto.request.LoginRequest;
import com.ecommerce.dto.request.RegisterRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.JwtResponse;
import com.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(value = {"/login", "/signin"})
    public ResponseEntity<ApiResponse<JwtResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", jwtResponse));
    }

    @PostMapping(value = {"/register", "/signup"})
    public ResponseEntity<ApiResponse<String>> register(@RequestBody @Valid RegisterRequest registerRequest) {
        String response = authService.register(registerRequest);
        return new ResponseEntity<>(new ApiResponse<>(true, response, null), HttpStatus.CREATED);
    }
}
