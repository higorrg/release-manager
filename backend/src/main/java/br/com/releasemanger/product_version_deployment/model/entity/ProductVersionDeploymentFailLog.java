package br.com.releasemanger.product_version_deployment.model.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(schema = "RELEASE_MANAGER", name = "PRODUCT_VERSION_DEPLOYMENT_FAIL_LOG")
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductVersionDeploymentFailLog extends PanacheEntityBase {

	@Id
	@GeneratedValue(generator = "native", strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;
	
	@Column(name = "product_version_deployment_status_id", nullable = false)
	private Long productVersionDeploymentStatusId;

	@Column(name = "message", nullable = false)
	private String message;
}
