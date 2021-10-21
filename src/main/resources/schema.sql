CREATE SCHEMA IF NOT EXISTS screening AUTHORIZATION uportal;

CREATE TYPE screening.account_type AS ENUM ('guest', 'student', 'faculty', 'staff', 'student_employee');

CREATE TABLE IF NOT EXISTS screening.health_screening (
    id serial primary key,
    account_type screening.account_type not null default 'guest',
    pidm text,
    email text not null,
    phone text,
    name text,
    is_coughing boolean,
    is_feverish boolean,
    is_exposed boolean not null,
    is_short_of_breath boolean,
    has_sore_throat boolean,
    is_congested boolean,
    has_muscle_aches boolean,
    has_lost_taste_smell boolean,
    has_headache boolean,
    has_diarrhea boolean,
    is_nauseous boolean,
    is_fully_vaccinated boolean,
    is_symptomatic boolean,
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
    is_coughing boolean,
    is_feverish boolean,
    is_exposed boolean not null,
    is_short_of_breath boolean,
    has_sore_throat boolean,
    is_congested boolean,
    has_muscle_aches boolean,
    has_lost_taste_smell boolean,
    has_headache boolean,
    has_diarrhea boolean,
    is_nauseous boolean,
    is_fully_vaccinated boolean,
    is_symptomatic boolean,
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
    is_coughing boolean,
    is_feverish boolean,
    is_exposed boolean not null,
    is_short_of_breath boolean,
    has_sore_throat boolean,
    is_congested boolean,
    has_muscle_aches boolean,
    has_lost_taste_smell boolean,
    has_headache boolean,
    has_diarrhea boolean,
    is_nauseous boolean,
    is_fully_vaccinated boolean,
    is_symptomatic boolean,
    has_tested_positive boolean,
    submission_time timestamp not null default now(),
    notes text
);

CREATE TABLE IF NOT EXISTS screening.previous_information (
    email text primary key,
    supervisor_email text,
    phone text
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
    submission_time,
    is_fully_vaccinated,
    is_symptomatic
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
    submission_time,
    is_fully_vaccinated,
    is_symptomatic
FROM
    screening.analytics;


create or replace function screening.save_health_info(
            in_account_type text,
            in_pidm text,
            in_email text,
            in_phone text,
            in_name text,
            in_is_exposed boolean,
            in_supervisor_email text,
            in_is_symptomatic boolean) returns void as $$
declare
    old_supervisor_email text;
    old_phone text;
    update_count integer;
begin

    -- If today's record exists, put it in the archive table

    insert into
        screening.archived_health_screening
        (id, account_type, pidm, email, phone, name, is_exposed, submission_time, archived_time, supervisor_email)
    select
        id,
        account_type,
        pidm,
        email,
        phone,
        name,
        is_exposed,
        submission_time,
        now() as archived_time,
        supervisor_email
    from
        screening.health_screening
    where
        submission_time >= now()::date
        and account_type = (cast (in_account_type as screening.account_type))
        and email = in_email;

    get diagnostics update_count = row_count;

    -- Remove today's record from health_screening table if it exists

    if update_count > 0 then
        delete from
            screening.health_screening
        where
            submission_time >= now()::date
            and account_type = (cast (in_account_type as screening.account_type))
            and email = in_email;
    end if;

    -- Insert into the health-screening table

    insert into screening.health_screening
        (account_type, pidm, email, name, phone, is_exposed, is_symptomatic)
    values
        (cast(in_account_type as screening.account_type), in_pidm, in_email, in_name, in_phone, in_is_exposed, in_is_symptomatic);

-- Update supervisor email and phone number if it doesn't match the current record

    select 
        phone,
        supervisor_email
    into
        old_phone,
        old_supervisor_email
    from
        screening.previous_information
    where
        previous_information.email = in_email;

    -- phone number is a required field, so if no phone exists, this must be the person's first record
    -- That above assumption isn't true for initial runs :(
    if (old_phone ISNULL and old_supervisor_email ISNULL) then
        insert into screening.previous_information
            (email, phone, supervisor_email)
        values
            (in_email, in_phone, in_supervisor_email);

    -- if either phone or supervisor_email is updated, we'll update both using COALESCE to make sure we don't
    -- accidentally write a null value
    elsif (old_phone is distinct from in_phone or old_supervisor_email is distinct from in_supervisor_email) then
        update
            screening.previous_information
        set
            phone = COALESCE(in_phone, old_phone),
            supervisor_email = COALESCE(in_supervisor_email, old_supervisor_email)
        where
            previous_information.email = in_email;
    end if;
end;
$$ language plpgsql;


