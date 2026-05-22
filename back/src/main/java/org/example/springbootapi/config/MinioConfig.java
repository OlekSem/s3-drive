package org.example.springbootapi.config;

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

        return client;
    }

}
