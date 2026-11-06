-- ==============================================================
-- AI-Based Interior Design Suggester with 3D Visualization
-- Database Schema: MySQL Relational Database
-- ==============================================================

CREATE DATABASE IF NOT EXISTS ai_interior_db;
USE ai_interior_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'suspended') DEFAULT 'active'
);

-- Design configurations & room states
CREATE TABLE IF NOT EXISTS designs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    style VARCHAR(50) NOT NULL,
    width_m DECIMAL(5,2) DEFAULT 5.00,
    length_m DECIMAL(5,2) DEFAULT 6.00,
    height_m DECIMAL(5,2) DEFAULT 2.80,
    wall_color VARCHAR(20) DEFAULT '#F1F5F9',
    flooring_type VARCHAR(50) DEFAULT 'oak_wood',
    lighting_mode VARCHAR(50) DEFAULT 'daylight',
    data_json LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Material Libraries & Textures Catalog
CREATE TABLE IF NOT EXISTS material_libraries (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('flooring', 'wall', 'fabric', 'metal', 'wood') NOT NULL,
    texture_key VARCHAR(100) NOT NULL,
    hex_code VARCHAR(20),
    roughness DECIMAL(3,2) DEFAULT 0.5,
    metalness DECIMAL(3,2) DEFAULT 0.1
);

-- Seed Initial Data
INSERT IGNORE INTO users (id, name, email, password, role, status) VALUES
('usr_admin', 'Bhuvan (Admin)', 'bhuvan@gmail.com', 'Bhuvan@123', 'admin', 'active'),
('usr_sarah', 'Sarah Miller', 'sarah.miller@example.com', 'password123', 'user', 'active');

INSERT IGNORE INTO material_libraries (id, name, category, texture_key, hex_code, roughness, metalness) VALUES
('mat_oak', 'European White Oak', 'flooring', 'oak_wood', '#d6b28d', 0.45, 0.05),
('mat_walnut', 'American Dark Walnut', 'flooring', 'dark_walnut', '#5c3a21', 0.50, 0.05),
('mat_marble', 'Carrara White Marble', 'flooring', 'marble', '#eaeaea', 0.15, 0.20),
('mat_concrete', 'Polished Grey Concrete', 'flooring', 'concrete', '#8a8d91', 0.60, 0.00),
('mat_tile', 'Glossy Ceramic Tile', 'flooring', 'ceramic_tiles', '#f7f7f7', 0.20, 0.10);
