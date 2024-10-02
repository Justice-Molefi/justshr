package com.justice.justshr.dto;


import lombok.Data;
import org.springframework.http.HttpStatusCode;

@Data
public class ApiResponse {
    private String message;
    private int status;

    public ApiResponse(String message, int status){
        this.message = message;
        this.status = status;
    }


}
