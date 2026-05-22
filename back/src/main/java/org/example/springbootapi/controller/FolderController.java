package org.example.springbootapi.controller;

import lombok.RequiredArgsConstructor;
import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.service.FolderService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/folder")
public class FolderController {
    private final FolderService folderService;


    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createFolder(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long parentId
    ) {
        folderService.createFolder(user, parentId);

        return ResponseEntity.ok().build();
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
