SELECT * FROM department;

SELECT role.id, title, department.name AS department, salary FROM role
JOIN department ON role.department = department.id;

SELECT e1.id, e1.first_name, e1.last_name, title AS title, department.name AS department, role.salary AS salary, CONCAT(e2.first_name, ' ',e2.last_name) AS manager
FROM employee e1
LEFT JOIN employee e2 on e1.manager_id = e2.id
JOIN role on role.id = e1.role_id
JOIN department ON role.department = department.id;