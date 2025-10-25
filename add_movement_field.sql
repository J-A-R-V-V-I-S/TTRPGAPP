-- ==============================================
-- ADD MOVEMENT FIELD TO CHARACTERS TABLE
-- ==============================================
-- This script adds the movement field to the characters table
-- if it doesn't already exist.

-- Add movement field to characters table
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS movement TEXT;

-- Add comment to describe the field
COMMENT ON COLUMN characters.movement IS 'Character movement speed and type (e.g., "6 squares", "30 ft", "Fly 60 ft")';

-- Update existing characters with default movement if needed
-- This is optional and can be customized based on your needs
UPDATE characters 
SET movement = '6 squares' 
WHERE movement IS NULL;
