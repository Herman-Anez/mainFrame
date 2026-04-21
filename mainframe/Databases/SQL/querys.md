CREATE DATABASE ejemplo;
DROP DATABASE ejemplo;


CREATE TABLE ejemplo;
DROP TABLE ejemplo;

## LIKE

hace un match case sensitive

SELECT * FROM person WHERE email LIKE '%@google.%';

SELECT * FROM person WHERE email LIKE '___o@%';

## ILIKE

hace un match sin case sensitive
