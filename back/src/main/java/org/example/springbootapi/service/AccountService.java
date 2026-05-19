package org.example.springbootapi.service;


import lombok.RequiredArgsConstructor;
import org.example.springbootapi.constant.RoleConstants;
import org.example.springbootapi.entity.Role;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.dto.user.LoginDto;
import org.example.springbootapi.dto.user.RegisterDto;
import org.example.springbootapi.repository.RoleRepository;
import org.example.springbootapi.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SaveUserImageService saveUserImageService;

    public User register(RegisterDto dto) {

        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // IMPORTANT FIX 👇
        if (user.getRoles() == null) {
            user.setRoles(new java.util.HashSet<>());
        }

        Role roleUser = roleRepository.findByName(RoleConstants.UserRole)
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

    public User login(LoginDto dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }



}