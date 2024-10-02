package com.justice.justshr.exception.handler;


import com.justice.justshr.dto.ApiResponse;
import com.justice.justshr.exception.UserExistException;
import com.justice.justshr.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleMethodArgumentNotValidException(){
        ApiResponse apiResponse = new ApiResponse("Bad Request", HttpStatus.BAD_REQUEST.value());
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }


    @ExceptionHandler(UserExistException.class)
    public ResponseEntity<ApiResponse> handleUserExistException(){
        ApiResponse apiResponse = new ApiResponse("User Already Exists", HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse> handleBadCredentialsException(){
        ApiResponse apiResponse = new ApiResponse("User Not Found", HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
    }

}
