-- =============================================
-- Campus Merch Platform — Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS campus_merch;
USE campus_merch;

-- ── Users ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  department VARCHAR(50),
  batch_year VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Products ──────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  badge VARCHAR(50) DEFAULT '',
  image_url VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Cart Items ────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- ── Orders ────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Order Items ───────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ── Custom Orders ─────────────────────────────
CREATE TABLE IF NOT EXISTS custom_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  merch_type VARCHAR(50) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  batch_year VARCHAR(10) NOT NULL,
  merch_color VARCHAR(20) DEFAULT '#1a2a5e',
  text_color VARCHAR(20) DEFAULT '#ffffff',
  quantity INT NOT NULL DEFAULT 1,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Bulk Enquiries ────────────────────────────
CREATE TABLE IF NOT EXISTS bulk_enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  club_name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(150) NOT NULL,
  items_needed TEXT NOT NULL,
  quantity INT,
  occasion VARCHAR(200),
  additional_details TEXT,
  status ENUM('new', 'contacted', 'in_progress', 'completed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Newsletter Subscribers ────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Clubs ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS clubs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  tags JSON,
  enquiry_email VARCHAR(200) DEFAULT 'campusmerch@university.edu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
