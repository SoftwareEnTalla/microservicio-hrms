-- ====================================================================
-- scope_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "scope_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('COMPANY', 'Company', '', '{}'::jsonb, 'system', TRUE, 'scopetype'),
  ('DEPARTMENT', 'Department', '', '{}'::jsonb, 'system', TRUE, 'scopetype'),
  ('WORK_CENTER', 'Work Center', '', '{}'::jsonb, 'system', TRUE, 'scopetype'),
  ('CUSTOM', 'Custom', '', '{}'::jsonb, 'system', TRUE, 'scopetype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
