package org.example.springbootapi.Entities.files;


import jakarta.persistence.*;
import lombok.*;
import org.example.springbootapi.Entities.UserEntity;
import org.example.springbootapi.types.PermissionType;

import java.util.UUID;

@Entity
@Table(name = "file_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilePermissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id", nullable = false)
    private FileEntity file;

    // Replaced private UUID userId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionType permission;
}
