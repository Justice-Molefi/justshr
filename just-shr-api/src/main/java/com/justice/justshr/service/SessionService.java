package com.justice.justshr.service;

import com.justice.justshr.dto.SessionDto;
import com.justice.justshr.dto.SessionRequest;
import com.justice.justshr.dto.UserDto;
import com.justice.justshr.exception.UserExistException;
import com.justice.justshr.model.Session;
import com.justice.justshr.model.User;
import com.justice.justshr.repository.SessionRepository;
import com.justice.justshr.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.util.*;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionService(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    public void save(@Valid SessionRequest sessionRequest){
        List<User> members = new ArrayList<>();

        sessionRequest.members().forEach( email -> {
            Optional<User> user = userRepository.findByEmail(email);
            user.ifPresent(members::add);
        });

        Optional<User> sessionOwner = userRepository.findByEmail(authenticatedUser());
        sessionOwner.ifPresent(members::add);


        Session newSession = Session.builder()
                .uuid(UUID.randomUUID())
                .description(sessionRequest.description())
                .email(authenticatedUser())
                .created(LocalDate.now())
                .members(members)
                .build();

        sessionRepository.save(newSession);
    }

    public void addMember(String email, String sessionId){
        List<User> members;
        Session session;

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            Optional<Session> sessionOptional = sessionRepository.findById(UUID.fromString(sessionId));
            if(sessionOptional.isPresent()){
                session = sessionOptional.get();
                members = session.getMembers();
                if(!members.contains(optionalUser.get()))
                    members.add(optionalUser.get());
                else
                    throw new UserExistException("User Already a member");
                session.setMembers(members);
                sessionRepository.save(session);
            }
        }else{
            throw new UsernameNotFoundException("User with email " + email + " not found");
        }
    }

    public List<SessionDto> getUserSessions(){
        Optional<User> loggedInUser = userRepository.findByEmail(authenticatedUser());
        List<SessionDto> sessionDtos = new ArrayList<>();
        loggedInUser.ifPresent(user -> sessionRepository.findSessionsByUserId(user.getUuid()).forEach(session -> {
            SessionDto sessionDto = SessionDto.builder()
                    .sessionId(session.getUuid().toString())
                    .email(session.getEmail())
                    .description(session.getDescription())
                    .created(session.getCreated())
                    .build();
            sessionDtos.add(sessionDto);
        }));

        return sessionDtos;
    }

    public SessionDto getSession(String id){
        User loggedInUser;
        UUID sessionId = UUID.fromString(id);
        boolean isMemberOfSession = false;
        List<UserDto> members = new ArrayList<>();
        SessionDto sessionDto;
        Optional<User> user = userRepository.findByEmail(authenticatedUser());

        if(user.isPresent()){
            loggedInUser = user.get();
            isMemberOfSession = sessionRepository.userExistsInSession(sessionId, loggedInUser.getUuid());
        }

        if(isMemberOfSession){
            Optional<Session> optSession = sessionRepository.findById(sessionId);
            if(optSession.isPresent()){
                sessionRepository.findAllMembersBySessionId(sessionId).forEach(member -> {
                    UserDto userDto = UserDto.builder()
                            .username(member.getAppUsername())
                            .email(member.getUsername())
                            .build();
                    members.add(userDto);
                });
                Session session = optSession.get();
                return sessionDto = SessionDto.builder()
                        .sessionId(session.getUuid().toString())
                        .email(session.getEmail())
                        .description(session.getDescription())
                        .created(session.getCreated())
                        .members(members)
                        .build();
            }
        }
        return null;
    }


    public List<UserDto> getUsers(String searchQuery){
        List<UserDto> users = new ArrayList<>();
        userRepository.findByEmailContaining(searchQuery).forEach(user -> {
            UserDto userDto = UserDto.builder()
                    .email(user.getEmail())
                    .username(user.getAppUsername())
                    .build();
            users.add(userDto);
        });

        return users;
    }

    public String authenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }


}
