package org.example.springbootapi.constant;

import java.util.Arrays;
import java.util.List;

public class RoleConstants {

    public static final String AdminRole = "ROLE_ADMIN";
    public static final String UserRole = "ROLE_USER";

    public static final List<String> Roles =
            Arrays.asList(AdminRole, UserRole);
}