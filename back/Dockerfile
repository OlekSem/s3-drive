FROM maven:3.9-eclipse-temurin-17-noble AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mkdir -p /app/uploads

RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jre-noble

WORKDIR /app

EXPOSE 8080

VOLUME /app/uploads

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]