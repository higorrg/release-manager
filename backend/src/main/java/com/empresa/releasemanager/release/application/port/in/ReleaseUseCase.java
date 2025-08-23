package com.empresa.releasemanager.release.application.port.in;

import com.empresa.releasemanager.release.domain.model.Environment;
import com.empresa.releasemanager.release.domain.model.Release;
import com.empresa.releasemanager.release.domain.model.ReleaseStatus;
import com.empresa.releasemanager.release.domain.model.VersionType;

import java.util.List;
import java.util.Optional;

public interface ReleaseUseCase {
    
    Release createRelease(CreateReleaseCommand command);
    
    void updateReleaseStatus(UpdateStatusCommand command);
    
    void addClientToRelease(AddClientCommand command);
    
    void removeClientFromRelease(RemoveClientCommand command);
    
    Optional<Release> findReleaseByProductAndVersion(String productName, String version);
    
    List<Release> findAllReleases();
    
    List<Release> findReleasesByStatus(ReleaseStatus status);
    
    List<Release> findAvailableReleasesForClient(String clientCode, Environment environment);
    
    List<Release> findReleasesByProduct(String productName);

    record CreateReleaseCommand(
        String productName,
        String version,
        VersionType versionType,
        String branchName,
        String commitHash,
        String createdBy
    ) {}

    record UpdateStatusCommand(
        Long releaseId,
        ReleaseStatus newStatus,
        String reason,
        String updatedBy
    ) {}

    record AddClientCommand(
        Long releaseId,
        String clientCode,
        Environment environment
    ) {}

    record RemoveClientCommand(
        Long releaseId,
        String clientCode,
        Environment environment
    ) {}
}