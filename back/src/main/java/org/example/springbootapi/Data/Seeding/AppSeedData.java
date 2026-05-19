package org.example.springbootapi.Data.Seeding;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.Data.Constants.RolesConstants;
import org.example.springbootapi.Entities.RoleEntity;
import org.example.springbootapi.Entities.UserEntity;
import org.example.springbootapi.repositories.IRoleRepository;
import org.example.springbootapi.repositories.IUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class AppSeedData {
    private final IRoleRepository roleRepository;
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //Цей метод буде Seed даних у БД
    //Цей метод в java Spring буде зпускати автоматично
    @PostConstruct
    public void seed() {
        System.out.println("---------Run seed data-----------");

        try {
            seedRoles();
            seedUsers();
        } catch (Exception e) {
            System.out.println("Error during final stage of seeding");
        }

    }

    private void seedRoles() {
        List<String> roles = RolesConstants.Roles;

        for (String roleName : roles) {
            boolean exists = roleRepository.findByName(roleName).isPresent();
            if (!exists) {
                RoleEntity role = new RoleEntity();
                role.setName(roleName);
                roleRepository.save(role);
                System.out.println("Додано роль: " + roleName);
            } else {
                System.out.println("Роль уже існує: " + roleName);
            }
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            RoleEntity role = roleRepository.findByName(RolesConstants.AdminRole).orElseThrow();
            UserEntity user = new UserEntity();
            user.setUsername("admin@gmail.com");
            user.setEmail("admin@gmail.com");
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRoles(Set.of(role));
            userRepository.save(user);
            System.out.println("User was created");
        }
        else {
            System.out.println("Users are already in the db");
        }
    }
}