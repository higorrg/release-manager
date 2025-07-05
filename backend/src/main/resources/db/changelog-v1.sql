--liquibase formatted sql

--changeset higor:1
create table if not exists VERSION_STATUS (
  id bigserial not null primary key,
  name varchar(60) not null
);

--changeset higor:2
insert into VERSION_STATUS (NAME) values ('Internal');
insert into VERSION_STATUS (NAME) values ('Canary');
insert into VERSION_STATUS (NAME) values ('Revoked');
insert into VERSION_STATUS (NAME) values ('General Availability');
insert into VERSION_STATUS (NAME) values ('Deprecated');

--changeset higor:3
create table if not exists STAKEHOLDER (
  id bigserial not null primary key,
  name varchar(60) not null,
  stakeholder_role varchar(60),
  email varchar(100)
);

--changeset higor:3.1
INSERT INTO STAKEHOLDER
(name, stakeholder_role, email)
VALUES('Cesar Cruz', 'Helpdesk', 'cesar.cruz@shift.com.br');

--changeset higor:3.2
INSERT INTO STAKEHOLDER
(name, stakeholder_role, email)
VALUES('Higor Granzoto', 'Helpdesk', 'higor.granzoto@shift.com.br');

--changeset higor:3.3
INSERT INTO STAKEHOLDER
(name, stakeholder_role, email)
VALUES('InterSystems Expert', 'Expert', 'expert@intersystems.com');

--changeset higor:4
create table if not exists STAKEHOLDER_STATUSVERSION (
  stakeholder_id bigint not null references STAKEHOLDER(id),
  status_version_id bigint not null references VERSION_STATUS(id),
  primary key (stakeholder_id,status_version_id)
);

--changeset higor:4.1
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(1, 1);

--changeset higor:4.2
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(1, 2);

--changeset higor:4.3
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(2, 1);

--changeset higor:4.4
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(3, 1);

--changeset higor:4.5
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(3, 2);

--changeset higor:4.6
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(3, 3);

--changeset higor:4.7
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(3, 4);

--changeset higor:4.8
INSERT INTO STAKEHOLDER_STATUSVERSION
(stakeholder_id, status_version_id)
VALUES(3, 5);

--changeset higor:5
create table if not exists PRODUCT (
  id bigserial not null primary key,
  name varchar(60) not null,
  major_version int,
  minor_version int,
  patch_version int,
  revision_version int
);

--changeset higor:5.1
INSERT INTO PRODUCT
(name, major_version, minor_version, patch_version, revision_version)
VALUES('LIS - Laboratory Information System v7', 7, 0, 0, 0);

--changeset higor:5.2
INSERT INTO PRODUCT
(name, major_version, minor_version, patch_version, revision_version)
VALUES('Diagnostic Center v8', 8, 0, 0, 0);

--changeset higor:6
create table if not exists CUSTOMER (
  id bigserial not null primary key,
  name varchar(80) not null,
  custom_customer_id varchar(80),
  current_major_version int,
  current_minor_version int,
  current_patch_version int,
  current_revision_version int
);

--changeset higor:6.1
insert into CUSTOMER 
(name, custom_customer_id)
values
('Laboratory 99900', '99900');

--changeset higor:7
create table if not exists PRODUCT_VERSION_DELIVERY(
  id bigserial not null primary key,
  product_id bigint references PRODUCT(id) not null,
  version_status_id bigint references VERSION_STATUS(id) not null,
  artifact_location varchar(255),
  username varchar(80),
  version_created_timestamp timestamp default 'now',
  major_version int,
  minor_version int,
  patch_version int,
  revision_version int,
  release_notes text,
  prerequisite text
);

--changeset higor:8
create table if not exists DEPLOYMENT_STATUS(
  id bigserial not null primary key,
  name varchar(60) not null
);

--changeset higor:8.1
insert into DEPLOYMENT_STATUS (NAME) values ('Download In Progress');
insert into DEPLOYMENT_STATUS (NAME) values ('Deployment In Progress');
insert into DEPLOYMENT_STATUS (NAME) values ('Deployment Success');
insert into DEPLOYMENT_STATUS (NAME) values ('Deployment Fail');

--changeset higor:9
create table if not exists PRODUCT_VERSION_DEPLOYMENT(
  id bigserial not null primary key,
  product_id bigint references PRODUCT(id) not null,
  customer_id bigint references CUSTOMER(id) not null,
  version_id bigint references PRODUCT_VERSION_DELIVERY not null,
  download_start timestamp default 'now',
  download_end timestamp,
  download_time bigint,
  deployment_start timestamp,
  deployment_end timestamp,
  deployment_time bigint,
  deployment_status bigint references DEPLOYMENT_STATUS(id) not null default 1
);

--changeset higor:10
create table if not exists PRODUCT_VERSION_DEPLOYMENT_FAIL_LOG(
  id bigserial not null primary key,
  product_version_deployment_status_id bigint references PRODUCT_VERSION_DEPLOYMENT(id) not null,
  message text not null
);
