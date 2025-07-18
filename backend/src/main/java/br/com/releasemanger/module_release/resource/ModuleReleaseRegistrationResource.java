package br.com.releasemanger.module_release.resource;

import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import br.com.releasemanger.module_release.service.ModuleReleaseRegistrationService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Resource for registering new module releases from the pipeline.
 */
@Path("/module-releases/register")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModuleReleaseRegistrationResource {

    @Inject
    ModuleReleaseRegistrationService moduleReleaseRegistrationService;

    /**
     * Registers a new module release from the pipeline.
     * 
     * @param registrationRequest The registration request containing the module ID, version numbers, artifact location, release notes, and prerequisites
     * @return The created module release
     */
    @POST
    public Response registerModuleRelease(RegistrationRequest registrationRequest) {
        ModuleRelease moduleRelease = moduleReleaseRegistrationService.registerModuleRelease(
                registrationRequest.getModuleId(),
                registrationRequest.getMajorVersion(),
                registrationRequest.getMinorVersion(),
                registrationRequest.getPatchVersion(),
                registrationRequest.getRevisionVersion(),
                registrationRequest.getArtifactLocation(),
                registrationRequest.getReleaseNotes(),
                registrationRequest.getPrerequisite());
        
        return Response.ok(moduleRelease).build();
    }

    /**
     * Request object for registering a new module release.
     */
    public static class RegistrationRequest {
        private Long moduleId;
        private Integer majorVersion;
        private Integer minorVersion;
        private Integer patchVersion;
        private Integer revisionVersion;
        private String artifactLocation;
        private String releaseNotes;
        private String prerequisite;
        
        public Long getModuleId() {
            return moduleId;
        }
        
        public void setModuleId(Long moduleId) {
            this.moduleId = moduleId;
        }
        
        public Integer getMajorVersion() {
            return majorVersion;
        }
        
        public void setMajorVersion(Integer majorVersion) {
            this.majorVersion = majorVersion;
        }
        
        public Integer getMinorVersion() {
            return minorVersion;
        }
        
        public void setMinorVersion(Integer minorVersion) {
            this.minorVersion = minorVersion;
        }
        
        public Integer getPatchVersion() {
            return patchVersion;
        }
        
        public void setPatchVersion(Integer patchVersion) {
            this.patchVersion = patchVersion;
        }
        
        public Integer getRevisionVersion() {
            return revisionVersion;
        }
        
        public void setRevisionVersion(Integer revisionVersion) {
            this.revisionVersion = revisionVersion;
        }
        
        public String getArtifactLocation() {
            return artifactLocation;
        }
        
        public void setArtifactLocation(String artifactLocation) {
            this.artifactLocation = artifactLocation;
        }
        
        public String getReleaseNotes() {
            return releaseNotes;
        }
        
        public void setReleaseNotes(String releaseNotes) {
            this.releaseNotes = releaseNotes;
        }
        
        public String getPrerequisite() {
            return prerequisite;
        }
        
        public void setPrerequisite(String prerequisite) {
            this.prerequisite = prerequisite;
        }
    }
}