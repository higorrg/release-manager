package br.com.releasemanger.module_release.resource;

import br.com.releasemanger.module_release.model.entity.ModuleRelease;
import br.com.releasemanger.module_release.service.ModuleReleaseService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Resource for managing module release status changes.
 */
@Path("/module-releases")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModuleReleaseStatusResource {

    @Inject
    ModuleReleaseService moduleReleaseService;

    /**
     * Updates the status of a module release.
     * 
     * @param id The ID of the module release to update
     * @param statusUpdateRequest The status update request containing the new status ID, changed by, and comments
     * @return The updated module release
     */
    @POST
    @Path("/{id}/status")
    public Response updateStatus(@PathParam("id") Long id, StatusUpdateRequest statusUpdateRequest) {
        ModuleRelease updatedRelease = moduleReleaseService.updateReleaseStatus(
                id, 
                statusUpdateRequest.getStatusId(), 
                statusUpdateRequest.getChangedBy(), 
                statusUpdateRequest.getComments());
        
        return Response.ok(updatedRelease).build();
    }

    /**
     * Request object for updating the status of a module release.
     */
    public static class StatusUpdateRequest {
        private Long statusId;
        private String changedBy;
        private String comments;

        public Long getStatusId() {
            return statusId;
        }

        public void setStatusId(Long statusId) {
            this.statusId = statusId;
        }

        public String getChangedBy() {
            return changedBy;
        }

        public void setChangedBy(String changedBy) {
            this.changedBy = changedBy;
        }

        public String getComments() {
            return comments;
        }

        public void setComments(String comments) {
            this.comments = comments;
        }
    }
}