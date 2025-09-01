package com.empresa.app;

import dasniko.testcontainers.keycloak.KeycloakContainer;
import io.quarkus.test.junit.QuarkusIntegrationTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeAll;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Map;

@QuarkusIntegrationTest
@Testcontainers
public abstract class BaseIntegrationTest {

    @Container
    protected static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("releasemanager_test")
            .withUsername("test")
            .withPassword("test")
            .withReuse(true);

    @Container
    protected static KeycloakContainer keycloak = new KeycloakContainer("quay.io/keycloak/keycloak:24.0")
            .withRealmImportFile("keycloak/test-realm.json")
            .withEnv("KEYCLOAK_ADMIN", "admin")
            .withEnv("KEYCLOAK_ADMIN_PASSWORD", "admin")
            .withReuse(true);

    @BeforeAll
    static void configureProperties() {
        postgres.start();
        keycloak.start();
        
        // Database properties
        System.setProperty("quarkus.datasource.username", postgres.getUsername());
        System.setProperty("quarkus.datasource.password", postgres.getPassword());
        System.setProperty("quarkus.datasource.jdbc.url", postgres.getJdbcUrl());
        
        // Keycloak properties - apenas a URL dinâmica
        String keycloakAuthUrl = keycloak.getAuthServerUrl();
        System.setProperty("quarkus.oidc.auth-server-url", keycloakAuthUrl + "/realms/test");
    }

    protected static String getAccessToken(String username, String password) {
        return RestAssured.given()
                .param("grant_type", "password")
                .param("client_id", "test-client")
                .param("client_secret", "test-secret")
                .param("username", username)
                .param("password", password)
                .when()
                .post(keycloak.getAuthServerUrl() + "/realms/test/protocol/openid-connect/token")
                .then()
                .statusCode(200)
                .extract()
                .path("access_token");
    }
}