package com.empresa.app.clientmanagement.adapter.in.web;

import com.empresa.app.BaseIntegrationTest;
import com.empresa.app.TokenHelper;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ClientResourceIT extends BaseIntegrationTest{

    @Test
    void testUnauthenticatedAccess_shouldReturn401() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/api/v1/clients")
                .then()
                .statusCode(401);
    }

//    @Test
//    void testInvalidToken_shouldReturn401() {
//        given()
//                .contentType(ContentType.JSON)
//                .header("Authorization", "Bearer invalid-token")
//                .when()
//                .get("/api/v1/clients")
//                .then()
//                .statusCode(401);
//    }
//
//    @Test
//    void testValidUserToken_shouldAccessUserEndpoints() {
//        String userToken = tokenHelper.getUserToken();
//
//        given()
//                .contentType(ContentType.JSON)
//                .header("Authorization", "Bearer " + userToken)
//                .when()
//                .get("/api/v1/clients")
//                .then()
//                .statusCode(200)
//                .body("size()", greaterThanOrEqualTo(0));
//    }
//
//    @Test
//    void testUserToken_accessingAdminEndpoint_shouldReturn403() {
//        String userToken = tokenHelper.getUserToken();
//
//        given()
//                .contentType(ContentType.JSON)
//                .header("Authorization", "Bearer " + userToken)
//                .when()
//                .delete("/api/v1/clients/1")
//                .then()
//                .statusCode(403);
//    }
//
//    @Test
//    void testAdminToken_shouldAccessAllEndpoints() {
//        String adminToken = tokenHelper.getAdminToken();
//
//        given()
//                .contentType(ContentType.JSON)
//                .header("Authorization", "Bearer " + adminToken)
//                .when()
//                .get("/api/v1/clients")
//                .then()
//                .statusCode(200);
//    }
}
