package br.com.releasemanger.product.model.entity;

import br.com.releasemanger.version_label.model.vo.VersionLabelStringfy;
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
@Table(schema = "RELEASE_MANAGER", name = "PRODUCT")
@Data
@EqualsAndHashCode(callSuper = false)
public class Product extends PanacheEntityBase {

	@Id
	@GeneratedValue(generator = "native", strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@NotBlank(message = "Product name may not be blank")
	private String name;

	@Column(name = "MAJOR_VERSION")
	private Integer majorVersion;

	@Column(name = "MINOR_VERSION")
	private Integer minorVersion;

	@Column(name = "PATCH_VERSION")
	private Integer patchVersion;

	@Column(name = "REVISION_VERSION")
	private Integer revisionVersion;

	public String getVersionString() {
		return VersionLabelStringfy.formatVersion(this.getMajorVersion(), this.getMinorVersion(), this.getPatchVersion(),
				this.getRevisionVersion());
	}
}
