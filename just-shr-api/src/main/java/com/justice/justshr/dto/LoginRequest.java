package com.justice.justshr.dto;

import jakarta.validation.constraints.Email;

public record LoginRequest(
        @Email(message = "Email not valid")
        String email,
        String password
) {
}
