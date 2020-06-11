CREATE TABLE IF NOT EXISTS health_screening (
    id serial primary key,
    account_type text not null default 'guest',
    pidm text,
    email text not null,
    phone text,
    is_coughing boolean not null,
    is_feverish boolean not null,
    is_exposed boolean not null,
    submission_time timestamp not null default now()
);
