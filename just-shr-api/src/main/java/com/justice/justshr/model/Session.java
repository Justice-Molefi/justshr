package com.justice.justshr.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Session {
    @Id
    private UUID uuid;
    private String description;
    private String email;
    private LocalDate created;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "session_users", // Name of the join table
            joinColumns = @JoinColumn(name = "session_id"), // Foreign key for Session
            inverseJoinColumns = @JoinColumn(name = "user_id") // Foreign key for User
    )
    private List<User> members;
}
