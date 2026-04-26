-- ====================================================================
-- gender_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "gender_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('MALE', 'Male', '', '{}'::jsonb, 'system', TRUE, 'gender'),
  ('FEMALE', 'Female', '', '{}'::jsonb, 'system', TRUE, 'gender'),
  ('OTHER', 'Other', '', '{}'::jsonb, 'system', TRUE, 'gender'),
  ('NOT_DECLARED', 'Not Declared', '', '{}'::jsonb, 'system', TRUE, 'gender')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
