package org.example.springbootapi.repositories;

import org.example.springbootapi.Entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByUsername(String username);
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByResetPasswordToken(String resetPasswordToken);


    @Query("""

    SELECT u FROM UserEntity u

    WHERE u.email = :email

""")

    Optional<UserEntity> findByEmailWithLibrary(String email);
}