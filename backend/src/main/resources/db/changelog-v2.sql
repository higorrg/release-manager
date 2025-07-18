--liquibase formatted sql

--changeset higor:9
create table if not exists STATUS_CHANGE_LOG (
  id bigserial not null primary key,
  module_release_id bigint references MODULE_RELEASE(id) not null,
  release_status_id bigint references RELEASE_STATUS(id) not null,
  change_timestamp timestamp not null,
  changed_by varchar(100),
  comments text
);

--changeset higor:10
create table if not exists CUSTOMER_ENVIRONMENT_RELEASE (
  id bigserial not null primary key,
  customer_id bigint references CUSTOMER(id) not null,
  module_release_id bigint references MODULE_RELEASE(id) not null,
  environment varchar(20) not null,
  constraint unique_customer_module_release_environment unique (customer_id, module_release_id, environment)
);