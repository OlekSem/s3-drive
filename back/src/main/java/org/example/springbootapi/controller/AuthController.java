package org.example.springbootapi.controller;

import org.example.springbootapi.dto.user.JwtResponse;
import org.example.springbootapi.dto.user.LoginDto;
import org.example.springbootapi.dto.user.UserResponseDto;
import org.example.springbootapi.service.JwtService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.dto.user.RegisterDto;
import org.example.springbootapi.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountService accountService;
    private final JwtService jwtService;

    @PostMapping(
            value = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )

    public ResponseEntity<?> register(@ModelAttribute RegisterDto dto) {
        try {
            User user = accountService.register(dto);
            UserResponseDto response = new UserResponseDto();
            response.setId(user.getId());
            response.setUsername(user.getUsername());

            response.setEmail(user.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        try {
            User user = accountService.login(dto);
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}