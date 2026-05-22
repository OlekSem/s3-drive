package org.example.springbootapi.repository;

import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NodeRepository extends JpaRepository<Node, Long> {
    List<Node> findAllByUserId(Long id);
    List<Node> findByUserIdAndParentIsNull(Long userId);
    boolean existsByParentAndNameAndUser(Node parent, String name, User user);
}
