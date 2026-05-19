package org.example.springbootapi.seed;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.example.springbootapi.constant.RoleConstants;
import org.example.springbootapi.entity.Role;
import org.example.springbootapi.entity.User;
import org.example.springbootapi.repository.RoleRepository;
import org.example.springbootapi.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class AppSeedData {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
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
        List<String> roles = RoleConstants.Roles;

        for (String roleName : roles) {
            boolean exists = roleRepository.findByName(roleName).isPresent();
            if (!exists) {
                Role role = new Role();
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
            Role role = roleRepository.findByName(RoleConstants.AdminRole).orElseThrow();
            User user = new User();
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