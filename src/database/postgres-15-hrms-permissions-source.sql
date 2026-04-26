-- ====================================================================
-- hrms_permissions_source_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "hrms_permissions_source_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('SECURITY_SERVICE', 'Security Service', '', '{}'::jsonb, 'system', TRUE, 'hrmspermissionssource'),
  ('HRMS_LOCAL', 'Hrms Local', '', '{}'::jsonb, 'system', TRUE, 'hrmspermissionssource')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
