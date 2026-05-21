package org.example.springbootapi.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.constant.NodeType;
import org.example.springbootapi.dto.node.NodeResponseDto;
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
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final NodeRepository nodeRepository;
    private final MinioService minioService;
    private final NodeMapper nodeMapper;

    @Transactional
    public Node upload(MultipartFile file, User user, Long parentId) {

        String storageKey = minioService.uploadFile(file);

        Node parent = null;
        if (parentId != null) {
            parent = nodeRepository.findById(parentId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Parent not found"));
        }

        Node node = Node.builder()
                .storageKey(storageKey)
                .name(file.getOriginalFilename())
                .type(NodeType.FILE)
                .size(file.getSize())
                .mimeType(file.getContentType())
                .user(user)
                .parent(parent)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return nodeRepository.save(node);
    }


    @Transactional
    public List<NodeResponseDto> getAll(User user) {
        return nodeMapper.toDtoList(nodeRepository.findAllByUserId(user.getId()));
    }

    public ResponseEntity<Void> downloadFile(User user, Long id) {

        Node node = nodeRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
        if (node.getType() == NodeType.FOLDER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot download a folder");
        }
        if (!Objects.equals(node.getUser().getId(), user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the owner of this file");
        }
        String presignedUrl = minioService.generateDownloadUrl(node.getStorageKey(), node.getName());

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(presignedUrl))
                .build();


    }
}
