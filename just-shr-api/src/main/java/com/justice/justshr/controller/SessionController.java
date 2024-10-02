package com.justice.justshr.controller;

import com.justice.justshr.dto.*;
import com.justice.justshr.model.User;
import com.justice.justshr.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/session")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class SessionController {
    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> save(@RequestBody SessionRequest sessionRequest){
        sessionService.save(sessionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Session Created successfully", HttpStatus.CREATED.value()));
    }

    @GetMapping
    public ResponseEntity<List<SessionDto>> getUserSession(){
        List<SessionDto> sessions = sessionService.getUserSessions();
        return ResponseEntity.status(HttpStatus.OK).body(sessions);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> getUsers(@RequestParam String searchQuery){
        List<UserDto> users = sessionService.getUsers(searchQuery);
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionDto> getSession(@PathVariable String id){
        SessionDto sessionDto = sessionService.getSession(id);
        return ResponseEntity.status(HttpStatus.OK).body(sessionDto);
    }

    @PostMapping("/addMember")
    public ResponseEntity<ApiResponse> addMember(@RequestBody AddMemberRequest addMemberRequest){
        sessionService.addMember(addMemberRequest.getEmail(), addMemberRequest.getSessionId());
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("Member Added Successfully", HttpStatus.CREATED.value()));
    }
}
