package org.example.springbootapi.service;

import org.example.springbootapi.constant.PermissionType;
import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.PermissionNode;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.repository.PermissionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PermissionService {
    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public boolean canRead(User user, Node node) {
        return hasPermission(user, node, PermissionType.READ);
    }

    public boolean canWrite(User user, Node node) {
        return hasPermission(user, node, PermissionType.WRITE);
    }

    public boolean canDelete(User user, Node node) {
        return hasPermission(user, node, PermissionType.DELETE);
    }

    public boolean canAdmin(User user, Node node) {
        return canDelete(user, node); // or future ADMIN role
    }

    private boolean hasPermission(User user, Node node, PermissionType required) {
        // 1. Owner override
        if (node.getOwner().getId().equals(user.getId())) {
            return true;
        }
        // 2. Direct permission
        Optional<PermissionNode> direct = permissionRepository
                .findByNodeIdAndUserId(node.getId(), user.getId());
        if (direct.isPresent()) {
            return hasAtLeast(direct.get().getPermission(), required);
        }
        // 3. Inherited permission
        Node parent = node.getParent();
        while (parent != null) {
            Optional<PermissionNode> inherited = permissionRepository
                    .findByNodeIdAndUserId(parent.getId(), user.getId());
            if (inherited.isPresent()) {
                return hasAtLeast(inherited.get().getPermission(), required);
            }
            parent = parent.getParent();
        }
        return false;
    }
    private boolean hasAtLeast(PermissionType actual, PermissionType required) {
        return actual.ordinal() >= required.ordinal();
    }
}