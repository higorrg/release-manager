package com.releasemanager.domain.model;

import java.time.Instant;

public record ReleaseStatusLog(ReleaseId releaseId, ReleaseStatus status, Instant changedAt) {}
