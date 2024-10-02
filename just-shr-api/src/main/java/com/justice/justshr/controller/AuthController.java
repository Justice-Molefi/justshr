package com.justice.justshr.controller;


import com.justice.justshr.dto.ApiResponse;
import com.justice.justshr.dto.LoginRequest;
import com.justice.justshr.dto.RegisterRequest;
import com.justice.justshr.dto.Token;
import com.justice.justshr.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest registerRequest){
        authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Registration Successful",HttpStatus.CREATED.value()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response){
        Token token = authService.login(loginRequest);
        if(!token.getJwtToken().isEmpty()){
            Cookie cookie = new Cookie("jwt", token.getJwtToken());
            cookie.setHttpOnly(true);
            cookie.setSecure(false);//for development purposes only
            cookie.setPath("/");
            cookie.setMaxAge(3500);
            response.addCookie(cookie);
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("Login Successful", HttpStatus.OK.value()));
    }

    @GetMapping("/verify-token")
    public ResponseEntity<ApiResponse> verifyToken(@CookieValue(name = "jwt") String jwtToken){
        authService.verifyToken(jwtToken);
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("Token Valid", HttpStatus.OK.value()));
    }

    @GetMapping("/loggedInUser")
    public ResponseEntity<String> getLoggedInUser(){
        String loggedInUser = authService.getLoggedInUser();
        return ResponseEntity.status(HttpStatus.OK).body(loggedInUser);
    }
}
