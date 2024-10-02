package com.justice.justshr.exception;

public class UserExistException extends RuntimeException{
    public UserExistException(String message){
        super(message);
    }

    public UserExistException(String message, Throwable throwable){}
}
