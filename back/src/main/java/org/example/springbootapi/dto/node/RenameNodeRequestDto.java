package org.example.springbootapi.dto.node;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RenameNodeRequestDto {
    @NotBlank(message = "name must be not blank")
    private String newName;
}
