package com.empresa.app;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import org.junit.jupiter.api.BeforeAll;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@QuarkusIntegrationTest
@Testcontainers
public abstract class BaseIntegrationTest {

    @Container
    protected static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("releasemanager_test")
            .withUsername("test")
            .withPassword("test");

    @BeforeAll
    static void configureProperties() {
        postgres.start();
        
        System.setProperty("quarkus.datasource.db-kind", "postgresql");
        System.setProperty("quarkus.datasource.username", postgres.getUsername());
        System.setProperty("quarkus.datasource.password", postgres.getPassword());
        System.setProperty("quarkus.datasource.jdbc.url", postgres.getJdbcUrl());
        System.setProperty("quarkus.flyway.migrate-at-start", "true");
        System.setProperty("quarkus.hibernate-orm.database.generation", "none");
        
        // Desabilitar segurança completamente para testes
        System.setProperty("quarkus.security.enabled", "false");
        System.setProperty("quarkus.oidc.enabled", "false");
    }
}