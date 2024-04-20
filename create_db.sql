CREATE DATABASE inventorydata;
USE inventorydata;
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, 
                    first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, 
                    email VARCHAR(255) NOT NULL, hashedPassword VARCHAR(255) NOT NULL);

CREATE TABLE storage_components (id INT AUTO_INCREMENT PRIMARY KEY,
                                 name VARCHAR(255) NOT NULL,
                                 status ENUM('inUse', 'inStorage', 'underMaintenance') NOT NULL);

CREATE TABLE managers_list (id INT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255) NOT NULL);

-- Create alerts table
CREATE TABLE alerts (id INT AUTO_INCREMENT PRIMARY KEY,
                     item_name VARCHAR(255) NOT NULL,
                     threshold INT NOT NULL);
                                                   
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON inventorydata.* TO 'appuser'@'localhost';

