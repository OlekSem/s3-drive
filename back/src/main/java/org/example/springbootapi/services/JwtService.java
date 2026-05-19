package org.example.springbootapi.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.example.springbootapi.Entities.RoleEntity;
import org.example.springbootapi.Entities.UserEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;

@Service
public class JwtService {

    private final String SECRET = "my-super-secret-key-my-super-secret-key"; // 32+ chars

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(UserEntity user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("username", user.getUsername());
        claims.put("image", user.getImage());

        claims.put(
                "roles",
                user.getRoles()
                        .stream()
                        .map(RoleEntity::getName)
                        .toList()
        );

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getKey())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}