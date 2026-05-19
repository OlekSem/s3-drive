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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final NodeRepository fileRepository;
    private final MinioService minioService;
    private final NodeMapper nodeMapper;

    @Transactional

    public Node upload(MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String storageKey = minioService.uploadFile(file);

        Node node = Node.builder()
                .storageKey(storageKey)
                .name(file.getOriginalFilename())
                .type(NodeType.FILE)
                .size(file.getSize())
                .mimeType(file.getContentType())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return fileRepository.save(node);
    }


    @Transactional
    public List<NodeResponseDto> getAll(Long userId){
        return nodeMapper.toDtoList(fileRepository.findAllByUserId(userId));
    }
}
