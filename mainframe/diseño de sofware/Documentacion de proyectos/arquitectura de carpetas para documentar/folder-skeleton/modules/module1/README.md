# Human Resources (HR)

Objetivo: Gestionar el ciclo de vida del talento humano.
Entidades Principales (Data Schema)

* Employee: id, external_user_id (relación opcional con IAM), first_name, last_name, tax_id, birth_date.

* Contract: id, employee_id, salary, start_date, end_date, type (indefinido, temporal).

* Department: id, name, manager_id.

* Position: id, title, job_description.