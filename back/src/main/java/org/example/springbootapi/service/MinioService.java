package org.example.springbootapi.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.config.MinioProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value; // Import this

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final MinioProperties properties;

    // Inject your new public endpoint from docker-compose
    @Value("${MINIO_PUBLIC_ENDPOINT:http://18.196.181.175:9000}")
    private String publicEndpoint;

    public String generateDownloadUrl(String storageKey, String originalName) {
        try {
            String contentDisposition = "attachment; filename=\"" + URLEncoder.encode(originalName, StandardCharsets.UTF_8) + "\"";

            // Re-build a temporary client initialized with the public endpoint
            // so the generated cryptographic signature naturally expects the public IP!
            MinioClient signingClient = MinioClient.builder()
                    .endpoint(publicEndpoint)
                    .credentials(properties.getAccessKey(), properties.getSecretKey())
                    .build();

            return signingClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(properties.getBucket())
                            .object(storageKey)
                            .expiry(2, TimeUnit.MINUTES)
                            .extraQueryParams(Map.of("response-content-disposition", contentDisposition))
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error generating presigned download URL", e);
        }
    }

    public String uploadFile(MultipartFile file) {
        try {
            String fileName = generateFileName(file.getOriginalFilename());
            InputStream inputStream = file.getInputStream();
            // Uploads still use the internal fast "minioClient" (http://minio-storage:9000)
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
        return publicEndpoint + "/" + properties.getBucket() + "/" + fileName;
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
