-- 1. Currencies reference table (ISO 4217)
CREATE TABLE currencies (
    code CHAR(3) PRIMARY KEY COMMENT 'ISO 4217 currency code, e.g., USD, EUR',
    symbol VARCHAR(5) NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert common currencies (optional but recommended)
INSERT INTO currencies (code, symbol, name) VALUES
('USD', '$', 'US Dollar'),
('EUR', '€', 'Euro'),
('GBP', '£', 'British Pound'),
('JPY', '¥', 'Japanese Yen'),
('CAD', 'C$', 'Canadian Dollar'),
('AUD', 'A$', 'Australian Dollar'),
('CHF', 'Fr', 'Swiss Franc'),
('CNY', '¥', 'Chinese Yuan'),
('INR', '₹', 'Indian Rupee'),
('BRL', 'R$', 'Brazilian Real');

-- 2. Users table (with soft delete)
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_access DATETIME NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL  -- Soft delete: NULL = active, NOT NULL = deleted
);

-- 3. Loans table
CREATE TABLE loans (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    loaner_id INT UNSIGNED NOT NULL,
    borrower_id INT UNSIGNED NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL,
    borrowing_date DATE NOT NULL,
    due_date DATE NOT NULL,
    prolongement_duration INT UNSIGNED NULL COMMENT 'in days',
    status ENUM('active', 'overdue', 'repaid', 'cancelled') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    -- Foreign keys
    FOREIGN KEY (loaner_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (currency) REFERENCES currencies(code) ON UPDATE CASCADE,

    -- Business constraints
    CONSTRAINT chk_due_after_borrow CHECK (due_date >= borrowing_date),
    CONSTRAINT chk_not_self_loan CHECK (loaner_id != borrower_id)
);

-- 4. Spendings table
CREATE TABLE spendings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    spender_id INT UNSIGNED NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL,
    spending_date DATE NOT NULL,
    spent_on VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (spender_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (currency) REFERENCES currencies(code) ON UPDATE CASCADE
);

-- 5. Savings table
CREATE TABLE savings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    saver_id INT UNSIGNED NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL,
    saving_date DATE NOT NULL,
    reason VARCHAR(150) NULL,
    saving_place VARCHAR(50) NOT NULL,
    status ENUM('active', 'withdrawn', 'lost', 'transferred') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (saver_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (currency) REFERENCES currencies(code) ON UPDATE CASCADE
);

-- Indexes for performance (including soft-delete filtering)
CREATE INDEX idx_users_deleted ON users(deleted_at);
CREATE INDEX idx_loans_loaner_deleted ON loans(loaner_id, deleted_at);
CREATE INDEX idx_loans_borrower_deleted ON loans(borrower_id, deleted_at);
CREATE INDEX idx_loans_currency ON loans(currency);
CREATE INDEX idx_spendings_spender_deleted ON spendings(spender_id, deleted_at);
CREATE INDEX idx_spendings_currency ON spendings(currency);
CREATE INDEX idx_savings_saver_deleted ON savings(saver_id, deleted_at);
CREATE INDEX idx_savings_currency ON savings(currency);