-- Create database
CREATE DATABASE IF NOT EXISTS banking_system;
USE banking_system;

-- Create customer table
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    house_no VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employee login table
CREATE TABLE EMP_LOGIN (
    username VARCHAR(50) PRIMARY KEY,
    user_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branch table
CREATE TABLE branch (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    house_no VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accounts table
CREATE TABLE accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    current_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Create transaction table
CREATE TABLE transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    branch_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    action ENUM('deposit', 'withdrawal') NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);