package org.example.springbootapi.services;

import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
@Service
@RequiredArgsConstructor
public class SaveUserImageService {
    public void saveUserImage(MultipartFile file, String username) throws IOException {
        // базова директорія
        Path baseDir = Paths.get("uploads");
        Files.createDirectories(baseDir);

        // оригінал
        Path originalDir = baseDir.resolve("original");
        Files.createDirectories(originalDir);
        Path originalPath = originalDir.resolve(username + ".jpg");
        file.transferTo(originalPath);

        // маленький (100x100)
        Path smallDir = baseDir.resolve("small");
        Files.createDirectories(smallDir);
        Path smallPath = smallDir.resolve(username + ".jpg");
        Thumbnails.of(originalPath.toFile())
                .size(100, 100)
                .toFile(smallPath.toFile());

        // середній (300x300)
        Path mediumDir = baseDir.resolve("medium");
        Files.createDirectories(mediumDir);
        Path mediumPath = mediumDir.resolve(username + ".jpg");
        Thumbnails.of(originalPath.toFile())
                .size(300, 300)
                .toFile(mediumPath.toFile());
    }
}