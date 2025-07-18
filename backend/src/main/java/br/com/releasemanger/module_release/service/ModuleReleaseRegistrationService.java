package br.com.releasemanger.module_release.service;

import java.time.LocalDateTime;

import br.com.releasemanger.business_exception.BusinessException;
import br.com.releasemanger.module.model.entity.Module;
import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import br.com.releasemanger.release_status.model.entity.ReleaseStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

/**
 * Service for registering new module releases.
 */
@ApplicationScoped
public class ModuleReleaseRegistrationService {

    private static final String MR_APPROVED_STATUS = "MR Aprovado";

    /**
     * Registers a new module release from the pipeline.
     * 
     * @param moduleId The ID of the module
     * @param majorVersion The major version number
     * @param minorVersion The minor version number
     * @param patchVersion The patch version number
     * @param revisionVersion The revision version number
     * @param artifactLocation The location of the artifact
     * @param releaseNotes The release notes
     * @param prerequisite The prerequisites for the release
     * @return The created module release
     */
    @Transactional
    public ModuleRelease registerModuleRelease(
            Long moduleId,
            Integer majorVersion,
            Integer minorVersion,
            Integer patchVersion,
            Integer revisionVersion,
            String artifactLocation,
            String releaseNotes,
            String prerequisite) {
        
        // Find the module
        Module module = Module.findById(moduleId);
        if (module == null) {
            throw new BusinessException("Module not found with ID: " + moduleId);
        }
        
        // Find the "MR Aprovado" status
        ReleaseStatus mrApprovedStatus = ReleaseStatus.find("name", MR_APPROVED_STATUS).firstResult();
        if (mrApprovedStatus == null) {
            throw new BusinessException("Release status not found with name: " + MR_APPROVED_STATUS);
        }
        
        // Create the module release
        ModuleRelease moduleRelease = ModuleRelease.builder()
                .module(module)
                .releaseStatus(mrApprovedStatus)
                .majorVersion(majorVersion)
                .minorVersion(minorVersion)
                .patchVersion(patchVersion)
                .revisionVersion(revisionVersion)
                .artifactLocation(artifactLocation)
                .versionCreatedTimestamp(LocalDateTime.now())
                .releaseNotes(releaseNotes)
                .prerequisite(prerequisite)
                .build();
        moduleRelease.persist();
        
        return moduleRelease;
    }
}