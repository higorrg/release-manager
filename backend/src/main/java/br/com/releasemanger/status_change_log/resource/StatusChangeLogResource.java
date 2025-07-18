package br.com.releasemanger.status_change_log.resource;

import br.com.releasemanger.status_change_log.model.entity.StatusChangeLog;
import io.quarkus.hibernate.orm.rest.data.panache.PanacheEntityResource;
import io.quarkus.rest.data.panache.ResourceProperties;

/**
 * Resource for managing status change logs.
 */
@ResourceProperties(path = "status-change-logs")
public interface StatusChangeLogResource extends PanacheEntityResource<StatusChangeLog, Long> {
    // PanacheEntityResource provides all the CRUD operations automatically
}