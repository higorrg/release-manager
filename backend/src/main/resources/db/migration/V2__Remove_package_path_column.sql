-- Remove package_path column from releases table
ALTER TABLE releases DROP COLUMN IF EXISTS package_path;