package org.example.springbootapi.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class HomeController {

    @GetMapping("/error-test")
    public ResponseEntity<String> errorTest() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("This is an API error response");
    }
}