package com.ecommerce.service;

import com.ecommerce.dto.request.LoginRequest;
import com.ecommerce.dto.request.RefreshTokenRequest;
import com.ecommerce.dto.request.RegisterRequest;
import com.ecommerce.dto.response.JwtResponse;
import com.ecommerce.entity.RefreshToken;
import com.ecommerce.entity.User;
import com.ecommerce.enums.UserRole;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtService.generateAccessToken(authentication);
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();

        RefreshToken refreshToken = jwtService.generateRefreshToken(user);

        return new JwtResponse(token, user.getId(), user.getEmail(), user.getRole().name(), refreshToken.getToken());
    }

    @Transactional
    public String register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already taken!");
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(UserRole.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(savedUser);
        } catch (Exception e) {
            log.error("Failed to send welcome email", e);
        }

        return "User registered successfully!";
    }

    @Transactional
    public JwtResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = jwtService.verifyRefreshToken(request.getRefreshToken());

        jwtService.revokeRefreshToken(refreshToken);

        User user = refreshToken.getUser();
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, user.getRole().getAuthorities());

        String newToken = jwtService.generateAccessToken(authentication);
        RefreshToken newRefreshToken = jwtService.generateRefreshToken(user);

        return new JwtResponse(newToken, user.getId(), user.getEmail(), user.getRole().name(), newRefreshToken.getToken());
    }

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
}
