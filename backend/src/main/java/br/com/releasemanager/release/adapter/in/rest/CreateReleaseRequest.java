package br.com.releasemanager.release.adapter.in.rest;

public record CreateReleaseRequest(
    String productName,
    int versionMajor,
    int versionMinor,
    int versionPatch,
    String releaseNotes,
    String prerequisites,
    String downloadUrl
) {}