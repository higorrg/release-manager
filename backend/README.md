# The Java Backend

This project uses Quarkus, the Supersonic Subatomic Java Framework. A Kubernetes Native Java stack tailored for OpenJDK HotSpot and GraalVM, crafted from the best of breed Java libraries and standards.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Requirements

Ensure you have already created the database, see the root README file for more information.

## Running the Backend in Dev Mode

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
  --env QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/release_manager \
  releasemanager/backend:latest
```

## Playing with the application

Nether way, by running in dev mode or running the container image, now you can play around with the application by accessing the main page at http://localhost:8080/

There, you will find the notification panel, and a link to the [Swagger-UI](http://localhost:8080/q/swagger-ui/), where you can send HTTP requests and observe the notification panel react using [SSE - Serven-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).
