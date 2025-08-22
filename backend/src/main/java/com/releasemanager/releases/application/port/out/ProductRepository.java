package com.releasemanager.releases.application.port.out;

import com.releasemanager.releases.domain.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    
    Product save(Product product);
    Optional<Product> findByIdOptional(Long id);
    Optional<Product> findByName(String name);
    List<Product> getAllProducts();
}