# The Java Backend

This project uses Quarkus, the Supersonic Subatomic Java Framework. A Kubernetes Native Java stack tailored for OpenJDK HotSpot and GraalVM, crafted from the best of breed Java libraries and standards.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Configuration

Before start the Java backend, you need to inform what is your IRIS password to it.

You can provide it on the property `quarkus.datasource.password` in the `application.properties` file located at `src/main/resources`, or the environment variable `QUARKUS_DATASOURCE_PASSWORD` if you use the docker image.

## Running the Backend in Dev Mode

### Prepare dependencies

This application was built using [Apache Maven 3.9.5](https://maven.apache.org/download.cgi) and [Java 17](https://javaalmanac.io/jdk/17/).

We recommend using [SDK Man](https://sdkman.io/). After installing SDK Man, you can install a Java 17 distribution, Maven and Quarkus CLI.

```bash
sdk install maven
sdk install java 17.0.8-sem
sdk install quarkus

#From the backend directory run:
quarkus dev
```

This project already contains InterSystems jar files needed at `src/main/resources/lib`.

InterSystems Java technologies are not available on Maven Central, so you need to get JDBC connectors and other jar files from https://intersystems-community.github.io/iris-driver-distribution/.

In order to build this project, go to the `Backend` root folder and type:

```
mvn install:install-file -Dfile=${PWD}/src/main/resources/lib/intersystems-jdbc-3.7.1.jar -DgroupId=com.intersystems -DartifactId=intersystems-jdbc -Dversion=3.7.1 -Dpackaging=jar
```

You can run the application in dev mode using Quarkus CLI:

```bash
quarkus dev
```

You can run the application in dev mode using Maven:

```bash
./mvnw compile quarkus:dev
```

Quarkus ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/. There, you can explore all extensions and configurations of the application.

## Packaging the application in container

The application can be packaged for containers using:

`./mvnw package -Dquarkus.native.container-build=true`

```bash
docker run --rm --name release-manager-backend \
  --network=release-manager-net \
  -p 8080:8080 \
  --env QUARKUS_DATASOURCE_JDBC_URL=jdbc:IRIS://release-manager-iris:1972/USER \
  releasemanager/backend:latest
```

## Playing with the application

Nether way, by running in dev mode or running the container image, now you can play around with the application by accessing the main page at http://localhost:8080/

There, you will find the notification panel, and a link to the [Swagger-UI](http://localhost:8080/q/swagger-ui/), where you can send HTTP requests and observe the notification panel react using [SSE - Serven-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).
