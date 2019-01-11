FROM openjdk:8-jdk-alpine

LABEL maintainer="callicoder@gmail.com"

VOLUME /tmp

EXPOSE 8080

ARG JAR_FILE=web-module/target/web-module-1.0-SNAPSHOT.war

ADD ${JAR_FILE} web-module-1.0-SNAPSHOT.war

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/web-module-1.0-SNAPSHOT.war"]