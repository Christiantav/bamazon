DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  item_name VARCHAR(30) NOT NULL,
  category_name VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_count INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (item_name, category_name, price, stock_count)
VALUES ("Fat Tire", "Keg", 180.00, 15),
  ("Bud Light", "Keg", 150.00, 10),
  ("Corporate Cups", "Accessories", 24.50, 50),
  ("Cornhole", "Games", 75.00, 5),
  ("Porta Parties", "Vehicles", 20000.00, 4),
  ("Catering", "Optional Choice", 15.00, 50),
  ("Beer Here!", "Optional Staffer", 125.00, 1),
  ("Ironbound", "Keg", 200.00, 8),
  ("Connect Four", "Games", 300.00, 5),
  ("Solar Generators", "Vehicles", 2500.00, 5);

CREATE TABLE categories(
category_id INT AUTO_INCREMENT NOT NULL,
category_name VARCHAR(45) NOT NULL,
over_head_costs DECIMAL(10,2) NOT NULL,
primary key(category_id)
);

SELECT * FROM categories;

INSERT INTO categories (category_name, over_head_costs)
VALUES ("Keg", 1500),
  ("Accessories", 500),
  ("Games", 75),
  ("Vehicles", 30000),
  ("Optional Choice", 500),
  ("Optional Staffer", 0);

