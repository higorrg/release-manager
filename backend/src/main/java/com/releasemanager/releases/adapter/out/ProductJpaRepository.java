package com.releasemanager.releases.adapter.out;

import com.releasemanager.releases.application.port.out.ProductRepository;
import com.releasemanager.releases.domain.model.Product;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductJpaRepository implements ProductRepository, PanacheRepository<Product> {

    @Override
    public Product save(Product product) {
        persist(product);
        return product;
    }

    @Override
    public Optional<Product> findByIdOptional(Long id) {
        return Optional.ofNullable(PanacheRepository.super.findById(id));
    }

    @Override
    public Optional<Product> findByName(String name) {
        return find("name", name).firstResultOptional();
    }

    @Override
    public List<Product> getAllProducts() {
        return listAll();
    }
}