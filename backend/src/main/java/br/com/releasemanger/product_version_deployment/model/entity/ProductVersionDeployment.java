package br.com.releasemanger.product_version_deployment.model.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigInteger;
import java.time.Instant;

@Entity
@Table(name = "PRODUCT_VERSION_DEPLOYMENT")
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductVersionDeployment extends PanacheEntityBase {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Column(name = "product_id", nullable = false)
	private Long productId;

	@Column(name = "customer_id", nullable = false)
	private Long customerId;

	@Column(name = "version_id", nullable = false)
	private Long versionId;

	@Column(name = "download_start")
	private Instant downloadStart;

	@Column(name = "download_end")
	private Instant downloadEnd;

	@Column(name = "download_time")
	private Long downloadTime;

	@Column(name = "deployment_start")
	private Instant deploymentStart;

	@Column(name = "deployment_end")
	private Instant deploymentEnd;

	@Column(name = "deployment_time")
	private Long deploymentTime;

	@Column(name = "deployment_status")
	private Long deploymentStatus = 1L;
}
