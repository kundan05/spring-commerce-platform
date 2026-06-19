package com.ecommerce.service;

import com.ecommerce.dto.request.ChangePasswordRequest;
import com.ecommerce.dto.request.UserUpdateRequest;
import com.ecommerce.dto.response.UserResponse;
import com.ecommerce.entity.User;

public interface UserService {
    User getUserByEmail(String email);
    UserResponse getUserProfile(String email);
    UserResponse updateProfile(String email, UserUpdateRequest request);
    void changePassword(String email, ChangePasswordRequest request);
}
