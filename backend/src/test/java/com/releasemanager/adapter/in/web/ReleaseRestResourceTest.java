package com.releasemanager.adapter.in.web;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static io.restassured.RestAssured.given;

@QuarkusTest
@Testcontainers
class ReleaseRestResourceTest {

    @Container
    static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("release")
            .withUsername("release")
            .withPassword("release");

    @BeforeAll
    static void configure() {
        System.setProperty("quarkus.datasource.jdbc.url", db.getJdbcUrl());
    }

    @Test
    void shouldRegisterRelease() {
        given()
                .contentType("application/json")
                .body(new RegisterReleaseRequest("prod", "1.0"))
                .when().post("/releases")
                .then().statusCode(201);
    }

    record RegisterReleaseRequest(String productName, String version) {}
}
