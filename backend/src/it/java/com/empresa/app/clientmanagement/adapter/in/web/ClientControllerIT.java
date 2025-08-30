package com.empresa.app.clientmanagement.adapter.in.web;

import com.empresa.app.BaseIntegrationTest;
import com.empresa.app.clientmanagement.adapter.in.dto.CreateClientRequest;
import com.empresa.app.clientmanagement.adapter.in.dto.UpdateClientRequest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

class ClientControllerIT extends BaseIntegrationTest {

    @Test
    void shouldRequireAuthenticationForClientCreation() {
        CreateClientRequest request = new CreateClientRequest("CLI001", "Cliente Teste", "Cliente para testes de integração");
        
        given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/api/v1/clients")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForClientListing() {
        given()
        .when()
            .get("/api/v1/clients")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForClientById() {
        String fakeId = "11111111-1111-1111-1111-111111111111";
        
        given()
        .when()
            .get("/api/v1/clients/{clientId}", fakeId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationBeforeValidatingClientId() {
        String invalidId = "11111111-1111-1111-1111-111111111111";
        
        given()
        .when()
            .get("/api/v1/clients/{clientId}", invalidId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForClientUpdate() {
        String fakeId = "11111111-1111-1111-1111-111111111111";
        UpdateClientRequest updateRequest = new UpdateClientRequest("Cliente Atualizado", "Descrição atualizada");
        
        given()
            .contentType(ContentType.JSON)
            .body(updateRequest)
        .when()
            .put("/api/v1/clients/{clientId}", fakeId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForClientDeletion() {
        String fakeId = "11111111-1111-1111-1111-111111111111";
        
        given()
        .when()
            .delete("/api/v1/clients/{clientId}", fakeId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForEnvironments() {
        given()
        .when()
            .get("/api/v1/clients/environments")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForProtectedEndpoints() {
        CreateClientRequest request = new CreateClientRequest("UNAUTH", "Unauthorized", "Test");
        
        given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/api/v1/clients")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForReadingClients() {
        given()
        .when()
            .get("/api/v1/clients")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationBeforeValidatingClientData() {
        CreateClientRequest invalidRequest = new CreateClientRequest(null, "Nome", "Descrição");
        
        given()
            .contentType(ContentType.JSON)
            .body(invalidRequest)
        .when()
            .post("/api/v1/clients")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationBeforeValidatingClientExists() {
        String nonExistentId = "22222222-2222-2222-2222-222222222222";
        UpdateClientRequest updateRequest = new UpdateClientRequest("Nome", "Descrição");
        
        given()
            .contentType(ContentType.JSON)
            .body(updateRequest)
        .when()
            .put("/api/v1/clients/{clientId}", nonExistentId)
        .then()
            .statusCode(401);
    }
}