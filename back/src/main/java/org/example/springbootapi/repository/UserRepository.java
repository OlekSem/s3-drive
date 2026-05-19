package org.example.springbootapi.repository;

import org.example.springbootapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByResetPasswordToken(String resetPasswordToken);


    @Query("""

    SELECT u FROM User u

    WHERE u.email = :email

""")

    Optional<User> findByEmailWithLibrary(String email);
}