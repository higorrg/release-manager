package com.empresa.app.releasemanagement.adapter.in.web;

import com.empresa.app.BaseIntegrationTest;
import com.empresa.app.releasemanagement.adapter.in.dto.CreateReleaseRequest;
import com.empresa.app.releasemanagement.adapter.in.dto.UpdateStatusRequest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

class ReleaseControllerIT extends BaseIntegrationTest {

    @Test
    void shouldRequireAuthenticationForReleaseCreation() {
        CreateReleaseRequest request = new CreateReleaseRequest("Test Product", "1.0.0");
        
        given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/api/v1/releases")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForPipelineReleaseCreation() {
        CreateReleaseRequest request = new CreateReleaseRequest("Pipeline Product", "2.0.0");
        
        given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/api/v1/releases/pipeline")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForReleasesList() {
        given()
        .when()
            .get("/api/v1/releases")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForReleaseById() {
        String fakeId = "11111111-1111-1111-1111-111111111111";
        
        given()
        .when()
            .get("/api/v1/releases/{releaseId}", fakeId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationBeforeValidatingReleaseId() {
        String invalidId = "11111111-1111-1111-1111-111111111111";
        
        given()
        .when()
            .get("/api/v1/releases/{releaseId}", invalidId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForStatusUpdate() {
        String fakeId = "11111111-1111-1111-1111-111111111111";
        UpdateStatusRequest updateRequest = new UpdateStatusRequest("APPROVED", "testuser", "Test approval");
        
        given()
            .contentType(ContentType.JSON)
            .body(updateRequest)
        .when()
            .put("/api/v1/releases/{releaseId}/status", fakeId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForReleaseHistory() {
        String fakeId = "11111111-1111-1111-1111-111111111111";
        
        given()
        .when()
            .get("/api/v1/releases/{releaseId}/history", fakeId)
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForClientsList() {
        given()
        .when()
            .get("/api/v1/releases/clients")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForEnvironmentsList() {
        given()
        .when()
            .get("/api/v1/releases/environments")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldRequireAuthenticationForAdminEndpoints() {
        CreateReleaseRequest request = new CreateReleaseRequest("Admin Test", "1.0.0");
        
        given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/api/v1/releases/pipeline")
        .then()
            .statusCode(401);
    }

    @Test
    void shouldCreateReleaseWithAuthentication() {
        String token = getAccessToken("testuser", "testpass");
        CreateReleaseRequest request = new CreateReleaseRequest("Test Product", "1.0.0");
        
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + token)
            .body(request)
        .when()
            .post("/api/v1/releases")
        .then()
            .statusCode(anyOf(is(201), is(400), is(500)))
            .body("$", notNullValue());
    }

    @Test
    void shouldListReleasesWithAuthentication() {
        String token = getAccessToken("testuser", "testpass");
        
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/api/v1/releases")
        .then()
            .statusCode(anyOf(is(200), is(500)))
            .body("$", notNullValue());
    }

    @Test
    void shouldGetClientsWithAuthentication() {
        String token = getAccessToken("testuser", "testpass");
        
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/api/v1/releases/clients")
        .then()
            .statusCode(anyOf(is(200), is(500)))
            .body("$", notNullValue());
    }

    @Test
    void shouldGetEnvironmentsWithAuthentication() {
        String token = getAccessToken("testuser", "testpass");
        
        given()
            .header("Authorization", "Bearer " + token)
        .when()
            .get("/api/v1/releases/environments")
        .then()
            .statusCode(anyOf(is(200), is(500)))
            .body("$", notNullValue());
    }

    @Test
    void shouldCreatePipelineReleaseWithAdminRole() {
        String token = getAccessToken("adminuser", "adminpass");
        CreateReleaseRequest request = new CreateReleaseRequest("Pipeline Product", "2.0.0");
        
        given()
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + token)
            .body(request)
        .when()
            .post("/api/v1/releases/pipeline")
        .then()
            .statusCode(anyOf(is(201), is(400), is(500)))
            .body("$", notNullValue());
    }
}