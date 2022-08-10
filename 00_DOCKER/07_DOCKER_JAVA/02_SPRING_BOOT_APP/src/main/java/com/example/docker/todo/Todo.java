package com.example.docker.todo;


import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "todos")
@Data
@RequiredArgsConstructor
public class Todo implements Serializable {
    @Id
    @SequenceGenerator(
            name="todo_sequence",
            allocationSize = 1,
            sequenceName = "todo_sequence"
    )
    @GeneratedValue(
            generator = "todo_sequence",
            strategy = GenerationType.SEQUENCE
    )
    private Long id;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(nullable = false, name = "completed", columnDefinition="BOOLEAN default FALSE")
    private boolean completed;
}
