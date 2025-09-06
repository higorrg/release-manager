package com.empresa.app;

import io.restassured.RestAssured;
import io.restassured.response.Response;

import java.util.HashMap;
import java.util.Map;

public class TokenHelper {

    String keycloakBaseUrl;
    
    public TokenHelper() {
        this.keycloakBaseUrl = System.getProperty("test.keycloak.url", "http://localhost:8080");
    }

    public String getAdminToken() {
        return getToken("admin-user", "admin-password", "admin");
    }

    public String getUserToken() {
        return getToken("test-user", "test-password", "user");
    }

    private String getToken(String username, String password, String role) {
        Map<String, String> formParams = new HashMap<>();
        formParams.put("grant_type", "password");
        formParams.put("client_id", "release-manager-backend");
        formParams.put("client_secret", "backend-client-secret");
        formParams.put("username", username);
        formParams.put("password", password);

        Response response = RestAssured.given()
                .contentType("application/x-www-form-urlencoded")
                .formParams(formParams)
                .when()
                .post(this.keycloakBaseUrl + "/realms/release-manager/protocol/openid-connect/token")
                .then()
                .statusCode(200)
                .extract()
                .response();

        return response.jsonPath().getString("access_token");
    }
}