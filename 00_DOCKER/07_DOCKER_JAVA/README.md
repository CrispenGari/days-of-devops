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

### Dockerize Springboot Apps
