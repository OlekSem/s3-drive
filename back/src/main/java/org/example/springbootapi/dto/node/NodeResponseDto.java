package org.example.springbootapi.dto.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.springbootapi.constant.NodeType;

import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NodeResponseDto {

    private Long id;
    private String name;
    private NodeType type;
    private Long size;
    private String mimeType;
    private String storageKey;
    private Long userId;
    private Long parentId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}