package br.com.releasemanger.version_label.model.vo;

public class VersionLabelStringfy {

	private static final String FORMAT_VERSION = "%d.%d.%d.%d";

	public static final String formatVersion(int major, int minor, int patch, int revision) {
		return FORMAT_VERSION.formatted(major, minor, patch, revision);
	}
}
