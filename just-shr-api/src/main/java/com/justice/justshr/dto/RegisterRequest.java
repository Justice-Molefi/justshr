package com.justice.justshr.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "username cannot be empty")
        @Min(value = 3, message = "username must be at least 3 characters")
        @Max(value = 25, message = "username cannot exceed 25 characters")
        String username,
        @Email(message = "Email not valid")
        String email,
        @NotBlank(message = "Password cannot be empty")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!#%*?&_])[A-Za-z\\d@$#!%*?&_]{8,}$", message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        String password
) {
}
