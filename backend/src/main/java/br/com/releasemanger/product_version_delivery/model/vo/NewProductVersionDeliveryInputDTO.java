package br.com.releasemanger.product_version_delivery.model.vo;

import java.io.File;

import br.com.releasemanger.version_label.model.vo.VersionLabel;
import jakarta.ws.rs.FormParam;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewProductVersionDeliveryInputDTO {

	@FormParam("file")
	private File file;

	@FormParam("file-name")
	private String fileName;

	@FormParam("versionLabel")
	private VersionLabel versionLabel;

}
