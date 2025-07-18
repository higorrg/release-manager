# Release Manager Backend Implementation

This document describes the implementation of the Release Manager backend based on the user stories and following the hexagonal architecture pattern.

## Architecture

The backend follows the hexagonal architecture pattern, which separates the application into layers:

1. **Domain Layer**: Contains the domain entities and value objects that represent the core business concepts.
2. **Application Layer**: Contains the services that implement the business logic and use cases.
3. **Infrastructure Layer**: Contains the adapters that interact with external systems (database, APIs, etc.).
4. **Interface Layer**: Contains the resources that expose the application's functionality to the outside world.

## Domain Entities

The following domain entities have been implemented:

- **ReleaseStatus**: Represents the status of a release (e.g., "MR Aprovado", "Para Teste de Sistema", etc.).
- **Platform**: Represents a platform (e.g., "Plataforma Shift").
- **Product**: Represents a product (e.g., "Plataforma Shift v8").
- **Module**: Represents a module (e.g., "Shift Core", "Pré-Atendimento").
- **Customer**: Represents a customer with a name and custom ID.
- **ModuleRelease**: Represents a release of a module with version information, release notes, prerequisites, etc.
- **StatusChangeLog**: Represents a log entry for a status change of a module release.
- **CustomerEnvironmentRelease**: Represents the relationship between a customer, environment, and a module release.

## Services

The following services have been implemented:

- **ModuleReleaseService**: Manages module releases, including updating their status.
- **CustomerEnvironmentReleaseService**: Manages the relationships between customers, environments, and module releases.
- **ModuleReleaseRegistrationService**: Handles the registration of new module releases from the pipeline.
- **ModuleReleaseAvailabilityService**: Provides information about available module releases for customers and environments.

## Resources

The following resources have been implemented:

- **ReleaseStatusResource**: Exposes CRUD operations for release statuses.
- **PlatformResource**: Exposes CRUD operations for platforms.
- **ProductResource**: Exposes CRUD operations for products.
- **ModuleResource**: Exposes CRUD operations for modules.
- **CustomerResource**: Exposes CRUD operations for customers.
- **ModuleReleaseResource**: Exposes CRUD operations for module releases.
- **ModuleReleaseStatusResource**: Exposes operations for updating the status of a module release.
- **StatusChangeLogResource**: Exposes CRUD operations for status change logs.
- **CustomerEnvironmentReleaseResource**: Exposes CRUD operations for customer environment releases.
- **CustomerEnvironmentReleaseCustomResource**: Exposes custom operations for managing customer environment releases.
- **ModuleReleaseRegistrationResource**: Exposes operations for registering new module releases from the pipeline.
- **ModuleReleaseAvailabilityResource**: Exposes operations for retrieving available module releases for customers and environments.

## User Stories Implementation

### US-02: Control release status

- Implemented `ModuleReleaseService.updateReleaseStatus()` to update the status of a module release.
- Implemented `ModuleReleaseStatusResource` to expose this functionality as a REST endpoint.

### US-03: Log status changes

- Implemented `StatusChangeLog` entity to track status changes.
- Modified `ModuleReleaseService.updateReleaseStatus()` to log status changes.
- Implemented `StatusChangeLogResource` to expose CRUD operations for status change logs.

### US-04: Relate releases to client codes and environments

- Implemented `CustomerEnvironmentRelease` entity to represent the relationship between a customer, environment, and a module release.
- Implemented `CustomerEnvironmentReleaseService` to manage these relationships.
- Implemented `CustomerEnvironmentReleaseCustomResource` to expose this functionality as REST endpoints.

### US-05: Automatic registration of releases via pipeline

- Implemented `ModuleReleaseRegistrationService` to handle the registration of new module releases from the pipeline.
- Implemented `ModuleReleaseRegistrationResource` to expose this functionality as a REST endpoint.

### US-06: List available versions

- Implemented `ModuleReleaseAvailabilityService` to provide information about available module releases for customers and environments.
- Implemented `ModuleReleaseAvailabilityResource` to expose this functionality as REST endpoints.

### US-07: Provide installable package

- Implemented `ModuleReleaseAvailabilityService.getModuleReleaseDownloadUrl()` to provide the download URL for a module release.
- Implemented `ModuleReleaseAvailabilityResource.getModuleReleaseDownloadUrl()` to expose this functionality as a REST endpoint.

## Database Schema

The database schema has been updated to include the following tables:

- **RELEASE_STATUS**: Stores the different statuses a release can have.
- **PLATAFORM**: Stores platform information.
- **PRODUCT**: Stores product information.
- **MODULE**: Stores module information.
- **CUSTOMER**: Stores customer information.
- **MODULE_RELEASE**: Stores release information for modules.
- **STATUS_CHANGE_LOG**: Stores the history of status changes for module releases.
- **CUSTOMER_ENVIRONMENT_RELEASE**: Stores the relationships between customers, environments, and module releases.

## Conclusion

The backend implementation satisfies all the user stories and follows the hexagonal architecture pattern. It provides a solid foundation for the Release Manager application and can be extended to support additional functionality in the future.