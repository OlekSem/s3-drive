package org.example.springbootapi.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    private final MinioProperties props;

    public MinioConfig(MinioProperties props) {
        this.props = props;
    }

    @Bean
    public MinioClient minioClient() {
        MinioClient client = MinioClient.builder()
                .endpoint(props.getEndpoint())
                .credentials(props.getAccessKey(), props.getSecretKey())
                .build();

        try {
            String bucketName = props.getBucket() != null ? props.getBucket() : "s3drive";

            boolean exists = client.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );

            if (!exists) {
                System.out.println("MinIO bucket '" + bucketName + "' not found. Creating it automatically...");
                client.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                );
                System.out.println("MinIO bucket '" + bucketName + "' successfully initialized!");
            }
        } catch (Exception e) {
            System.err.println("Warning: Failed to auto-initialize MinIO bucket: " + e.getMessage());
        }

        return client;
    }
}