package br.com.releasemanger.customer_environment_release.service;

import java.util.List;

import br.com.releasemanger.business_exception.BusinessException;
import br.com.releasemanger.customer.model.entity.Customer;
import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease;
import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease.Environment;
import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

/**
 * Service for managing customer environment releases.
 */
@ApplicationScoped
public class CustomerEnvironmentReleaseService {

    /**
     * Relates a module release to a customer and environment.
     * 
     * @param moduleReleaseId The ID of the module release
     * @param customerId The ID of the customer
     * @param environment The environment (HOMOLOGATION or PRODUCTION)
     * @return The created customer environment release
     */
    @Transactional
    public CustomerEnvironmentRelease relateReleaseToCustomerEnvironment(Long moduleReleaseId, Long customerId, Environment environment) {
        // Find the module release
        ModuleRelease moduleRelease = ModuleRelease.findById(moduleReleaseId);
        if (moduleRelease == null) {
            throw new BusinessException("Module release not found with ID: " + moduleReleaseId);
        }
        
        // Find the customer
        Customer customer = Customer.findById(customerId);
        if (customer == null) {
            throw new BusinessException("Customer not found with ID: " + customerId);
        }
        
        // Check if the relation already exists
        List<CustomerEnvironmentRelease> existingRelations = CustomerEnvironmentRelease.list(
                "moduleRelease.id = ?1 and customer.id = ?2 and environment = ?3",
                moduleReleaseId, customerId, environment);
        
        if (!existingRelations.isEmpty()) {
            throw new BusinessException("Relation already exists for this module release, customer, and environment");
        }
        
        // Create the relation
        CustomerEnvironmentRelease relation = CustomerEnvironmentRelease.builder()
                .moduleRelease(moduleRelease)
                .customer(customer)
                .environment(environment)
                .build();
        relation.persist();
        
        return relation;
    }
    
    /**
     * Gets all customer environment releases for a module release.
     * 
     * @param moduleReleaseId The ID of the module release
     * @return List of customer environment releases
     */
    public List<CustomerEnvironmentRelease> getRelationsForModuleRelease(Long moduleReleaseId) {
        return CustomerEnvironmentRelease.list("moduleRelease.id", moduleReleaseId);
    }
    
    /**
     * Gets all customer environment releases for a customer.
     * 
     * @param customerId The ID of the customer
     * @return List of customer environment releases
     */
    public List<CustomerEnvironmentRelease> getRelationsForCustomer(Long customerId) {
        return CustomerEnvironmentRelease.list("customer.id", customerId);
    }
    
    /**
     * Gets all customer environment releases for a customer and environment.
     * 
     * @param customerId The ID of the customer
     * @param environment The environment (HOMOLOGATION or PRODUCTION)
     * @return List of customer environment releases
     */
    public List<CustomerEnvironmentRelease> getRelationsForCustomerAndEnvironment(Long customerId, Environment environment) {
        return CustomerEnvironmentRelease.list("customer.id = ?1 and environment = ?2", customerId, environment);
    }
}