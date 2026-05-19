package org.example.springbootapi.controllers;

import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.media.Content;

import io.swagger.v3.oas.annotations.media.Schema;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import io.swagger.v3.oas.annotations.responses.ApiResponse;

import io.swagger.v3.oas.annotations.media.Encoding;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.RequiredArgsConstructor;
import org.example.springbootapi.services.MinioService;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/file")
public class FileController {

    private final MinioService minioService;
    @Operation(

            summary = "Upload file to MinIO",

            requestBody = @RequestBody(

                    required = true,

                    content = @Content(

                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE

                    )

            )

    )

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)


    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file){
        String fileName = minioService.uploadFile(file);
        return ResponseEntity.ok(fileName);
    }
}
