FROM openjdk:17

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 3001

CMD ["java","-jar","app.jar"]