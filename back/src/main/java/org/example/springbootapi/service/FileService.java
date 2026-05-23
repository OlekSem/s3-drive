package org.example.springbootapi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.constant.NodeType;
import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.dto.node.RenameNodeRequestDto;
import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.mapper.NodeMapper;
import org.example.springbootapi.repository.NodeRepository;
import org.example.springbootapi.repository.RoleRepository;
import org.example.springbootapi.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FileService {
    private final NodeRepository nodeRepository;
    private final MinioService minioService;
    private final NodeMapper nodeMapper;
    private final NodeService nodeService;
    private final PermissionService permissionService;

    @Transactional
    public Node upload(MultipartFile file, User user, Long parentId) {

        String storageKey = minioService.uploadFile(file);

        Node parent = null;
        if (parentId != null) {
            parent = nodeRepository.findById(parentId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Parent not found"));
        }

        if(parent!=null){
            if(nodeService.isInTrash(parent)){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Parent folder is deleted"
                );
            }
        }

        boolean nameExists = nodeRepository.existsByParentAndNameAndOwnerAndTrashIsFalse(
                parent,
                file.getOriginalFilename(),
                user
        );

        if (nameExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An item with this name already exists in this folder");
        }

        Node node = Node.builder()
                .storageKey(storageKey)
                .name(file.getOriginalFilename())
                .type(NodeType.FILE)
                .size(file.getSize())
                .mimeType(file.getContentType())
                .owner(user)
                .parent(parent)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return nodeRepository.save(node);
    }



    public ResponseEntity<Void> downloadFile(User user, Long id) {

        Node node = nodeRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
        if (node.getType() == NodeType.FOLDER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot download a folder");
        }

        if (!permissionService.canRead(user, node)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You have insufficient rights to download this file"
            );
        }
        String presignedUrl = minioService.generateDownloadUrl(node.getStorageKey(), node.getName());

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(presignedUrl))
                .build();


    }

}
