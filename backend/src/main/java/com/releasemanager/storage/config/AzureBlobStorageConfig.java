package com.releasemanager.storage.config;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class AzureBlobStorageConfig {

    @ConfigProperty(name = "quarkus.azure.storage.blob.connection-string")
    String connectionString;

    @Produces
    @ApplicationScoped
    public BlobServiceClient blobServiceClient() {
        return new BlobServiceClientBuilder()
            .connectionString(connectionString)
            .buildClient();
    }
}