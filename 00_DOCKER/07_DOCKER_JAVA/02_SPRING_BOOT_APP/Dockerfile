
FROM openjdk:17

WORKDIR /app

COPY ./target/docker-0.0.1-SNAPSHOT.jar ./docker-0.0.1-SNAPSHOT.jar

EXPOSE 3001

CMD ["java","-jar","docker-0.0.1-SNAPSHOT.jar"]