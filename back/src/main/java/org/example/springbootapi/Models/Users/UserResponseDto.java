package org.example.springbootapi.Models.Users;


import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
}