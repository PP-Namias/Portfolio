-- This is a CANARY TOKEN file
-- If you're reading this, you've triggered a security alert
-- The data below is ALL FAKE

-- Portfolio Database Backup (Canary Token)
-- Generated: 2026-01-01 00:00:00

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@canary-fake.com', '$2b$12$CanaryFakeHash1234567890123456789012345678901234'),
('user1', 'user1@canary-fake.com', '$2b$12$CanaryFakeHash1234567890123456789012345678901234'),
('user2', 'user2@canary-fake.com', '$2b$12$CanaryFakeHash1234567890123456789012345678901234');

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (title, content, author_id) VALUES
('Canary Token Post', 'This is a fake post in a canary database', 1),
('Another Fake Post', 'More fake data for the canary', 1);

-- End of Canary Token Database Backup
