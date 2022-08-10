package com.example.docker.todo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;


@Service
@Transactional
@RequiredArgsConstructor
public class TodoService implements TodoServiceInterface {

    private final  TodoRepository repository;
    @Override
    public Todo createTodo(Todo todo) {
        return this.repository.save(todo);
    }

    @Override
    public Collection<Todo> getTodos() {
        return this.repository.findAll().stream().toList();
    }

    @Override
    public Todo updateTodo(Todo todo) {
        if(todo.getTitle().length() >0){
            todo.setTitle(todo.getTitle());
        }
        todo.setCompleted(!todo.isCompleted());
        return this
                .repository.save(todo);
    }

    @Override
    public Boolean deleteTodo(Long id) {
        this.getTodo(id);
        this.repository.deleteById(id);
        return true;
    }

    @Override
    public Todo getTodo(Long id) {
        return this.repository.findById(id).orElseThrow(()->
                new CustomException("the todo with that id %d was found.".formatted(id)));
    }
}
