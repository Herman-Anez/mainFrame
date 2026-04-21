
```sql
```

```bash
psql -U postgres # se conecta al cliente por consola
```
`\l`
list all databases

`\i`
ejecuta sql desde un archivo

`\du`
muestra usuarios y roles

`\c "dbName"`
se conecta a la base de datos indicada

inside db

CREATE TABLE person (
id BIGSERIAL NOT NULL PRIMARY KEY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
gender VARCHAR(5) NOT NULL,
date_of_birth DATE NOT NULL,
email VARCHAR(150) );


\d
muestra las tablas 

\d tabla
muestra los campos de la tabla

INSERT INTO person (first_name, last_name, gender, date_of_birth)
VALUES ('Anne', 'Smith', 'FEMALE', date '1988-01-09');  

`SELECT country_of_birth, COUNT(*) FROM person GROUP BY country_of_birth;`