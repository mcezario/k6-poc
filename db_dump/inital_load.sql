CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key varchar(50) NOT NULL,
    value varchar(50) NOT NULL
);

INSERT INTO tenants (name) VALUES('Tenant 1');
INSERT INTO tenants (name) VALUES('Tenant 2');
INSERT INTO tenants (name) VALUES('Tenant 3');

INSERT INTO settings (key, value) VALUES('param1', 'value1');
INSERT INTO settings (key, value) VALUES('param2', 'value2');
