--liquibase formatted sql

--changeset higor:1
create table if not exists RELEASE_STATUS (
  id bigserial not null primary key,
  name varchar(60) not null
);

--changeset higor:2
insert into RELEASE_STATUS (NAME) values ('MR Aprovado');
insert into RELEASE_STATUS (NAME) values ('Falha no Build para Teste');
insert into RELEASE_STATUS (NAME) values ('Para Teste de Sistema');
insert into RELEASE_STATUS (NAME) values ('Reprovada no teste');
insert into RELEASE_STATUS (NAME) values ('Aprovada no teste');
insert into RELEASE_STATUS (NAME) values ('Falha no Build para Produção');
insert into RELEASE_STATUS (NAME) values ('Para Teste Regressivo');
insert into RELEASE_STATUS (NAME) values ('Falha na instalação da Estável');
insert into RELEASE_STATUS (NAME) values ('Interno');
insert into RELEASE_STATUS (NAME) values ('Revogada');
insert into RELEASE_STATUS (NAME) values ('Reprovada no teste regressivo');
insert into RELEASE_STATUS (NAME) values ('Aprovada no teste regressivo');
insert into RELEASE_STATUS (NAME) values ('Controlada');
insert into RELEASE_STATUS (NAME) values ('Disponível');

--changeset higor:4
create table if not exists PLATAFORM (
  id bigserial not null primary key,
  name varchar(60) not null
);

--changeset higor:4.1
INSERT INTO PLATAFORM (name) VALUES('Plataforma Shift');

--changeset higor:5
create table if not exists PRODUCT (
  id bigserial not null primary key,
  name varchar(60) not null
);

--changeset higor:5.1
INSERT INTO PRODUCT (name) VALUES('Plataforma Shift v8');

--changeset higor:6
create table if not exists MODULE (
  id bigserial not null primary key,
  name varchar(60) not null
);

--changeset higor:6.1
INSERT INTO MODULE (name) VALUES('Shift Core');
INSERT INTO MODULE (name) VALUES('Pré-Atendimento');

--changeset higor:7
create table if not exists CUSTOMER (
  id bigserial not null primary key,
  name varchar(80) not null,
  custom_customer_id varchar(20)
);

--changeset higor:7.1
insert into CUSTOMER (name, custom_customer_id) values ('Laboratory 99900', '99900');

--changeset higor:8
create table if not exists MODULE_RELEASE(
  id bigserial not null primary key,
  module_id bigint references MODULE(id) not null,
  RELEASE_STATUS_id bigint references RELEASE_STATUS(id) not null,
  artifact_location varchar(255),
  version_created_timestamp timestamp default 'now',
  major_version int,
  minor_version int,
  patch_version int,
  revision_version int,
  release_notes text,
  prerequisite text
);
