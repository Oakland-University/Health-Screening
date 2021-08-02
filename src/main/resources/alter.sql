-- noinspection SqlNoDataSourceInspectionForFile

alter table screening.health_screening
    add column is_symptomatic boolean,
    alter column is_coughing drop not null,
    alter column is_feverish drop not null;

alter table screening.analytics
    add column is_symptomatic boolean,
    alter column is_coughing drop not null,
    alter column is_feverish drop not null;

alter table screening.archived_health_screening
    add column is_symptomatic boolean,
    alter column is_coughing drop not null,
    alter column is_feverish drop not null;

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


-- previous three statements have been validated

create or replace function screening.save_health_info(in_account_type text, in_pidm text, in_email text, in_phone text,
            in_name text, in_is_exposed boolean, in_supervisor_email text, in_is_symptomatic boolean) returns void as $$
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
        supervisor_phone,
        is_fully_vaccinated,
        is_symptomatic
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
