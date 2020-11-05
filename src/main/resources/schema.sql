CREATE SCHEMA IF NOT EXISTS screening AUTHORIZATION uportal;

CREATE TYPE screening.account_type AS ENUM ('guest', 'student', 'faculty', 'staff', 'student_employee');

CREATE TABLE IF NOT EXISTS screening.health_screening (
    id serial primary key,
    account_type screening.account_type not null default 'guest',
    pidm text,
    email text not null,
    phone text,
    name text,
    is_coughing boolean not null,
    is_feverish boolean not null,
    is_exposed boolean not null,
    is_short_of_breath boolean,
    has_sore_throat boolean,
    is_congested boolean,
    has_muscle_aches boolean,
    has_lost_taste_smell boolean,
    has_headache boolean,
    has_diarrhea boolean,
    is_nauseous boolean,
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
    is_short_of_breath boolean,
    has_sore_throat boolean,
    is_congested boolean,
    has_muscle_aches boolean,
    has_lost_taste_smell boolean,
    has_headache boolean,
    has_diarrhea boolean,
    is_nauseous boolean,
    submission_time timestamp not null default now(),
    notes text
);

CREATE TABLE IF NOT EXISTS screening.pledge (
    id serial primary key,
    email text,
    face_covering boolean,
    good_hygiene boolean,
    distancing boolean,
    submission_time timestamp not null default now()
);


CREATE TABLE IF NOT EXISTS screening.employee_supervisor (
    email text primary key,
    supervisor_email text not null
);

create function screening.save_health_info(in_account_type text, in_pidm text, in_email text, in_phone text,
            in_name text, in_is_coughing boolean, in_is_feverish boolean, in_is_exposed boolean,
            in_supervisor_email text, in_is_is_short_of_breath boolean, in_has_sore_throat boolean,
            in_has_muscle_aches boolean, in_has_lost_taste_smell boolean, in_has_diarrhea boolean,
            in_is_nauseous boolean) returns void as $$
declare
    old_supervisor_email text;
begin

    -- Insert into the health-screening table

    insert into screening.health_screening
        (account_type, pidm, email, name, phone, is_coughing, is_feverish, is_exposed, is_short_of_breath, has_sore_throat, is_congested, has_muscle_aches, has_lost_taste_smell, has_headache, has_diarrhea, is_nauseous)
    values
        (cast(in_account_type as screening.account_type), in_pidm, in_email, in_name, in_phone, in_is_coughing,
            in_is_feverish, in_is_exposed, in_is_is_short_of_breath, in_has_sore_throat, in_has_muscle_aches,
            in_has_lost_taste_smell, in_has_diarrhea, in_is_nauseous);

    -- Insert into the analytics table

    insert into screening.analytics
        (account_type, is_coughing, is_feverish, is_exposed, is_short_of_breath, has_sore_throat, is_congested, has_muscle_aches, has_lost_taste_smell, has_headache, has_diarrhea, is_nauseous)
    values
        (cast(in_account_type as screening.account_type), in_is_coughing, in_is_feverish, in_is_exposed,
            in_is_is_short_of_breath, in_has_sore_throat, in_has_muscle_aches, in_has_lost_taste_smell, in_has_diarrhea,
            in_is_nauseous)

-- Update supervisor email if it doesn't match the current record

    select
        supervisor_email
    into
        old_supervisor_email
    from
        screening.employee_supervisor
    where
        employee_supervisor.email = in_email;

    if old_supervisor_email ISNULL and in_supervisor_email IS NOT NULL then
      insert into screening.employee_supervisor
        (email, supervisor_email)
      values
        (in_email, in_supervisor_email);
    elseif in_supervisor_email <> old_supervisor_email and in_supervisor_email IS NOT NULL then
        update
            screening.employee_supervisor
        set
            supervisor_email = in_supervisor_email
        where
            employee_supervisor.email = in_email;
    end if;
end;
$$ language plpgsql;


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
