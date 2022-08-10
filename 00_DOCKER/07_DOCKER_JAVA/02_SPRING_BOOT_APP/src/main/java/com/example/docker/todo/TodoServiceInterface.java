package com.example.docker.todo;
import java.util.Collection;

public interface TodoServiceInterface {
    Todo createTodo(Todo todo);
    Collection<Todo> getTodos();
    Todo updateTodo(Todo todo);
    Boolean deleteTodo(Long id);
    Todo getTodo(Long id);
}
