create table person (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	gender VARCHAR(15) NOT NULL,
	date_of_birth DATE NOT NULL,
	country_of_birth VARCHAR(50) NOT NULL,
	email VARCHAR(150) 
);


SELECT * FROM person;
SELECT DISTINCT country_of_birth FROM person;
SELECT country_of_birth FROM person;
SELECT country_of_birth FROM person GROUP BY country_of_birth;
-- SELECT country_of_birth COUNT(*) FROM person GROUP BY country_of_birth; 

-- SELECT country_of_birth, COUNT(*) FROM person; 
--column "person.country_of_birth" must appear in the GROUP BY clause or be used in an aggregate function

SELECT country_of_birth, COUNT(*) FROM person GROUP BY country_of_birth;
SELECT country_of_birth, COUNT(*) FROM person GROUP BY country_of_birth ORDER BY country_of_birth;
SELECT country_of_birth, COUNT(*) FROM person GROUP BY country_of_birth ORDER BY COUNT(*) ASC;
SELECT country_of_birth, COUNT(*) FROM person GROUP BY country_of_birth ORDER BY COUNT(*) DESC;
SELECT country_of_birth, COUNT(*) FROM person GROUP BY country_of_birth HAVING COUNT(*) >= 40 ORDER BY country_of_birth;

SELECT country_of_birth FROM person GROUP BY gender;

SELECT country_of_birth, COUNT(*) FROM person GROUP BY country_of_birth;


SELECT * FROM cars;
SELECT MAX(price) FROM cars;
SELECT MIN(price) FROM cars;
SELECT AVG(price) FROM cars;
SELECT ROUND(AVG(price)) FROM cars;

SELECT make, model, MIN(price) FROM cars GROUP BY make, model;

SELECT make, MAX(price) FROM car GROUP BY make;
SELECT make, MIN(price) FROM car GROUP BY make;
SELECT make, AVG(price) FROM car GROUP BY make;
SELECT make, ROUND(AVG(price)) FROM car GROUP BY make;


ALTER TABLE person ADD CONSTRAINT gender_contraint CHECK (gender 'Female' OR gender 'Male');


INSERT INTO person (id, first_name, last_name, gender, email, date_of_birth, country_of_birth) 
VALUES (2017, 'Russ', 'Ruddoch', 'Male', 'rruddoch7@hhs.gov.uk', DATE '1952-09-25', 'Norway')
ON CONFLICT (id) DO UPDATE SET email EXCLUDED.email;