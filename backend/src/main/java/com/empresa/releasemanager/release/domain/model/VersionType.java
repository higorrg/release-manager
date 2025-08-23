package com.empresa.releasemanager.release.domain.model;

public enum VersionType {
    KIT("Kit", "Major release with new features"),
    SERVICE_PACK("Service Pack", "Minor release with improvements"),
    PATCH("Patch", "Bug fixes and critical updates");

    private final String displayName;
    private final String description;

    VersionType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}