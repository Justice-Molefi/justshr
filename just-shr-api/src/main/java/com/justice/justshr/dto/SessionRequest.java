package com.justice.justshr.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;

import java.util.List;

public record SessionRequest(
        @Min(value = 10, message = "min length is 10")
        String description,
        List<String> members
) {
}
