package org.example.springbootapi.repository;

import org.example.springbootapi.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NodeRepository extends JpaRepository<Node, Long> {
    List<Node> findAllByOwnerId(Long id);
    List<Node> findByOwnerIdAndParentIsNullAndTrashIsFalse(Long ownerId);

    List<Node> findByTrashTrueAndOwnerId(Long ownerId);

    List<Node> findByParentIdAndTrashFalseAndOwnerId(
            Long parentId,
            Long ownerId
    );
}
