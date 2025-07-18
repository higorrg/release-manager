package br.com.releasemanger.module_release.resource;

import java.util.List;
import java.util.stream.Collectors;

import br.com.releasemanger.customer_environment_release.model.entity.CustomerEnvironmentRelease.Environment;
import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import br.com.releasemanger.module_release.service.ModuleReleaseAvailabilityService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Resource for managing module release availability.
 */
@Path("/module-releases/available")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModuleReleaseAvailabilityResource {

    @Inject
    ModuleReleaseAvailabilityService moduleReleaseAvailabilityService;

    /**
     * Gets all available module releases for a customer and environment.
     * 
     * @param customerId The ID of the customer
     * @param environment The environment (HOMOLOGATION or PRODUCTION)
     * @return List of available module releases with version info, release notes, prerequisites, and download URL
     */
    @GET
    @Path("/by-customer/{customerId}")
    public Response getAvailableModuleReleases(
            @PathParam("customerId") Long customerId,
            @QueryParam("environment") Environment environment) {
        
        List<ModuleRelease> moduleReleases = moduleReleaseAvailabilityService.getAvailableModuleReleases(customerId, environment);
        List<ModuleReleaseInfo> moduleReleaseInfos = moduleReleases.stream()
                .map(this::convertToModuleReleaseInfo)
                .collect(Collectors.toList());
        
        return Response.ok(moduleReleaseInfos).build();
    }
    
    /**
     * Gets all available module releases for a customer by custom customer ID and environment.
     * 
     * @param customCustomerId The custom ID of the customer
     * @param environment The environment (HOMOLOGATION or PRODUCTION)
     * @return List of available module releases with version info, release notes, prerequisites, and download URL
     */
    @GET
    @Path("/by-custom-customer-id/{customCustomerId}")
    public Response getAvailableModuleReleasesByCustomCustomerId(
            @PathParam("customCustomerId") String customCustomerId,
            @QueryParam("environment") Environment environment) {
        
        List<ModuleRelease> moduleReleases = moduleReleaseAvailabilityService.getAvailableModuleReleasesByCustomCustomerId(customCustomerId, environment);
        List<ModuleReleaseInfo> moduleReleaseInfos = moduleReleases.stream()
                .map(this::convertToModuleReleaseInfo)
                .collect(Collectors.toList());
        
        return Response.ok(moduleReleaseInfos).build();
    }
    
    /**
     * Gets the download URL for a module release.
     * 
     * @param moduleReleaseId The ID of the module release
     * @return The download URL
     */
    @GET
    @Path("/{moduleReleaseId}/download-url")
    public Response getModuleReleaseDownloadUrl(@PathParam("moduleReleaseId") Long moduleReleaseId) {
        String downloadUrl = moduleReleaseAvailabilityService.getModuleReleaseDownloadUrl(moduleReleaseId);
        if (downloadUrl == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        return Response.ok(new DownloadUrlResponse(downloadUrl)).build();
    }
    
    /**
     * Converts a ModuleRelease to a ModuleReleaseInfo.
     * 
     * @param moduleRelease The module release to convert
     * @return The module release info
     */
    private ModuleReleaseInfo convertToModuleReleaseInfo(ModuleRelease moduleRelease) {
        String version = String.format("%d.%d.%d.%d",
                moduleRelease.getMajorVersion(),
                moduleRelease.getMinorVersion(),
                moduleRelease.getPatchVersion(),
                moduleRelease.getRevisionVersion());
        
        return new ModuleReleaseInfo(
                moduleRelease.id,
                moduleRelease.getModule().getName(),
                version,
                moduleRelease.getReleaseNotes(),
                moduleRelease.getPrerequisite(),
                moduleRelease.getArtifactLocation());
    }
    
    /**
     * Response object for module release info.
     */
    public static class ModuleReleaseInfo {
        private Long id;
        private String moduleName;
        private String version;
        private String releaseNotes;
        private String prerequisite;
        private String downloadUrl;
        
        public ModuleReleaseInfo(Long id, String moduleName, String version, String releaseNotes, String prerequisite, String downloadUrl) {
            this.id = id;
            this.moduleName = moduleName;
            this.version = version;
            this.releaseNotes = releaseNotes;
            this.prerequisite = prerequisite;
            this.downloadUrl = downloadUrl;
        }
        
        public Long getId() {
            return id;
        }
        
        public String getModuleName() {
            return moduleName;
        }
        
        public String getVersion() {
            return version;
        }
        
        public String getReleaseNotes() {
            return releaseNotes;
        }
        
        public String getPrerequisite() {
            return prerequisite;
        }
        
        public String getDownloadUrl() {
            return downloadUrl;
        }
    }
    
    /**
     * Response object for download URL.
     */
    public static class DownloadUrlResponse {
        private String downloadUrl;
        
        public DownloadUrlResponse(String downloadUrl) {
            this.downloadUrl = downloadUrl;
        }
        
        public String getDownloadUrl() {
            return downloadUrl;
        }
    }
}