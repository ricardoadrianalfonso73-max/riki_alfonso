-- Esquema MySQL de referencia para despliegue externo de Electro Tecno
CREATE DATABASE IF NOT EXISTS electro_tecno CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE electro_tecno;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(140) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  brand VARCHAR(80) NOT NULL,
  category ENUM('Celulares', 'PC y Netbooks', 'Monitores', 'Periféricos', 'Accesorios') NOT NULL,
  item_condition ENUM('Nuevo', 'Usado') NOT NULL,
  price INT NOT NULL,
  old_price INT NULL,
  discount_percent INT NULL,
  short_description VARCHAR(240) NOT NULL,
  description TEXT NOT NULL,
  specs_json JSON NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  warranty VARCHAR(120) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  on_sale BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_session_product (session_id, product_id),
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  order_number VARCHAR(24) NOT NULL UNIQUE,
  user_id VARCHAR(36) NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  shipping_address VARCHAR(240) NOT NULL,
  city VARCHAR(120) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  payment_method VARCHAR(60) NOT NULL,
  subtotal INT NOT NULL,
  shipping_cost INT NOT NULL,
  total INT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Confirmado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(160) NOT NULL,
  unit_price INT NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS repair_requests (
  id VARCHAR(36) PRIMARY KEY,
  ticket_number VARCHAR(24) NOT NULL UNIQUE,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  device_model VARCHAR(120) NOT NULL,
  issue_type VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Recibido',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(40) NULL,
  subject VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
