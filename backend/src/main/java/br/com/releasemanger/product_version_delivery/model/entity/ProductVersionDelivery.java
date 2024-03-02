package br.com.releasemanger.product_version_delivery.model.entity;

import java.time.LocalDateTime;

import br.com.releasemanger.product.model.entity.Product;
import br.com.releasemanger.version_label.model.vo.VersionLabelStringfy;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(schema = "RELEASE_MANAGER", name = "PRODUCT_VERSION_DELIVERY")
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVersionDelivery extends PanacheEntityBase {

	@Id
	@GeneratedValue(generator = "native", strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Column(name = "product_id", nullable = false)
	private Long productId;

	@Column(name = "version_status_id", nullable = false)
	@Builder.Default
	private Long versionStatus = 1L;

	@Column(name = "artifact_location")
	private String artifactLocation;

	@Column(name = "username")
	private String username;

	@Column(name = "version_created_timestamp")
	private LocalDateTime versionCreatedTimestamp;

	@Column(name = "major_version")
	private Integer majorVersion;

	@Column(name = "minor_version")
	private Integer minorVersion;

	@Column(name = "patch_version")
	private Integer patchVersion;

	@Column(name = "revision_version")
	private Integer revisionVersion;

	@Column(name = "release_notes")
	private String releaseNotes;

	@Column(name = "prerequisite")
	private String prerequisite;

	public void setVersionFromProduct(Product product) {
		this.setMajorVersion(product.getMajorVersion());
		this.setMinorVersion(product.getMinorVersion());
		this.setPatchVersion(product.getPatchVersion());
		this.setRevisionVersion(product.getRevisionVersion());
	}

	public String getVersionString() {
		return VersionLabelStringfy.formatVersion(this.getMajorVersion(), this.getMinorVersion(), this.getPatchVersion(),
				this.getRevisionVersion());
	}

}
