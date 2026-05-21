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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final NodeRepository nodeRepository;
    private final MinioService minioService;
    private final NodeMapper nodeMapper;
    private final NodeService nodeService;

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



}
