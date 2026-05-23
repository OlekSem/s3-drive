package org.example.springbootapi.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.constant.NodeType;
import org.example.springbootapi.constant.RoleConstants;
import org.example.springbootapi.dto.node.NodeResponseDto;
import org.example.springbootapi.dto.node.RenameNodeRequestDto;
import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.PermissionNode;
import org.example.springbootapi.entity.Role;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.dto.user.LoginDto;
import org.example.springbootapi.dto.user.RegisterDto;
import org.example.springbootapi.mapper.NodeMapper;
import org.example.springbootapi.repository.NodeRepository;
import org.example.springbootapi.repository.RoleRepository;
import org.example.springbootapi.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class NodeService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final NodeRepository nodeRepository;
    private final MinioService minioService;
    private final NodeMapper nodeMapper;
    private final PermissionService permissionService;

    @Transactional
    public NodeResponseDto renameNode(User user, Long nodeId, RenameNodeRequestDto requestDto){
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        if (!permissionService.canRead(user, node)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You don't have enough rights to rename this item"
            );
        }

        // 3. Optional: Validate name uniqueness within the same parent folder
        boolean nameExists = nodeRepository.existsByParentAndNameAndOwnerAndTrashIsFalse(
                node.getParent(),
                requestDto.getNewName(),
                user
        );

        if(nameExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An item with this name already exists in this folder");
        }

        node.setName(requestDto.getNewName());
        Node updatedNode = nodeRepository.save(node);
        return nodeMapper.toDto(updatedNode);
    }

    @Transactional
    public void softDelete(Long nodeId, User user){
        Node node = nodeRepository.findById(nodeId)
            .orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Node not found")
            );

        if (!permissionService.canDelete(user, node)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to delete this node"
            );
        }

        if(isInTrash(node)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Item is already in the bin"
            );
        }


        Node parent = node.getParent();
        if (parent != null) {
            if (parent.getChildren() != null) {
                parent.getChildren().removeIf(child -> child.getId().equals(node.getId()));
            }
            node.setParent(null);
        }


        node.setTrash(true);

        nodeRepository.save(node);

    }

    @Transactional
    public List<NodeResponseDto> getInTrash(Long folderId, User user){
        if (folderId == null) {
            List<Node> nodes = nodeRepository.findByTrashTrueAndOwnerId(user.getId());
            return nodeMapper.toDtoList(nodes);
        }

        Node folder = nodeRepository.findById(folderId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found")
                );

        if (folder.getType() != NodeType.FOLDER)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not a folder");

        if (!permissionService.canRead(user, folder)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to access this folder"
            );
        }


        List<Node> children = nodeRepository
                .findByParentIdAndTrashFalseAndOwnerId(
                        folderId,
                        user.getId()
                );
        if (children == null) {
            return List.of();
        }
        return children == null ? List.of() : nodeMapper.toDtoList(children);
    }


    private void deleteNodeRecursive(Node node) {
        if (node.getType() == NodeType.FOLDER && node.getChildren() != null) {
            List<Node> children = List.copyOf(node.getChildren());
            for (Node child : children) {
                System.out.println(child.getName() + " is deleted");
                if (child.isTrash()) continue;
                deleteNodeRecursive(child);
            }
        }

        if (node.getType() == NodeType.FILE && node.getStorageKey() != null) {
            try {
                minioService.deleteFile(node.getStorageKey());
            } catch (Exception e) {
                System.err.println("Failed to delete object from MinIO: " + node.getStorageKey());
            }
        }

        nodeRepository.delete(node);
    }


    @Transactional
    public void permanentDelete(Long nodeId, User user) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Node not found"));

        if (!permissionService.canDelete(user, node)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the owner can permanently delete items"
            );
        }

        //check if is in Trash
        if(!isInTrash(node)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Item must be moved to the trash before permanent deletion"
            );
        }

        deleteNodeRecursive(node);
    }

    public void restoreNode(Long id) {
        var node = nodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Node not found: " + id));
        if(node.isTrash()){
            node.setTrash(false);
        }else{
            if(isInTrash(node)){
                node.setParent(null);
            }
        }
        nodeRepository.save(node);
    }

    public boolean isInTrash(Node node) {
        if (node.isTrash()) return true;
        Node parent = node.getParent();
        if (parent == null) return false;
        return isInTrash(parent);
    }


}
