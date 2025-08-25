package com.empresa.app.authentication.application.port.in;

import com.empresa.app.authentication.domain.model.Email;
import com.empresa.app.authentication.domain.model.Password;
import com.empresa.app.authentication.domain.model.User;
import com.empresa.app.shared.domain.UserRole;

public interface CreateUserUseCase {
    
    User create(CreateUserCommand command);
    
    record CreateUserCommand(
        Email email,
        Password password,
        Password confirmPassword,
        UserRole role
    ) {
        public CreateUserCommand {
            if (!password.equals(confirmPassword)) {
                throw new IllegalArgumentException("Password and confirmation do not match");
            }
        }
    }
}