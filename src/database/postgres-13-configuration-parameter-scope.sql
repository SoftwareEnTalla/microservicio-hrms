-- ====================================================================
-- configuration_parameter_scope_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "configuration_parameter_scope_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('GLOBAL', 'Global', '', '{}'::jsonb, 'system', TRUE, 'configurationparameterscope'),
  ('COMPANY', 'Company', '', '{}'::jsonb, 'system', TRUE, 'configurationparameterscope'),
  ('WORK_CENTER', 'Work Center', '', '{}'::jsonb, 'system', TRUE, 'configurationparameterscope')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
