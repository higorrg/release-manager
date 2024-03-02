package br.com.releasemanger.customer.model.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(schema = "RELEASE_MANAGER", name = "CUSTOMER")
@Data
@EqualsAndHashCode(callSuper = false)
public class Customer extends PanacheEntityBase {

	@Id
	@GeneratedValue(generator = "native", strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@NotBlank(message = "Customer name may not be blank")
	private String name;

	@Column(name = "CUSTOM_CUSTOMER_ID")
	private String customCustomerId;

	@Column(name = "CURRENT_MAJOR_VERSION")
	private Integer currentMajorVersion;

	@Column(name = "CURRENT_MINOR_VERSION")
	private Integer currentMinorVersion;

	@Column(name = "CURRENT_PATCH_VERSION")
	private Integer currentPatchVersion;

	@Column(name = "CURRENT_REVISION_VERSION")
	private Integer currentRevisionVersion;
}
