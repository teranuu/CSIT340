package com.corethreads.corethreads.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}) // ✅ FIXED: Restricted CORS
public class ImageController {

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        // ✅ SECURITY FIX: Validate filename to prevent directory traversal (CWE-22)
        if (filename == null || filename.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Remove path traversal attempts
        filename = filename.replace("..", "").replace("/", "").replace("\\", "");
        
        // Only allow safe filename characters
        if (!filename.matches("^[a-zA-Z0-9._-]+$")) {
            return ResponseEntity.badRequest().build();
        }
        
        // Serve files from classpath static/images
        Resource resource = new ClassPathResource("static/images/" + filename);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = filename.toLowerCase().endsWith(".png") ? MediaType.IMAGE_PNG_VALUE
                : filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg") ? MediaType.IMAGE_JPEG_VALUE
                : filename.toLowerCase().endsWith(".gif") ? MediaType.IMAGE_GIF_VALUE
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename)
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}