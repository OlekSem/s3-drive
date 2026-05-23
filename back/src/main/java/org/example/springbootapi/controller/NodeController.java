package org.example.springbootapi.controller;

import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.media.Content;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.dto.node.RenameNodeRequestDto;
import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.service.FileService;
import org.example.springbootapi.service.MinioService;
import org.example.springbootapi.service.NodeService;
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
@RequestMapping("/api/nodes")
public class NodeController {
    private final MinioService minioService;
    private final FileService fileService;
    private final NodeService nodeService;



    @DeleteMapping("/SoftDelete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> softDelete(
            @AuthenticationPrincipal User user,
            @RequestParam Long nodeId
    ) {
        nodeService.softDelete(nodeId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trash")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NodeResponseDto>> GetInTrash(@AuthenticationPrincipal User user, @RequestParam(required = false) Long folderId){
        System.out.println(user.getUsername());
        return ResponseEntity.ok(nodeService.getInTrash(folderId, user));
    }

    @DeleteMapping("/DeletePermanently")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> DeletePermanently(@AuthenticationPrincipal User user, @RequestParam(required = false) Long folderId){
        nodeService.permanentDelete(folderId, user);
        return ResponseEntity.noContent().build();
    }





    @PatchMapping("/rename/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NodeResponseDto> renameNode(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RenameNodeRequestDto requestDto) {
        NodeResponseDto updatedNode = nodeService.renameNode(user, id, requestDto);
        return ResponseEntity.ok(updatedNode);
    }


}
