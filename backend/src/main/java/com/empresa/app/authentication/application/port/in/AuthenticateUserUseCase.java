package com.empresa.app.authentication.application.port.in;

import com.empresa.app.authentication.domain.model.Email;
import com.empresa.app.authentication.domain.model.Password;

public interface AuthenticateUserUseCase {
    
    String authenticate(AuthenticateCommand command);
    
    record AuthenticateCommand(
        Email email,
        Password password
    ) {}
}