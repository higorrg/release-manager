package br.com.releasemanger.module_release.service;

import java.util.List;
import java.util.stream.Collectors;

import br.com.releasemanger.customer.model.entity.Customer;
import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease;
import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease.Environment;
import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Service for managing module release availability.
 */
@ApplicationScoped
public class ModuleReleaseAvailabilityService {

    /**
     * Gets all available module releases for a customer and environment.
     * 
     * @param customerId The ID of the customer
     * @param environment The environment (HOMOLOGATION or PRODUCTION)
     * @return List of available module releases
     */
    public List<ModuleRelease> getAvailableModuleReleases(Long customerId, Environment environment) {
        // Find the customer
        Customer customer = Customer.findById(customerId);
        if (customer == null) {
            return List.of();
        }
        
        // Find all customer environment releases for the customer and environment
        List<CustomerEnvironmentRelease> customerEnvironmentReleases = CustomerEnvironmentRelease.list(
                "customer.id = ?1 and environment = ?2", customerId, environment);
        
        // Extract the module releases
        return customerEnvironmentReleases.stream()
                .map(CustomerEnvironmentRelease::getModuleRelease)
                .collect(Collectors.toList());
    }
    
    /**
     * Gets all available module releases for a customer by custom customer ID and environment.
     * 
     * @param customCustomerId The custom ID of the customer
     * @param environment The environment (HOMOLOGATION or PRODUCTION)
     * @return List of available module releases
     */
    public List<ModuleRelease> getAvailableModuleReleasesByCustomCustomerId(String customCustomerId, Environment environment) {
        // Find the customer by custom customer ID
        Customer customer = Customer.find("customCustomerId", customCustomerId).firstResult();
        if (customer == null) {
            return List.of();
        }
        
        return getAvailableModuleReleases(customer.id, environment);
    }
    
    /**
     * Gets the download URL for a module release.
     * 
     * @param moduleReleaseId The ID of the module release
     * @return The download URL
     */
    public String getModuleReleaseDownloadUrl(Long moduleReleaseId) {
        ModuleRelease moduleRelease = ModuleRelease.findById(moduleReleaseId);
        if (moduleRelease == null || moduleRelease.getArtifactLocation() == null) {
            return null;
        }
        
        return moduleRelease.getArtifactLocation();
    }
}