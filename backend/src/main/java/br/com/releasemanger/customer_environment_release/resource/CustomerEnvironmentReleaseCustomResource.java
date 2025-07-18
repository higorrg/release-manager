package br.com.releasemanger.customer_environment_release.resource;

import java.util.List;

import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease;
import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease.Environment;
import br.com.releasemanger.customer_environment_release.service.CustomerEnvironmentReleaseService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Custom resource for managing customer environment releases.
 */
@Path("/customer-environment-releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CustomerEnvironmentReleaseCustomResource {

    @Inject
    CustomerEnvironmentReleaseService customerEnvironmentReleaseService;

    /**
     * Relates a module release to a customer and environment.
     * 
     * @param relationRequest The relation request containing the module release ID, customer ID, and environment
     * @return The created customer environment release
     */
    @POST
    @Path("/relate")
    public Response relateReleaseToCustomerEnvironment(RelationRequest relationRequest) {
        CustomerEnvironmentRelease relation = customerEnvironmentReleaseService.relateReleaseToCustomerEnvironment(
                relationRequest.getModuleReleaseId(),
                relationRequest.getCustomerId(),
                relationRequest.getEnvironment());
        
        return Response.ok(relation).build();
    }
    
    /**
     * Gets all customer environment releases for a module release.
     * 
     * @param moduleReleaseId The ID of the module release
     * @return List of customer environment releases
     */
    @GET
    @Path("/by-module-release/{moduleReleaseId}")
    public Response getRelationsForModuleRelease(@PathParam("moduleReleaseId") Long moduleReleaseId) {
        List<CustomerEnvironmentRelease> relations = customerEnvironmentReleaseService.getRelationsForModuleRelease(moduleReleaseId);
        return Response.ok(relations).build();
    }
    
    /**
     * Gets all customer environment releases for a customer.
     * 
     * @param customerId The ID of the customer
     * @param environment Optional environment filter
     * @return List of customer environment releases
     */
    @GET
    @Path("/by-customer/{customerId}")
    public Response getRelationsForCustomer(
            @PathParam("customerId") Long customerId,
            @QueryParam("environment") Environment environment) {
        
        List<CustomerEnvironmentRelease> relations;
        if (environment != null) {
            relations = customerEnvironmentReleaseService.getRelationsForCustomerAndEnvironment(customerId, environment);
        } else {
            relations = customerEnvironmentReleaseService.getRelationsForCustomer(customerId);
        }
        
        return Response.ok(relations).build();
    }
    
    /**
     * Request object for relating a module release to a customer and environment.
     */
    public static class RelationRequest {
        private Long moduleReleaseId;
        private Long customerId;
        private Environment environment;
        
        public Long getModuleReleaseId() {
            return moduleReleaseId;
        }
        
        public void setModuleReleaseId(Long moduleReleaseId) {
            this.moduleReleaseId = moduleReleaseId;
        }
        
        public Long getCustomerId() {
            return customerId;
        }
        
        public void setCustomerId(Long customerId) {
            this.customerId = customerId;
        }
        
        public Environment getEnvironment() {
            return environment;
        }
        
        public void setEnvironment(Environment environment) {
            this.environment = environment;
        }
    }
}