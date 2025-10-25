-- Add temporary modifier fields to character_attributes table
-- These fields store temporary bonuses/penalties to attributes (buffs, debuffs, etc.)
-- Temporary modifiers can range from -20 to +20

ALTER TABLE character_attributes
ADD COLUMN IF NOT EXISTS forca_temp_mod INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS destreza_temp_mod INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS constituicao_temp_mod INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inteligencia_temp_mod INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sabedoria_temp_mod INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS carisma_temp_mod INTEGER DEFAULT 0;

-- Add constraints to ensure temporary modifiers are within reasonable range
ALTER TABLE character_attributes
ADD CONSTRAINT check_forca_temp_mod CHECK (forca_temp_mod >= -20 AND forca_temp_mod <= 20),
ADD CONSTRAINT check_destreza_temp_mod CHECK (destreza_temp_mod >= -20 AND destreza_temp_mod <= 20),
ADD CONSTRAINT check_constituicao_temp_mod CHECK (constituicao_temp_mod >= -20 AND constituicao_temp_mod <= 20),
ADD CONSTRAINT check_inteligencia_temp_mod CHECK (inteligencia_temp_mod >= -20 AND inteligencia_temp_mod <= 20),
ADD CONSTRAINT check_sabedoria_temp_mod CHECK (sabedoria_temp_mod >= -20 AND sabedoria_temp_mod <= 20),
ADD CONSTRAINT check_carisma_temp_mod CHECK (carisma_temp_mod >= -20 AND carisma_temp_mod <= 20);

-- Comment explaining the purpose of these fields
COMMENT ON COLUMN character_attributes.forca_temp_mod IS 'Modificador temporário de Força (buffs/debuffs)';
COMMENT ON COLUMN character_attributes.destreza_temp_mod IS 'Modificador temporário de Destreza (buffs/debuffs)';
COMMENT ON COLUMN character_attributes.constituicao_temp_mod IS 'Modificador temporário de Constituição (buffs/debuffs)';
COMMENT ON COLUMN character_attributes.inteligencia_temp_mod IS 'Modificador temporário de Inteligência (buffs/debuffs)';
COMMENT ON COLUMN character_attributes.sabedoria_temp_mod IS 'Modificador temporário de Sabedoria (buffs/debuffs)';
COMMENT ON COLUMN character_attributes.carisma_temp_mod IS 'Modificador temporário de Carisma (buffs/debuffs)';

