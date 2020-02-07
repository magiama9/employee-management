USE employee_db;


INSERT INTO departments (manager_name, department_name) VALUES ("Gary Almes", "Chatting");
SELECT @last := LAST_INSERT_ID();
INSERT INTO roles (title, salary, department_id) VALUES ("Talker", 100000, @last), ("Barker", 50000, @last), ("Laugher", 10000, @last);
INSERT INTO departments (manager_name, department_name) VALUES ("Jon Choi", "Meme-lording");
SELECT @last := LAST_INSERT_ID();
INSERT INTO roles (title, salary, department_id) VALUES ("Memer", 69000, @last), ("Edgelord", 420, @last), ("Lurker", 1, @last);