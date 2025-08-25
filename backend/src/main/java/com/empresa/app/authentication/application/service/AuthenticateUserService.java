package com.empresa.app.authentication.application.service;

import com.empresa.app.authentication.application.port.in.AuthenticateUserUseCase;
import com.empresa.app.authentication.application.port.out.PasswordEncoder;
import com.empresa.app.authentication.application.port.out.TokenGenerator;
import com.empresa.app.authentication.application.port.out.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Objects;

@ApplicationScoped
public class AuthenticateUserService implements AuthenticateUserUseCase {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenGenerator tokenGenerator;
    
    @Inject
    public AuthenticateUserService(UserRepository userRepository, 
                                  PasswordEncoder passwordEncoder,
                                  TokenGenerator tokenGenerator) {
        this.userRepository = Objects.requireNonNull(userRepository);
        this.passwordEncoder = Objects.requireNonNull(passwordEncoder);
        this.tokenGenerator = Objects.requireNonNull(tokenGenerator);
    }
    
    @Override
    public String authenticate(AuthenticateCommand command) {
        Objects.requireNonNull(command, "AuthenticateCommand cannot be null");
        
        var user = userRepository.findByEmail(command.email())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
            
        if (!user.isActive()) {
            throw new IllegalArgumentException("User account is deactivated");
        }
        
        if (!passwordEncoder.matches(command.password().value(), user.getHashedPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        return tokenGenerator.generateToken(user);
    }
}