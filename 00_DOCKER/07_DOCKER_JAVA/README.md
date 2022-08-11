### Docker and Java

In this one we are going to learn how to dockerize our Java Applications.

### Dockerizing Java Programs

Let's say we have a java program that we want to dockerize for example let's say we have the following file called `Main.java` which looks as follows:

```java
package com.company;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("What is your Name?");
        String name = input.nextLine();
        System.out.printf("Your name is: %s", name);
    }
}
```

> The above program just ask the user to enter their name and print the name that they have entered. After creating our program we can then compile it py running the following command:

```shell
javac Main.java
```

Then a `Main.class` file will be created, so to test our java program we run the following command:

```shell
java Main.java
```

After that we will be able to enter the name as user input and get the results back.

### Creating a Dockerfile.

Now it's time for us to create a `Dockerfile` in the root folder of our project. But before we do that we want to create a `.dockerignore` file and ignore all the code files that were compiled locally. So our `.dockerignore` file will look as follows:

```shell
*.class
```

Then in our docker file we are going to write blueprints to build our docker image of our application. Note that for the base image we are going to use the [openjdk](https://hub.docker.com/_/openjdk).

```Dockerfile

FROM openjdk:17

WORKDIR /app

COPY . .

RUN javac Main.java

CMD ["java", "Main.java"]
```

Now to build an image based on our dockerfile we run the following command:

```shell
docker build -t name:1.0 .
```

Now that we have build our image, we can check if the image exists by running the following command:

```shell
docker images
```

Output in my case:

```shell
REPOSITORY       TAG             IMAGE ID       CREATED          SIZE
name             1.0             8c78506fadbd   28 seconds ago   471MB
flaskapp         1.0             2c8cfeacc4f2   2 days ago       62.9MB
game             1.0             cef46d741792   3 days ago       54.9MB
app_expressapi   latest          c6481dc4cddd   3 days ago       411MB
expressapp       1.0             47f373f7088b   3 days ago       325MB
nodeapp          1.0             6ae0fe0a7438   3 days ago       325MB
mongo            latest          d98599fdfd65   4 days ago       696MB
mysql            5.7             3147495b3a5c   11 days ago      431MB
mysql            8.0             38643ad93215   11 days ago      446MB
postgres         14.4-alpine     41cd24e8c51b   2 weeks ago      216MB
redis            5.0.14-alpine   2bfeb9a4412a   2 weeks ago      23MB
mongo-express    latest          2d2fb2cabc8f   9 months ago     136MB
```

Now we can run our container. Since our image allow users to enter input we are going to use the `-it` flag to run it as follows:

```shell
docker run -it name:1.0
```

Output:

```shell
What is your Name?
crispen
Your name is: crispen
```

We are done creating docker images based on java programs.

### Dockerize Spring boot Apps

In this section we are going to create a simple spring boot rest application and run it in a container. First we are going to run a postgres database instance in a container and connect to our springboot application which will be running on our local machine.

To get started we are going to go to the [start.spring.io](https://start.spring.io/) and create a new spring boot application. We are going to add the following dependencies in our springboot application:

1. Lombok
2. Spring Web
3. Spring Data JPA
4. PostgreSQL Driver

To get the same dependencies as the ones that i'm going to use right now you can generate the project by clicking [this link](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.7.2&packaging=jar&jvmVersion=17&groupId=com.example&artifactId=docker&name=docker&description=This%20is%20a%20docker%20demo%20application%20with%20spring%20boot%20and%20postgres&packageName=com.example.docker&dependencies=web,postgresql,lombok,data-jpa).

We are going to open our project using `IntelliJ IDE` and start writing code in it. First we are going to add the following configurations in our `application.yml` file

```yml
# postgres sql connection
spring:
  datasource:
    password: password
    url: jdbc:postgresql://127.0.0.1:5232/todos
    username: admin
  jpa:
    hibernate:
      ddl-auto: create #create
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true
# Configuring the port for our server
server:
  port: 3001
```

Next we are going to create a package called `Todo`. This is where all our todo related code will leave. We are then going to create a java class called `Todo.java` and in that file we are going to create a todo model as follows:

```java
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
```

Next we are going to create an interface called `TodoServiceInterface`. This defined the methods and operations that we are going to perform on our todos.

```java
package com.example.docker.todo;
import java.util.Collection;
public interface TodoServiceInterface {
    Todo createTodo(Todo todo);
    Collection<Todo> getTodos();
    Todo updateTodo(Todo todo);
    Boolean deleteTodo(Long id);
    Todo getTodo(Long id);
}

```

Now that we have created a service interface we need to create an actual service class. But before we do that we need to create a TodoRepository interface that will look as follows.

```java
package com.example.docker.todo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}

```

Now that we have a repository we can now go and create a `TodoService` class and it will look as follows:

```java
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
```

Next we are going to create a `Response` class. This class will contain the response type that we are going to get from the server and it will look as follows:

```java
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
    protected int limit;
    protected int page;
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
```

Now that we have a response type, we can go ahead and create a `TodoController`. This is where we are going where we will define the mapping to our rest api.

```java
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
```

Now that we we can start a postgres container on docker and expose the port so that we can be able to connect to our spring boot application that is on our local machine. We are going to create a file called `docker-compose.yml` and add the following configurations to it. Note that these configurations must also line up with the ones that we are using in our `application.yml` file in terms of environmental variables for our database connections.

```yml
version: "3.9"
services:
  postgresdb:
    image: postgres:14.4-alpine
    container_name: pgsql
    restart: always
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/0_init.sql
      # - $HOME/database:/var/lib/postgresql/data
    ports:
      - "5232:5432"
    expose:
      - "5232"
    environment:
      POSTGRES_DB: todos
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      SERVICE_TAGS: dev
      SERVICE_NAME: postgresdb
    networks:
      - internalnet

  nodeapp:
    container_name: server
    build: .
    image: nodeapp:1.0
    ports:
      - "3002:3002"
    expose:
      - "3002"
    environment:
      DB_HOST: postgresdb
      DB_PORT: 5432
      DB_USER: "admin"
      DB_PASSWORD: "password"
      DB_NAME: todos
      DB_CONNECTION_LIMIT: 20
      SERVICE_TAGS: dev
      SERVICE_NAME: nodeapp
      PORT: 3002
    depends_on:
      - postgresdb
    networks:
      - internalnet

networks:
  internalnet:
    driver: bridge
```

Next we are going to run the `compose up` docker command so taht we can start the container based on the `docker-compose.yml` file that we have as follows:

```shell
docker compose up -d
```

Now if we run the `ps` command we will get the following output:

```shell
CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS                         PORTS                               NAMES
8020b83c064f   postgres:14.4-alpine   "docker-entrypoint.s…"   32 seconds ago   Up 16 seconds                  5232/tcp, 0.0.0.0:5232->5432/tcp    pgsql
```

Now we can go ahead and make `API` request to the server and everything should work fine.

Now that everything is working locally we can now create a `Dockerfile` for our springboot rest api. First we need to change our `docker-compose.yml` file to look as follows:

```yml
version: "3.9"
services:
  postgresdb:
    image: postgres:14.4-alpine
    container_name: pgsql
    restart: always
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/0_init.sql
      - $HOME/database:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    expose:
      - "5432"
    environment:
      POSTGRES_DB: todos
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      SERVICE_NAME: postgresdb
    networks:
      - internalnet
  springboot:
    container_name: springbootserver
    build: .
    image: springboot:1.0
    ports:
      - "3001:3001"
    expose:
      - "3001"
    environment:
      DB_USER: "admin"
      DB_PASSWORD: "password"
    depends_on:
      - postgresdb
    networks:
      - internalnet
networks:
  internalnet:
    driver: bridge
```

And then we change our `application.yml` file to look as follows:

```yml
# postgres sql connection
spring:
  datasource:
    password: password
    url: jdbc:postgresql://postgresdb:5432/todos
    username: admin
  jpa:
    hibernate:
      ddl-auto: create #create
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true
# Configuring the port for our server
server:
  port: 3001
```

### Packaging our application

Next we are going to package our application, just by following [these steps](https://github.com/CrispenGari/java-startup/tree/main/00-web-dev/00_SIMPLE_REST_JPA_POSTGRES#packaging-our-application)

> Note that for you to successfully create a `jar` file you need to skip the test. [Here is how you can skip the tests.](https://stackoverflow.com/questions/24727536/maven-skip-tests)

Then we will need to create a `Dockerfile` in the root folder of our project and add the following to it:

```Dockerfile

FROM openjdk:17

WORKDIR /app

COPY ./target/docker-0.0.1-SNAPSHOT.jar ./docker-0.0.1-SNAPSHOT.jar

EXPOSE 3001

CMD ["java","-jar","docker-0.0.1-SNAPSHOT.jar"]
```

After we have created our `Dockerfile` we can run the following command to start the containers in the same network:

```shell
docker compose up -d
```

Now if we run the `ps` command we will get the following as output:

```shell
CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS         PORTS                    NAMES
9c9e5dbb3b86   springboot:1.0         "java -jar app.jar"      11 seconds ago   Up 4 seconds   0.0.0.0:3001->3001/tcp   springbootserver
ec94b1652c48   postgres:14.4-alpine   "docker-entrypoint.s…"   13 seconds ago   Up 7 seconds   0.0.0.0:5432->5432/tcp   pgsql
```

Which means now we can be able to make API request to the server for example is you visit the url:

```json
http://127.0.0.1:3001/api/v1/todos/all
```

Here is the expected response:

```json
{
  "timeStamp": "2022-08-11T06:50:38.8154984",
  "statusCode": 200,
  "status": "OK",
  "todo": {
    "todos": []
  }
}
```
