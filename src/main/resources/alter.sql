-- noinspection SqlNoDataSourceInspectionForFile

CREATE TABLE IF NOT EXISTS screening.previous_information (
    email text primary key,
    supervisor_email text,
    phone text
);


--psql -d uportal5dev -U uportaladmin -c "select 'drop function ' || oid::regprocedure || ';' from pg_proc where proname = 'save_health_info'" -t >> drop-functions.sql

INSERT INTO screening.previous_information
    (email, supervisor_email)
SELECT
    email,
    supervisor_email
FROM
    screening.employee_supervisor;


-- previous three statements have been validated

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
    if (old_phone ISNULL) then
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
