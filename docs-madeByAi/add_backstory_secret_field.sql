-- ==============================================
-- MIGRATION: Add is_backstory_secret field to characters table
-- ==============================================

-- Add the is_backstory_secret field to the characters table
-- This field will control whether the character's backstory is visible to other players
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS is_backstory_secret BOOLEAN DEFAULT FALSE;

-- Add a comment to the column for documentation
COMMENT ON COLUMN characters.is_backstory_secret IS 'Controls whether the backstory is hidden from other players';

-- Optional: Update existing records to have the default value
UPDATE characters 
SET is_backstory_secret = FALSE 
WHERE is_backstory_secret IS NULL;

