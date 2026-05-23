package org.example.springbootapi.controller;

import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.media.Content;

import org.example.springbootapi.dto.FileUploadResponseDto;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import org.example.springbootapi.dto.node.RenameNodeRequestDto;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.service.FileService;
import org.example.springbootapi.service.MinioService;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class FileController {

    private final MinioService minioService;
    private final FileService fileService;
    @Operation(
            summary = "Upload file to MinIO",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE
                    )
            )
    )


    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<FileUploadResponseDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long parentId)
    {
        Node node = fileService.upload(file, user, parentId);

        // Returns structured JSON: {"name": "...", "storageKey": "...", "id": ...}
        FileUploadResponseDto response = new FileUploadResponseDto(
                node.getName(),
                node.getStorageKey(),
                node.getId()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> getResource(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return fileService.downloadFile(user, id);
    }



}
