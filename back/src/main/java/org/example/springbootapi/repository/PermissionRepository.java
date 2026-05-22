package org.example.springbootapi.repository;


import org.example.springbootapi.entity.PermissionNode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PermissionRepository extends JpaRepository<PermissionNode, Long> {

    Optional<PermissionNode> findByNodeIdAndUserId(Long NodeId, Long UserId);
}
