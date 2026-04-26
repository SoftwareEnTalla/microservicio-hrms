-- ====================================================================
-- person_attribute_scope_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "person_attribute_scope_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('PERSON', 'Person', '', '{}'::jsonb, 'system', TRUE, 'personattributescope'),
  ('EMPLOYEE', 'Employee', '', '{}'::jsonb, 'system', TRUE, 'personattributescope'),
  ('BOTH', 'Both', '', '{}'::jsonb, 'system', TRUE, 'personattributescope')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
