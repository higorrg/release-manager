package com.empresa.app.release.application.port.out;

import com.empresa.app.release.domain.model.Product;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository {
    
    /**
     * Salva um produto
     */
    Product save(Product product);
    
    /**
     * Busca um produto por ID
     */
    Optional<Product> findById(UUID id);
    
    /**
     * Busca um produto por nome
     */
    Optional<Product> findByName(String name);
    
    /**
     * Lista todos os produtos
     */
    List<Product> findAll();
    
    /**
     * Verifica se existe um produto com o nome especificado
     */
    boolean existsByName(String name);
}