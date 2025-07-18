package br.com.releasemanger.customer_environment_release.model.entity;

import br.com.releasemanger.customer.model.entity.Customer;
import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Entity representing the relationship between a customer, environment, and a module release.
 * This entity is used to track which releases are available for which customers and environments.
 */
@Entity
@Table(name = "CUSTOMER_ENVIRONMENT_RELEASE")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CustomerEnvironmentRelease extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "module_release_id", nullable = false)
    private ModuleRelease moduleRelease;

    @Enumerated(EnumType.STRING)
    @Column(name = "environment", nullable = false)
    private Environment environment;

    /**
     * Enum representing the possible environments.
     */
    public enum Environment {
        HOMOLOGATION,
        PRODUCTION
    }
}