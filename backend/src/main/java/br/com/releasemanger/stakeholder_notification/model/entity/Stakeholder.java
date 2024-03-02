package br.com.releasemanger.stakeholder_notification.model.entity;

import java.util.List;

import br.com.releasemanger.version_status.model.entity.VersionStatus;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(schema = "RELEASE_MANAGER", name = "STAKEHOLDER")
@Data
@EqualsAndHashCode(callSuper = false)
public class Stakeholder extends PanacheEntityBase {

	@Id
	@GeneratedValue(generator = "native", strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@NotBlank(message = "Stakenolder name may not be blank")
	private String name;

	@Column(name = "stakeholder_role")
	private String stakeholderRole;

	@Email
	private String email;

	@ManyToMany
	@JoinTable(schema = "RELEASE_MANAGER", name = "STAKEHOLDER_STATUSVERSION", joinColumns = @JoinColumn(name = "stakeholder_id"), inverseJoinColumns = @JoinColumn(name = "status_version_id"))
	private List<VersionStatus> versionStatuses;
}
