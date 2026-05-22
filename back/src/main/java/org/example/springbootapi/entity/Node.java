package org.example.springbootapi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.springbootapi.constant.NodeType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Node {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NodeType type; // FILE or FOLDER

    private Long size;

    private String mimeType;

    // S3 key (only for FILE)
    private String storageKey;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;


    // tree structure
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Node parent;


    @OneToMany(mappedBy = "node", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PermissionNode> permissions = new ArrayList<>();


    private boolean trash;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "original_parent_id")
//    private Node originalParent;



    //for content
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Node> children;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}