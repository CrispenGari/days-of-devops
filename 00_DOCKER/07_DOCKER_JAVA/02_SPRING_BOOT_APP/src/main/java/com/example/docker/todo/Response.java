package com.example.docker.todo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
    protected LocalDateTime timeStamp;
    protected int statusCode;
    protected HttpStatus status;
    protected Map<?, ?> todo;
    protected ResponseError error;
}

@Data
class ResponseError{
    private String field;
    private String message;
    public ResponseError(String message, String field){
        this.field = field;
        this.message = message;
    }
}