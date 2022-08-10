package com.example.docker.todo;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
public class TodoController {
    private final TodoService service;

    @GetMapping(path = "/all")
    public ResponseEntity<Response> getTodo(){
        Collection<Todo> todos = service.getTodos();
        return ResponseEntity.ok(
                Response.builder()
                .todo(Map.of("todos", todos))
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .error(null)
                .timeStamp(LocalDateTime.now()).build()
        );
    }

    @PostMapping(path = "/create")
    public ResponseEntity<Response> createTodo(@RequestBody Todo todo){
        return ResponseEntity.ok(
                Response.builder()
                        .todo(Map.of("todo", this.service.createTodo(todo)))
                        .error(null)
                        .timeStamp(LocalDateTime.now())
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .build()
        );
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<Response> deleteTodo(@PathVariable("id") Long id) {
        boolean todoFound = true;
        ResponseError error = new ResponseError("the todo of that id does not exists", "id");
        try {
            this.service.getTodo(id);
        }catch (CustomException e){
            todoFound = false;
        }
        return ResponseEntity.ok(
                Response.builder()
                        .todo(Map.of("todo", this.service.deleteTodo(id)))
                        .error(todoFound? null : error)
                        .timeStamp(LocalDateTime.now())
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


    @GetMapping(path = "/get/{id}")
    public ResponseEntity<Response> getTodo(@PathVariable("id") Long id) {
        boolean todoFound = true;
        ResponseError error = new ResponseError("the todo of that id does not exists", "id");
        try {
            this.service.getTodo(id);
        }catch (CustomException e){
            todoFound = false;
        }
        return ResponseEntity.ok(
                Response.builder()
                        .todo(Map.of("todo", this.service.getTodo(id)))
                        .error(todoFound? null : error)
                        .timeStamp(LocalDateTime.now())
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<Response> updateTodo(@PathVariable("id") Long id, @RequestBody Todo todo) {
        boolean todoFound = true;
        ResponseError error = new ResponseError("the todo of that id does not exists", "id");
        try {
            this.service.getTodo(id);
        }catch (CustomException e){
            todoFound = false;
        }
        return ResponseEntity.ok(
                Response.builder()
                        .todo(Map.of("todo", this.service.updateTodo(todo)))
                        .error(todoFound? null : error)
                        .timeStamp(LocalDateTime.now())
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }
}
