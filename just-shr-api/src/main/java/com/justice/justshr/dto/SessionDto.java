package com.justice.justshr.dto;

import com.justice.justshr.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionDto {
    String sessionId;
    String email;
    String description;
    LocalDate created;
    List<UserDto> members;
}
