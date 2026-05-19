package org.example.springbootapi.repository;

import org.example.springbootapi.entity.Node;
import org.example.springbootapi.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<Node, Long> {
    List<Node> findAllByUserId(Long id);
}
