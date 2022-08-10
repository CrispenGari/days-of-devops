package com.example.docker.todo;

public class CustomException extends RuntimeException{
    public CustomException(String e){
        super(e);
    }
}