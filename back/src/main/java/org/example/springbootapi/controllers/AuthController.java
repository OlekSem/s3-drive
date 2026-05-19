package org.example.springbootapi.controllers;


import org.example.springbootapi.Models.Users.JwtResponse;
import org.example.springbootapi.Models.Users.LoginDto;
import org.example.springbootapi.Models.Users.UserResponseDto;
import org.example.springbootapi.services.JwtService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.Entities.UserEntity;
import org.example.springbootapi.Models.Users.RegisterDto;
import org.example.springbootapi.services.AccountService;
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

            UserEntity user = accountService.register(dto);

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
            UserEntity user = accountService.login(dto);

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new JwtResponse(token));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

}