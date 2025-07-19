--liquibase formatted sql

--changeset release-manager:1
CREATE TABLE releases (
    id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    version_major INTEGER NOT NULL,
    version_minor INTEGER NOT NULL,
    version_patch INTEGER NOT NULL,
    version_full VARCHAR(50) NOT NULL,
    current_status VARCHAR(50) NOT NULL DEFAULT 'MR_APROVADO',
    release_notes TEXT,
    prerequisites TEXT,
    download_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_name, version_full)
);

--changeset release-manager:2
CREATE TABLE release_status_history (
    id BIGSERIAL PRIMARY KEY,
    release_id BIGINT NOT NULL REFERENCES releases(id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

--changeset release-manager:3
CREATE TABLE release_client_environments (
    id BIGSERIAL PRIMARY KEY,
    release_id BIGINT NOT NULL REFERENCES releases(id),
    client_code VARCHAR(100) NOT NULL,
    environment VARCHAR(20) NOT NULL CHECK (environment IN ('HOMOLOGACAO', 'PRODUCAO')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(release_id, client_code, environment)
);

--changeset release-manager:4
CREATE INDEX idx_releases_product_version ON releases(product_name, version_full);
CREATE INDEX idx_releases_status ON releases(current_status);
CREATE INDEX idx_release_status_history_release_id ON release_status_history(release_id);
CREATE INDEX idx_release_status_history_changed_at ON release_status_history(changed_at);
CREATE INDEX idx_release_client_environments_release_id ON release_client_environments(release_id);
CREATE INDEX idx_release_client_environments_client_code ON release_client_environments(client_code, environment);
