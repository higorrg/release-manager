package br.com.releasemanager.release.adapter.in.rest;

public record ChangeStatusRequest(
    String newStatus,
    String changedBy,
    String notes
) {}