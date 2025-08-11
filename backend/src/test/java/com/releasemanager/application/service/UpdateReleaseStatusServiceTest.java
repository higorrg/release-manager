package com.releasemanager.application.service;

import com.releasemanager.application.port.out.ReleaseRepository;
import com.releasemanager.application.port.out.ReleaseStatusLogRepository;
import com.releasemanager.domain.model.Environment;
import com.releasemanager.domain.model.Release;
import com.releasemanager.domain.model.ReleaseClient;
import com.releasemanager.domain.model.ReleaseId;
import com.releasemanager.domain.model.ReleaseStatus;
import com.releasemanager.domain.model.ReleaseStatusLog;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UpdateReleaseStatusServiceTest {

    @Test
    void shouldLogStatusChange() {
        FakeReleaseRepository repo = new FakeReleaseRepository();
        FakeLogRepository logRepo = new FakeLogRepository();
        UpdateReleaseStatusService service = new UpdateReleaseStatusService();
        service.releaseRepository = repo;
        service.logRepository = logRepo;

        ReleaseId id = new ReleaseId(UUID.randomUUID());
        service.updateStatus(id, ReleaseStatus.CONTROLADA);

        assertEquals(ReleaseStatus.CONTROLADA, repo.status);
        assertEquals(1, logRepo.logs.size());
        assertEquals(ReleaseStatus.CONTROLADA, logRepo.logs.getFirst().status());
    }

    static class FakeReleaseRepository implements ReleaseRepository {
        ReleaseStatus status;
        @Override public Release save(Release release) { return release; }
        @Override public Optional<Release> findById(ReleaseId id) { return Optional.empty(); }
        @Override public void updateStatus(ReleaseId id, ReleaseStatus status) { this.status = status; }
        @Override public void addClient(ReleaseId id, ReleaseClient client) { }
        @Override public List<Release> findAvailableByClientAndEnvironment(String clientCode, Environment environment) { return List.of(); }
    }

    static class FakeLogRepository implements ReleaseStatusLogRepository {
        List<ReleaseStatusLog> logs = new ArrayList<>();
        @Override public void log(ReleaseStatusLog log) { logs.add(log); }
    }
}
