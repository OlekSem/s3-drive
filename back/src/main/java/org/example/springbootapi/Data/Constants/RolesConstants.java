package org.example.springbootapi.Data.Constants;

import java.util.Arrays;
import java.util.List;

public class RolesConstants {

    public static final String AdminRole = "ROLE_ADMIN";
    public static final String UserRole = "ROLE_USER";

    public static final List<String> Roles =
            Arrays.asList(AdminRole, UserRole);
}