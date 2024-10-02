package com.justice.justshr.repository;

import com.justice.justshr.model.Session;
import com.justice.justshr.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {
    @Query("SELECT s FROM Session s JOIN s.members m WHERE m.uuid = :userId")
    List<Session> findSessionsByUserId(@Param("userId") UUID userId);

    @Query("SELECT CASE WHEN EXISTS (SELECT 1 FROM Session s JOIN s.members m WHERE s.uuid = :sessionId AND m.uuid = :userId) THEN true ELSE false END")
    boolean userExistsInSession(@Param("sessionId") UUID sessionId, @Param("userId") UUID userId);

    @Query("SELECT s.members FROM Session s WHERE s.uuid = :sessionId")
    List<User> findAllMembersBySessionId(@Param("sessionId") UUID sessionId);
}
