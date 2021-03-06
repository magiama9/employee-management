DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;


-- THIS STORES PASSWORDS IN PLAIN TEXT AND IS CLEARLY MORONIC --
-- IT'S JUST FOR FUNZIES --
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT REFERENCES roles(id),
  manager_id INT REFERENCES departments(department_id),
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT REFERENCES departments(id),
  PRIMARY KEY(id)
);

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  manager_name VARCHAR(30),
  department_name VARCHAR(30),
  PRIMARY KEY(id)
);