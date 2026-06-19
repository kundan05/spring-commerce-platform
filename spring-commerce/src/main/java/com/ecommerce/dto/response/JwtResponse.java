package com.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String role;
    private String refreshToken;

    public JwtResponse(String token, Long id, String email, String role, String refreshToken) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.refreshToken = refreshToken;
    }
}
