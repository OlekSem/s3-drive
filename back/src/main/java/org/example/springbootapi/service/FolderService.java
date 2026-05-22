package org.example.springbootapi.service;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.constant.NodeType;
import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.Permission;
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
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final NodeRepository nodeRepository;
    private final NodeMapper nodeMapper;
    private final String defaultName = "untitled folder";

    @Transactional
    public Node createFolder(User user, Long parentId) {

        Node parent = null;
        if (parentId != null) {
            parent = nodeRepository.findById(parentId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Parent not found"));
        }
        boolean nameExists = nodeRepository.existsByParentAndNameAndUser(
                parent,
                defaultName,
                user
        );

        if(nameExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An item with this name already exists in this folder");
        }

        Node folder = Node.builder()
                .name(defaultName)
                .type(NodeType.FOLDER)
                .user(user)
                .parent(parent)
                .isInTrash(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return nodeRepository.save(folder);
    }

    @Transactional
    public List<NodeResponseDto> view(Long folderId, User user) {
        if (folderId == null) {
            List<Node> nodes = nodeRepository.findByUserIdAndParentIsNull(user.getId());
            return nodeMapper.toDtoList(nodes);
        }
        Node folder = nodeRepository.findById(folderId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.FORBIDDEN, "Folder not found")
                );

        if (folder.getType() != NodeType.FOLDER)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a folder");

        List<Node> children = folder.getChildren();
        if (children == null) {
            return List.of();
        }
        return nodeMapper.toDtoList(children);
    }
}
