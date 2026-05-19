package org.example.springbootapi.services;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.Data.Constants.RolesConstants;
import org.example.springbootapi.Entities.RoleEntity;
import org.example.springbootapi.Entities.UserEntity;
import org.example.springbootapi.Models.Users.LoginDto;
import org.example.springbootapi.Models.Users.RegisterDto;
import org.example.springbootapi.repositories.IRoleRepository;
import org.example.springbootapi.repositories.IUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
@RequiredArgsConstructor
public class AccountService {
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SaveUserImageService saveUserImageService;

    public UserEntity register(RegisterDto dto) {

        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        UserEntity user = new UserEntity();

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // IMPORTANT FIX 👇
        if (user.getRoles() == null) {
            user.setRoles(new java.util.HashSet<>());
        }

        RoleEntity roleUser = roleRepository.findByName(RolesConstants.UserRole)
                .orElseThrow(() -> new RuntimeException("User role not found"));

        user.getRoles().add(roleUser);

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                saveUserImageService.saveUserImage(dto.getImage(), dto.getUsername());
                user.setImage(dto.getUsername() + ".jpg");
            } catch (IOException e) {
                throw new RuntimeException("Failed to save user image", e);
            }
        }

        return userRepository.save(user);
    }

    public UserEntity login(LoginDto dto) {

        UserEntity user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }



}