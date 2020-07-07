CREATE SCHEMA IF NOT EXISTS screening AUTHORIZATION uportal;

CREATE TYPE screening.account_type AS ENUM ('guest', 'student', 'faculty', 'staff', 'student_employee');

CREATE TABLE IF NOT EXISTS screening.health_screening (
    id serial primary key,
    account_type screening.account_type not null default 'guest',
    pidm text,
    email text not null,
    phone text,
    is_coughing boolean not null,
    is_feverish boolean not null,
    is_exposed boolean not null,
    submission_time timestamp not null default now(),
    supervisor_email text,
    supervisor_name text,
    supervisor_phone text,
    notes text
);

CREATE TABLE IF NOT EXISTS screening.analytics (
    id serial primary key,
    account_type screening.account_type not null default 'guest',
    is_coughing boolean not null,
    is_feverish boolean not null,
    is_exposed boolean not null,
    submission_time timestamp not null default now(),
    notes text
);


/* For converting from the original schema to the current one */

alter type screening.account_type add value 'faculty' after 'student';
alter type screening.account_type add value 'staff' after 'faculty';
alter type screening.account_type add value 'student_employee' after 'staff';


alter table screening.health_screening
    add column supervisor_email text,
    add column supervisor_name text,
    add column supervisor_phone text,
    add column notes text,
    alter column account_type drop default,
    alter column account_type type screening.account_type USING account_type::screening.account_type,
    alter column account_type set default 'guest';
