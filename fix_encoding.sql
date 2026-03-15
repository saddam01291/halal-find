-- Fix character encoding issues caused by importing UTF-8 files with Windows-1252/ISO-8859-1 encoding

UPDATE places
SET 
  name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(name, 'Ã‡', 'Ç'), 'Ä±', 'ı'), 'Ä°', 'İ'), 'ÅŸ', 'ş'), 'Ã¶', 'ö'), 'Ã¼', 'ü'), 'ÄŸ', 'ğ'), 'Ã§', 'ç'), 'Ã–', 'Ö'),
  address = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(address, 'Ã‡', 'Ç'), 'Ä±', 'ı'), 'Ä°', 'İ'), 'ÅŸ', 'ş'), 'Ã¶', 'ö'), 'Ã¼', 'ü'), 'ÄŸ', 'ğ'), 'Ã§', 'ç'), 'Ã–', 'Ö'),
  city = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(city, 'Ã‡', 'Ç'), 'Ä±', 'ı'), 'Ä°', 'İ'), 'ÅŸ', 'ş'), 'Ã¶', 'ö'), 'Ã¼', 'ü'), 'ÄŸ', 'ğ'), 'Ã§', 'ç'), 'Ã–', 'Ö')
WHERE 
  name LIKE '%Ã‡%' OR name LIKE '%Ä±%' OR name LIKE '%Ä°%' OR name LIKE '%ÅŸ%' OR name LIKE '%Ã¶%' OR name LIKE '%Ã¼%' OR name LIKE '%ÄŸ%' OR name LIKE '%Ã§%' OR name LIKE '%Ã–%'
  OR address LIKE '%Ã‡%' OR address LIKE '%Ä±%' OR address LIKE '%Ä°%' OR address LIKE '%ÅŸ%' OR address LIKE '%Ã¶%' OR address LIKE '%Ã¼%' OR address LIKE '%ÄŸ%' OR address LIKE '%Ã§%' OR address LIKE '%Ã–%'
  OR city LIKE '%Ã‡%' OR city LIKE '%Ä±%' OR city LIKE '%Ä°%' OR city LIKE '%ÅŸ%' OR city LIKE '%Ã¶%' OR city LIKE '%Ã¼%' OR city LIKE '%ÄŸ%' OR city LIKE '%Ã§%' OR city LIKE '%Ã–%';
