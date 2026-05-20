package org.example.springbootapi.controller;

import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.media.Content;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import lombok.RequiredArgsConstructor;
import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.repository.NodeRepository;
import org.example.springbootapi.service.FileService;
import org.example.springbootapi.service.FolderService;
import org.example.springbootapi.service.MinioService;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/folder")
public class FolderController {
    private final MinioService minioService;
    private final FileService fileService;
    private final FolderService folderService;
    private final NodeRepository nodeRepository;


    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createFolder(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long parentId
    ) {
        System.out.println("parent - " + parentId);

        folderService.createFolder(user, parentId);

        return ResponseEntity.ok("ok");
    }

    @GetMapping("/view")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NodeResponseDto>> view(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long folderId
    ) {

        return ResponseEntity.ok(folderService.view(folderId, user));
    }
}
