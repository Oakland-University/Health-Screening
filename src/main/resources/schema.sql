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
    has_tested_positive boolean,
    submission_time timestamp not null default now(),
    supervisor_email text,
    supervisor_name text,
    supervisor_phone text,
    notes text
);

CREATE TABLE IF NOT EXISTS screening.archived_health_screening (
    id integer primary key,
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
    has_tested_positive boolean,
    submission_time timestamp not null default now(),
    archived_time timestamp not null default now(),
    supervisor_email text,
    supervisor_name text,
    supervisor_phone text
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
    has_tested_positive boolean,
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


CREATE OR REPLACE VIEW screening.anonymous_data AS
SELECT
    id,
    account_type,
    is_coughing,
    is_feverish,
    is_exposed,
    is_short_of_breath,
    has_sore_throat,
    is_congested,
    has_muscle_aches,
    has_lost_taste_smell,
    has_headache,
    has_diarrhea,
    is_nauseous,
    has_tested_positive,
    submission_time
FROM
    screening.health_screening
UNION
SELECT
    id,
    account_type,
    is_coughing,
    is_feverish,
    is_exposed,
    is_short_of_breath,
    has_sore_throat,
    is_congested,
    has_muscle_aches,
    has_lost_taste_smell,
    has_headache,
    has_diarrhea,
    is_nauseous,
    has_tested_positive,
    submission_time
FROM
    screening.analytics;


create or replace function screening.save_health_info(in_account_type text, in_pidm text, in_email text, in_phone text,
            in_name text, in_is_coughing boolean, in_is_feverish boolean, in_is_exposed boolean,
            in_supervisor_email text, in_is_is_short_of_breath boolean, in_has_sore_throat boolean,
            in_is_congested boolean, in_has_muscle_aches boolean, in_has_lost_taste_smell boolean,
            in_has_headache boolean, in_has_diarrhea boolean, in_is_nauseous boolean,
            in_has_tested_positive boolean) returns void as $$
declare
    old_supervisor_email text;
    update_count integer;
begin

    -- If today's record exists, put it in the archive table

    insert into
        screening.archived_health_screening
    select
        id,
        account_type,
        pidm,
        email,
        phone,
        name,
        is_coughing,
        is_feverish,
        is_exposed,
        is_short_of_breath,
        has_sore_throat,
        is_congested,
        has_muscle_aches,
        has_lost_taste_smell,
        has_headache,
        has_diarrhea,
        is_nauseous,
        has_tested_positive,
        submission_time,
        now() as archived_time,
        supervisor_email,
        supervisor_name,
        supervisor_phone
    from
        screening.health_screening
    where
        submission_time >= now()::date
        and email = in_email;

    get diagnostics update_count = row_count;

    -- Remove today's record from health_screening table if it exists

    if update_count > 0 then
        delete from
            screening.health_screening
        where
            submission_time >= now()::date
            and email = in_email;
    end if;

    -- Insert into the health-screening table

    insert into screening.health_screening
        (account_type, pidm, email, name, phone, is_coughing, is_feverish, is_exposed,
        is_short_of_breath, has_sore_throat, is_congested, has_muscle_aches, has_lost_taste_smell,
        has_headache, has_diarrhea, is_nauseous, has_tested_positive)
    values
        (cast(in_account_type as screening.account_type), in_pidm, in_email, in_name, in_phone, in_is_coughing,
            in_is_feverish, in_is_exposed, in_is_is_short_of_breath, in_has_sore_throat, in_is_congested,
            in_has_muscle_aches, in_has_lost_taste_smell, in_has_headache, in_has_diarrhea, in_is_nauseous, in_has_tested_positive);

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


