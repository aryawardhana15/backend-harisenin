-- Disable foreign key checks to allow dropping tables if they exist
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS `movies`;
DROP TABLE IF EXISTS `users`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Table Movies
CREATE TABLE `movies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `synopsis` TEXT,
  `rating` DECIMAL(3, 1),
  `image` VARCHAR(255)
);

-- 2. Table Users
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `fullname` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `token` VARCHAR(255)
);
