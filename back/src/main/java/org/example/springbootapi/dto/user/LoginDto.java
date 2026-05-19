package org.example.springbootapi.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDto {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}