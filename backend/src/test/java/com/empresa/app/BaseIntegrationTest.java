package com.empresa.app;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import org.junit.jupiter.api.BeforeAll;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@QuarkusIntegrationTest
public abstract class BaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("releasemanager")
            .withUsername("admin")
            .withPassword("admin123")
            .withExposedPorts(5432)
            .withReuse(true);

    public static final int KC_PORT = 8080;

    @Container
    static GenericContainer<?> keycloak = new GenericContainer<>("quay.io/keycloak/keycloak:24.0")
            .withExposedPorts(KC_PORT)
            .withEnv("KEYCLOAK_ADMIN", "admin")
            .withEnv("KEYCLOAK_ADMIN_PASSWORD", "admin")
            .withEnv("KC_IMPORT", "/opt/keycloak/data/import/realm-export.json")
            .withClasspathResourceMapping("keycloak-realm.json", "/opt/keycloak/data/import/realm-export.json", org.testcontainers.containers.BindMode.READ_ONLY)
            .withCommand("start-dev", "--import-realm")
            .waitingFor(Wait.forHttp("/realms/release-manager").forPort(KC_PORT))
            .withReuse(true);


    @BeforeAll
    static void configureTestContainers() {
        postgres.start();
        System.setProperty("quarkus.datasource.jdbc.url", postgres.getJdbcUrl());
        System.setProperty("quarkus.datasource.username", postgres.getUsername());
        System.setProperty("quarkus.datasource.password", postgres.getPassword());

        keycloak.start();
        String keycloakUrl = "http://localhost:" + keycloak.getMappedPort(KC_PORT);
        System.setProperty("quarkus.oidc.auth-server-url", keycloakUrl + "/realms/release-manager");
        
        // Set the Keycloak URL for TokenHelper
        System.setProperty("test.keycloak.url", keycloakUrl);
    }
}