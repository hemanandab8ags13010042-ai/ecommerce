-- E-Commerce Customer Behavior & Purchase Amount Correlation Analysis
-- MySQL Database Schema Definition

CREATE DATABASE IF NOT EXISTS ecommerce_analytics;
USE ecommerce_analytics;

-- Drop tables if they exist to support clean resets
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS customers;

-- Table: customers
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    location VARCHAR(100) NOT NULL,
    income DECIMAL(10, 2) NOT NULL,
    registration_date DATE NOT NULL
);

-- Table: purchases
CREATE TABLE purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    discount DECIMAL(5, 2) NOT NULL,
    purchase_amount DECIMAL(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    review_rating DECIMAL(3, 1) NOT NULL,
    purchase_frequency INT NOT NULL,
    previous_purchases INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Indexes for optimized querying
CREATE INDEX idx_customer_id ON purchases(customer_id);
CREATE INDEX idx_product_category ON purchases(product_category);
CREATE INDEX idx_purchase_date ON purchases(purchase_date);
