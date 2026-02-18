CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    shipping_address_id BIGINT NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id)
);

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
