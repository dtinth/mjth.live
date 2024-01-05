-- Dialect: SQLite
CREATE TABLE active_users (
    id TEXT PRIMARY KEY,
    date TEXT,
    hour INTEGER,
    hours_seen REAL,
    client_name TEXT,
    client_country TEXT,
    client_city TEXT,
    client_instrument TEXT,
    client_skill TEXT,
    server_name TEXT,
    server_country TEXT,
    server_city TEXT,
    server_ip TEXT,
    server_port INTEGER,
    server_directory_name TEXT
);