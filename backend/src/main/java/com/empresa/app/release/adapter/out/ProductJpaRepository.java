package com.empresa.app.release.adapter.out;

import com.empresa.app.release.application.port.out.ProductRepository;
import com.empresa.app.release.domain.model.Product;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ProductJpaRepository implements ProductRepository {

    @Override
    @Transactional
    public Product save(Product product) {
        var entity = ProductEntity.findById(product.getId());
        if (entity != null) {
            var existingEntity = (ProductEntity) entity;
            existingEntity.updateFrom(product);
            existingEntity.persist();
            return existingEntity.toDomain();
        } else {
            var newEntity = ProductEntity.from(product);
            newEntity.persist();
            return newEntity.toDomain();
        }
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return ProductEntity.<ProductEntity>findByIdOptional(id)
                .map(ProductEntity::toDomain);
    }

    @Override
    public Optional<Product> findByName(String name) {
        return ProductEntity.<ProductEntity>find("name = ?1", name)
                .firstResultOptional()
                .map(ProductEntity::toDomain);
    }

    @Override
    public List<Product> findAll() {
        return ProductEntity.<ProductEntity>findAll()
                .stream()
                .map(ProductEntity::toDomain)
                .toList();
    }

    @Override
    public boolean existsByName(String name) {
        return ProductEntity.count("name = ?1", name) > 0;
    }
}