package org.example.springbootapi.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.config.MinioProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public String generateDownloadUrl(String storageKey, String originalName) {
        try {
            String contentDisposition = "attachment; filename=\"" + URLEncoder.encode(originalName, StandardCharsets.UTF_8) + "\"";
            // 1. Generate the raw internal URL (points to http://minio-storage:9000)
            String internalUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(properties.getBucket())
                            .object(storageKey)
                            .expiry(2, TimeUnit.MINUTES)
                            .extraQueryParams(Map.of("response-content-disposition", contentDisposition))
                            .build()
            );

            // 2. FIX: Convert the internal Docker routing host string to the public AWS IP address
            // This leaves all S3 access signatures completely untouched and working perfectly.
            System.out.println(internalUrl);
            return internalUrl.replace("http://minio-storage:9000", "http://18.196.181.175:9000");
        } catch (Exception e) {
            throw new RuntimeException("Error generating presigned download URL", e);
        }
    }

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
