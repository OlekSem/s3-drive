package org.example.springbootapi.Entities.files;

import jakarta.persistence.*;
import lombok.*;
import org.example.springbootapi.Entities.UserEntity;
import org.example.springbootapi.types.FileType;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileType type; // FILE or FOLDER

    private Long size;

    private String mimeType;

    // S3 key (only for FILE)
    private String storageKey;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;


    // tree structure
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true) // Nullable because root folders have no parent
    private FileEntity parent;


    @OneToMany(mappedBy = "file", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FilePermissionEntity> permissions;


    //for content
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<FileEntity> children;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}