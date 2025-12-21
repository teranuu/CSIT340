-- =====================================================
-- CoreThreads Database Migration
-- Add Role-Based Access Control (RBAC) Support
-- Created: December 18, 2025
-- =====================================================

-- Add role column to customer table
-- This enables distinction between regular users and administrators
ALTER TABLE customer 
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';

-- Create index on role column for faster role-based queries
CREATE INDEX idx_customer_role ON customer(role);

-- Update existing admin user to have ADMIN role (if exists)
-- Replace 'admin' with your actual admin username if different
UPDATE customer 
SET role = 'ADMIN' 
WHERE username = 'admin';

-- Verify the migration
SELECT 
    username, 
    email, 
    role, 
    created_at 
FROM customer 
WHERE role = 'ADMIN';

-- =====================================================
-- Rollback Script (if needed)
-- =====================================================
-- To rollback this migration, run:
-- ALTER TABLE customer DROP COLUMN role;
-- DROP INDEX idx_customer_role ON customer;
