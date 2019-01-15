FROM openjdk:8-jdk-alpine

LABEL maintainer="prostrmk@gmail.com"

VOLUME /tmp

EXPOSE 8080

#RUN ls /var/lib/docker/tmp/docker-builder217913797/web-module/

ARG JAR_FILE=web-module/target/web-module-1.0-SNAPSHOT.war

ADD ${JAR_FILE} web-module-1.0-SNAPSHOT.war

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/web-module-1.0-SNAPSHOT.war"]
#ENTRYPOINT ["java", "-jar","/web-module-1.0-SNAPSHOT.war"]