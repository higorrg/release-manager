FROM registry.access.redhat.com/ubi8/openjdk-21:1.20

ENV LANGUAGE='en_US:en'

# Install maven
USER root
RUN microdnf install maven -y && microdnf clean all

# Copy source code
COPY --chown=185 pom.xml /deployments/
COPY --chown=185 src /deployments/src/

# Build application
USER 185
WORKDIR /deployments
RUN mvn dependency:resolve
RUN mvn clean package -DskipTests

# Copy the built application
COPY target/quarkus-app/lib/ /deployments/lib/
COPY target/quarkus-app/*.jar /deployments/
COPY target/quarkus-app/app/ /deployments/app/
COPY target/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185

ENTRYPOINT ["java", "-jar", "/deployments/quarkus-run.jar"]