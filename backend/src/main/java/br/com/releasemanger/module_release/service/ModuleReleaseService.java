package br.com.releasemanger.module_release.service;

import java.time.LocalDateTime;

import br.com.releasemanger.business_exception.BusinessException;
import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import br.com.releasemanger.release_status.model.entity.ReleaseStatus;
import br.com.releasemanger.status_change_log.model.entity.StatusChangeLog;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

/**
 * Service for managing module releases.
 */
@ApplicationScoped
public class ModuleReleaseService {

    /**
     * Updates the status of a module release and logs the status change.
     * 
     * @param moduleReleaseId The ID of the module release to update
     * @param releaseStatusId The ID of the new release status
     * @param changedBy The user who changed the status
     * @param comments Optional comments about the status change
     * @return The updated module release
     */
    @Transactional
    public ModuleRelease updateReleaseStatus(Long moduleReleaseId, Long releaseStatusId, String changedBy, String comments) {
        // Find the module release
        ModuleRelease moduleRelease = ModuleRelease.findById(moduleReleaseId);
        if (moduleRelease == null) {
            throw new BusinessException("Module release not found with ID: " + moduleReleaseId);
        }
        
        // Find the release status
        ReleaseStatus releaseStatus = ReleaseStatus.findById(releaseStatusId);
        if (releaseStatus == null) {
            throw new BusinessException("Release status not found with ID: " + releaseStatusId);
        }
        
        // Update the module release status
        moduleRelease.setReleaseStatus(releaseStatus);
        moduleRelease.persist();
        
        // Log the status change
        StatusChangeLog statusChangeLog = StatusChangeLog.builder()
                .moduleRelease(moduleRelease)
                .releaseStatus(releaseStatus)
                .changeTimestamp(LocalDateTime.now())
                .changedBy(changedBy)
                .comments(comments)
                .build();
        statusChangeLog.persist();
        
        return moduleRelease;
    }
}