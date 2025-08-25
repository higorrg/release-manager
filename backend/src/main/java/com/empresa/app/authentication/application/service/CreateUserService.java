package com.empresa.app.authentication.application.service;

import com.empresa.app.authentication.application.port.in.CreateUserUseCase;
import com.empresa.app.authentication.application.port.out.PasswordEncoder;
import com.empresa.app.authentication.application.port.out.UserRepository;
import com.empresa.app.authentication.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Objects;

@ApplicationScoped
public class CreateUserService implements CreateUserUseCase {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Inject
    public CreateUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = Objects.requireNonNull(userRepository);
        this.passwordEncoder = Objects.requireNonNull(passwordEncoder);
    }
    
    @Override
    @Transactional
    public User create(CreateUserCommand command) {
        Objects.requireNonNull(command, "CreateUserCommand cannot be null");
        
        if (userRepository.existsByEmail(command.email())) {
            throw new IllegalArgumentException("User with email " + command.email() + " already exists");
        }
        
        var hashedPassword = passwordEncoder.encode(command.password().value());
        var user = User.create(command.email(), hashedPassword, command.role());
        
        return userRepository.save(user);
    }
}