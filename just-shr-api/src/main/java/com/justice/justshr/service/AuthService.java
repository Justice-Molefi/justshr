package com.justice.justshr.service;


import com.justice.justshr.constant.Role;
import com.justice.justshr.dto.LoginRequest;
import com.justice.justshr.dto.RegisterRequest;
import com.justice.justshr.dto.Token;
import com.justice.justshr.exception.UserExistException;
import com.justice.justshr.model.User;
import com.justice.justshr.repository.UserRepository;
import com.justice.justshr.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final JwtDecoder decoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil, JwtDecoder decoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.decoder = decoder;
    }

    public void register(@Valid RegisterRequest registerRequest){
        Optional<User> existingUser = userRepository.findByEmail(registerRequest.email());


        if(existingUser.isPresent()){
            throw new UserExistException("User Exist");
        }

        Set<Role> roles = new HashSet<>();
        roles.add(Role.MEMBER);

        User user = User.builder()
                .uuid(UUID.randomUUID())
                .username(registerRequest.username())
                .email(registerRequest.email())
                .password(bCryptPasswordEncoder.encode(registerRequest.password()))
                .roles(roles)
                .build();

        userRepository.save(user);
    }

    public Token login(@Valid LoginRequest loginRequest ){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
        if(authentication.isAuthenticated()){
            return Token.builder()
                   .jwtToken(jwtUtil.generateToken(authentication))
                   .build();

        }

        return Token.builder().jwtToken("").build();

    }

    public void verifyToken(String jwtToken){
        decoder.decode(jwtToken);
    }
    public String getLoggedInUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.isAuthenticated()){
            return authentication.getName();
        }
        return null;
    }


}
