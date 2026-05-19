package org.example.springbootapi.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.config.MinioProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {
    private final MinioClient minioClient;

    private final MinioProperties properties;

    public String uploadFile(MultipartFile file) {

        try {

            String fileName = generateFileName(file.getOriginalFilename());

            InputStream inputStream = file.getInputStream();

            minioClient.putObject(

                    PutObjectArgs.builder()

                            .bucket(properties.getBucket())

                            .object(fileName)

                            .stream(inputStream, file.getSize(), -1)

                            .contentType(file.getContentType())

                            .build()

            );

            return fileName;

        } catch (Exception e) {

            throw new RuntimeException("Error uploading file to MinIO", e);

        }

    }

    public String getFileUrl(String fileName) {

        return properties.getEndpoint() + "/" + properties.getBucket() + "/" + fileName;

    }

    public void deleteFile(String fileName) {

        try {

            minioClient.removeObject(

                    io.minio.RemoveObjectArgs.builder()

                            .bucket(properties.getBucket())

                            .object(fileName)

                            .build()

            );

        } catch (Exception e) {

            throw new RuntimeException("Error deleting file from MinIO", e);

        }

    }

    private String generateFileName(String originalName) {

        return UUID.randomUUID() + "_" + originalName;

    }
}
