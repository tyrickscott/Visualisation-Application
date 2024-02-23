CREATE DATABASE inventorydata;
USE inventorydata;
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, 
                    first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, 
                    email VARCHAR(255) NOT NULL, hashedPassword VARCHAR(255) NOT NULL);
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON inventorydata.* TO 'appuser'@'localhost';

