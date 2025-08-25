-- Script de inicialização para criar databases se necessário

-- O banco principal já é criado através da variável POSTGRES_DB
-- Mas podemos criar estruturas iniciais se necessário

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log de inicialização
SELECT 'Database initialized successfully' as message;