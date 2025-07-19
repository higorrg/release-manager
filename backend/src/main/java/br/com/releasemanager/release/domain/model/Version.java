package br.com.releasemanager.release.domain.model;

import java.util.Objects;

public record Version(int major, int minor, int patch) {
    
    public Version {
        if (major < 0 || minor < 0 || patch < 0) {
            throw new IllegalArgumentException("Version numbers cannot be negative");
        }
    }
    
    public String getFullVersion() {
        return String.format("%d.%d.%d", major, minor, patch);
    }
    
    public static Version fromString(String versionString) {
        Objects.requireNonNull(versionString, "Version string cannot be null");
        
        String[] parts = versionString.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Version string must be in format 'major.minor.patch'");
        }
        
        try {
            int major = Integer.parseInt(parts[0]);
            int minor = Integer.parseInt(parts[1]);
            int patch = Integer.parseInt(parts[2]);
            return new Version(major, minor, patch);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid version format: " + versionString, e);
        }
    }
    
    public boolean isNewerThan(Version other) {
        if (this.major != other.major) {
            return this.major > other.major;
        }
        if (this.minor != other.minor) {
            return this.minor > other.minor;
        }
        return this.patch > other.patch;
    }
}