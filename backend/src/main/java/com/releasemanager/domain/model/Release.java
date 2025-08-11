package com.releasemanager.domain.model;

import java.util.Set;

public record Release(ReleaseId id, String productName, String version, ReleaseStatus status, Set<ReleaseClient> clients) {}
