-- Criação do banco para Keycloak
CREATE DATABASE keycloak;

-- Conectar ao banco principal
\c releasemanager;

-- Criação das tabelas principais
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    version VARCHAR(100) NOT NULL,
    major_version INTEGER NOT NULL,
    minor_version INTEGER NOT NULL,
    patch_version INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'MR_APROVADO',
    release_notes TEXT,
    prerequisites TEXT,
    download_url VARCHAR(500),
    package_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, version)
);

CREATE TABLE IF NOT EXISTS release_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comments TEXT
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS release_client_environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    environment_id UUID NOT NULL REFERENCES environments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(release_id, client_id, environment_id)
);

-- Índices para performance
CREATE INDEX idx_releases_product_id ON releases(product_id);
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_version ON releases(version);
CREATE INDEX idx_release_status_history_release_id ON release_status_history(release_id);
CREATE INDEX idx_release_status_history_changed_at ON release_status_history(changed_at);
CREATE INDEX idx_release_client_environments_release_id ON release_client_environments(release_id);
CREATE INDEX idx_release_client_environments_client_id ON release_client_environments(client_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserção dos ambientes padrão
INSERT INTO environments (name, description) VALUES 
    ('HOMOLOGACAO', 'Ambiente de homologação para testes'),
    ('PRODUCAO', 'Ambiente de produção')
ON CONFLICT (name) DO NOTHING;

-- Dados de exemplo para desenvolvimento
INSERT INTO products (name, description) VALUES 
    ('Plataforma Shift', 'Plataforma principal do sistema')
ON CONFLICT (name) DO NOTHING;

INSERT INTO clients (client_code, name, description) VALUES 
    ('CLIENT001', 'Cliente Exemplo 1', 'Cliente de exemplo para desenvolvimento'),
    ('CLIENT002', 'Cliente Exemplo 2', 'Cliente de exemplo para desenvolvimento')
ON CONFLICT (client_code) DO NOTHING;
