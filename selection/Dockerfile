FROM adoptopenjdk/openjdk11:latest
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} selection-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/selection-0.0.1-SNAPSHOT.jar"]