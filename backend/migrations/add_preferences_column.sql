-- Migration: Add preferences column to users table
-- This migration adds a preferences column to store general user preferences

-- Add preferences column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'preferences'
    ) THEN
        ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{"notifications_enabled": true, "language": "English", "voice_enabled": false, "auto_location": true, "dark_mode": false}';
        RAISE NOTICE 'Added preferences column to users table';
    ELSE
        RAISE NOTICE 'preferences column already exists in users table';
    END IF;
END $$; 