CREATE TABLE links (
    code   text PRIMARY KEY,
    url    text NOT NULL,
    clicks integer NOT NULL DEFAULT 0
);

INSERT INTO links (code, url, clicks) VALUES
    ('docker', 'https://docs.docker.com/', 12),
    ('ynov', 'https://www.ynov.com/', 5);
