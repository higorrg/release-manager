package com.empresa.app.releasemanagement.application.service;

import com.empresa.app.releasemanagement.application.port.in.ReleaseUseCase;
import com.empresa.app.clientmanagement.application.port.in.ClientManagementUseCase;
import com.empresa.app.releasemanagement.application.port.in.ReleaseClientAssociationUseCase;
import com.empresa.app.shared.application.port.out.ProductRepository;
import com.empresa.app.releasemanagement.application.port.out.ReleaseRepository;
import com.empresa.app.releasemanagement.application.port.out.ReleaseStatusHistoryRepository;
import com.empresa.app.shared.domain.model.Product;
import com.empresa.app.releasemanagement.domain.model.Release;
import com.empresa.app.releasemanagement.domain.model.ReleaseStatus;
import com.empresa.app.releasemanagement.application.service.ReleaseManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReleaseManagementServiceTest {

    @Mock
    private ReleaseRepository releaseRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ReleaseStatusHistoryRepository statusHistoryRepository;

    @InjectMocks
    private ReleaseManagementService service;

    private Product product;
    private Release release;
    private UUID productId;
    private UUID releaseId;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        releaseId = UUID.randomUUID();
        
        product = Product.create("Plataforma Shift");
        product.setId(productId);
        
        release = Release.create(productId, "1.0.0");
        release.setId(releaseId);
    }

    @Test
    void shouldCreateReleaseFromPipelineSuccessfully() {
        // Given
        var command = new ReleaseUseCase.CreateReleaseCommand("Plataforma Shift", "1.0.0");
        
        when(productRepository.findByName("Plataforma Shift")).thenReturn(Optional.of(product));
        when(releaseRepository.existsByProductIdAndVersion(productId, "1.0.0")).thenReturn(false);
        when(releaseRepository.save(any(Release.class))).thenReturn(release);
        when(statusHistoryRepository.save(any())).thenReturn(null);

        // When
        var result = service.createReleaseFromPipeline(command);

        // Then
        assertNotNull(result);
        assertEquals("1.0.0", result.getVersion());
        assertEquals(ReleaseStatus.MR_APROVADO, result.getStatus());
        
        verify(productRepository).findByName("Plataforma Shift");
        verify(releaseRepository).existsByProductIdAndVersion(productId, "1.0.0");
        verify(releaseRepository).save(any(Release.class));
        verify(statusHistoryRepository).save(any());
    }

    @Test
    void shouldCreateProductWhenNotExists() {
        // Given
        var command = new ReleaseUseCase.CreateReleaseCommand("New Product", "1.0.0");
        var newProduct = Product.create("New Product");
        newProduct.setId(UUID.randomUUID());
        
        when(productRepository.findByName("New Product")).thenReturn(Optional.empty());
        when(productRepository.save(any(Product.class))).thenReturn(newProduct);
        when(releaseRepository.existsByProductIdAndVersion(any(), eq("1.0.0"))).thenReturn(false);
        when(releaseRepository.save(any(Release.class))).thenReturn(release);
        when(statusHistoryRepository.save(any())).thenReturn(null);

        // When
        var result = service.createReleaseFromPipeline(command);

        // Then
        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void shouldThrowExceptionWhenReleaseAlreadyExists() {
        // Given
        var command = new ReleaseUseCase.CreateReleaseCommand("Plataforma Shift", "1.0.0");
        
        when(productRepository.findByName("Plataforma Shift")).thenReturn(Optional.of(product));
        when(releaseRepository.existsByProductIdAndVersion(productId, "1.0.0")).thenReturn(true);

        // When & Then
        assertThrows(IllegalStateException.class, () -> service.createReleaseFromPipeline(command));
        
        verify(releaseRepository, never()).save(any());
        verify(statusHistoryRepository, never()).save(any());
    }

    @Test
    void shouldUpdateReleaseStatusSuccessfully() {
        // Given
        var command = new ReleaseUseCase.UpdateReleaseStatusCommand(
                releaseId, 
                ReleaseStatus.PARA_TESTE_SISTEMA, 
                "testuser", 
                "Moving to test"
        );
        
        when(releaseRepository.findById(releaseId)).thenReturn(Optional.of(release));
        when(releaseRepository.save(any(Release.class))).thenReturn(release);
        when(statusHistoryRepository.save(any())).thenReturn(null);

        // When
        var result = service.updateReleaseStatus(command);

        // Then
        assertNotNull(result);
        assertEquals(ReleaseStatus.PARA_TESTE_SISTEMA, result.getStatus());
        
        verify(releaseRepository).findById(releaseId);
        verify(releaseRepository).save(any(Release.class));
        verify(statusHistoryRepository).save(any());
    }

    @Test
    void shouldThrowExceptionWhenReleaseNotFoundForStatusUpdate() {
        // Given
        var command = new ReleaseUseCase.UpdateReleaseStatusCommand(
                releaseId, 
                ReleaseStatus.PARA_TESTE_SISTEMA, 
                "testuser", 
                null
        );
        
        when(releaseRepository.findById(releaseId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> service.updateReleaseStatus(command));
        
        verify(releaseRepository, never()).save(any());
        verify(statusHistoryRepository, never()).save(any());
    }

    @Test
    void shouldValidateInputParameters() {
        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> service.createReleaseFromPipeline(new ReleaseUseCase.CreateReleaseCommand(null, "1.0.0")));
        
        assertThrows(IllegalArgumentException.class, 
                () -> service.createReleaseFromPipeline(new ReleaseUseCase.CreateReleaseCommand("Product", null)));
        
        assertThrows(IllegalArgumentException.class, 
                () -> service.updateReleaseStatus(new ReleaseUseCase.UpdateReleaseStatusCommand(null, ReleaseStatus.MR_APROVADO, "user", null)));
    }
}