package org.example.springbootapi.repository;

import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NodeRepository extends JpaRepository<Node, Long> {
    List<Node> findAllByOwnerId(Long id);
    List<Node> findByOwnerIdAndParentIsNull(Long userId);
    boolean existsByParentAndNameAndOwner(Node parent, String name, User user);

    List<Node>  findByOwnerIdAndParentIsNullAndTrashIsFalse(Long userId);

    List<Node> findByTrashTrueAndOwnerId(Long userId);

    List<Node> findByParentIdAndTrashFalseAndOwnerId(
                    Long folderId,
                    Long userId
            );
}
