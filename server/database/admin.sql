-- Add admin role to users table
-- SKIP STEP 1 IF COLUMN ALREADY EXISTS

-- Step 1: Add the column as VARCHAR first (SKIP if column exists)
-- ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer' AFTER email;

-- Step 2: First, make the column nullable and VARCHAR to clear any bad data
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NULL;

-- Step 3: Update all existing users to have 'customer' role
UPDATE users SET role = 'customer';

-- Step 4: Now convert to ENUM with all rows having valid values
ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'admin') DEFAULT 'customer' NOT NULL;

-- Step 5: Make the first user an admin (update with your user ID)
UPDATE users SET role = 'admin' WHERE id = 1;

-- Step 6: Add index for better performance (skip if already exists)
-- ALTER TABLE users ADD INDEX idx_role (role);
