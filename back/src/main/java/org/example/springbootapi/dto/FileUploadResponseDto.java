package org.example.springbootapi.dto;

public record FileUploadResponseDto(
        String name,
        String storageKey,
        Long id
) {}