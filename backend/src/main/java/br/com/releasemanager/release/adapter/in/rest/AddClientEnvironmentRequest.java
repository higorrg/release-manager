package br.com.releasemanager.release.adapter.in.rest;

public record AddClientEnvironmentRequest(
    String clientCode,
    String environment
) {}