package com.releasemanager.releases.adapter.out;

import com.releasemanager.releases.application.port.out.ReleaseRepository;
import com.releasemanager.releases.domain.model.Release;
import com.releasemanager.releases.domain.model.ReleaseStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ReleaseJpaRepository implements ReleaseRepository, PanacheRepository<Release> {

    @Override
    public Release save(Release release) {
        persist(release);
        return release;
    }

    @Override
    public Optional<Release> findByIdOptional(Long id) {
        return Optional.ofNullable(PanacheRepository.super.findById(id));
    }

    @Override
    public Optional<Release> findByProductNameAndVersion(String productName, String version) {
        return find("product.name = ?1 and version = ?2", productName, version)
            .firstResultOptional();
    }

    @Override
    public List<Release> getAllReleases() {
        return listAll();
    }

    @Override
    public List<Release> findByStatus(ReleaseStatus status) {
        return list("status", status);
    }

    @Override
    public List<Release> findByProductName(String productName) {
        return list("product.name", productName);
    }

    @Override
    public List<Release> findWithPagination(int page, int size) {
        return find("").page(page, size).list();
    }

    @Override
    public long countAll() {
        return PanacheRepository.super.count();
    }

    @Override
    public long countByStatus(ReleaseStatus status) {
        return count("status", status);
    }
}