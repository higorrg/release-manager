package br.com.releasemanager.release.application.service;

import br.com.releasemanager.business_exception.BusinessException;
import br.com.releasemanager.release.application.port.in.AddClientEnvironmentCommand;
import br.com.releasemanager.release.application.port.in.ManageClientEnvironmentUseCase;
import br.com.releasemanager.release.application.port.in.RemoveClientEnvironmentCommand;
import br.com.releasemanager.release.application.port.out.ReleaseClientEnvironmentRepository;
import br.com.releasemanager.release.application.port.out.ReleaseRepository;
import br.com.releasemanager.release.domain.model.ReleaseClientEnvironment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class ManageClientEnvironmentService implements ManageClientEnvironmentUseCase {

    private final ReleaseClientEnvironmentRepository clientEnvironmentRepository;
    private final ReleaseRepository releaseRepository;

    @Inject
    public ManageClientEnvironmentService(ReleaseClientEnvironmentRepository clientEnvironmentRepository,
                                         ReleaseRepository releaseRepository) {
        this.clientEnvironmentRepository = Objects.requireNonNull(clientEnvironmentRepository);
        this.releaseRepository = Objects.requireNonNull(releaseRepository);
    }

    @Override
    public ReleaseClientEnvironment addClientEnvironment(AddClientEnvironmentCommand command) {
        Objects.requireNonNull(command, "Command cannot be null");
        Objects.requireNonNull(command.releaseId(), "Release ID cannot be null");
        Objects.requireNonNull(command.clientCode(), "Client code cannot be null");
        Objects.requireNonNull(command.environment(), "Environment cannot be null");

        // Validate that release exists
        if (!releaseRepository.findById(command.releaseId()).isPresent()) {
            throw new BusinessException(
                String.format("Release with ID %d not found", command.releaseId())
            );
        }

        // Check if association already exists
        if (clientEnvironmentRepository.existsByReleaseIdAndClientCodeAndEnvironment(
                command.releaseId(), command.clientCode(), command.environment())) {
            throw new BusinessException(
                String.format("Client '%s' is already associated with this release for environment '%s'",
                    command.clientCode(), command.environment().getDisplayName())
            );
        }

        // Create new association
        ReleaseClientEnvironment clientEnvironment = new ReleaseClientEnvironment(
            command.releaseId(),
            command.clientCode(),
            command.environment()
        );

        return clientEnvironmentRepository.save(clientEnvironment);
    }

    @Override
    public void removeClientEnvironment(RemoveClientEnvironmentCommand command) {
        Objects.requireNonNull(command, "Command cannot be null");
        Objects.requireNonNull(command.releaseId(), "Release ID cannot be null");
        Objects.requireNonNull(command.clientCode(), "Client code cannot be null");
        Objects.requireNonNull(command.environment(), "Environment cannot be null");

        // Check if association exists
        if (!clientEnvironmentRepository.existsByReleaseIdAndClientCodeAndEnvironment(
                command.releaseId(), command.clientCode(), command.environment())) {
            throw new BusinessException(
                String.format("No association found for client '%s' and environment '%s' with this release",
                    command.clientCode(), command.environment().getDisplayName())
            );
        }

        clientEnvironmentRepository.deleteByReleaseIdAndClientCodeAndEnvironment(
            command.releaseId(), command.clientCode(), command.environment()
        );
    }

    @Override
    public List<ReleaseClientEnvironment> getClientEnvironmentsByRelease(Long releaseId) {
        Objects.requireNonNull(releaseId, "Release ID cannot be null");
        return clientEnvironmentRepository.findByReleaseId(releaseId);
    }
}
