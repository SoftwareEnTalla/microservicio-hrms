-- ====================================================================
-- attendance_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "attendance_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('RECORDED', 'Recorded', '', '{}'::jsonb, 'system', TRUE, 'attendancestatus'),
  ('VALIDATED', 'Validated', '', '{}'::jsonb, 'system', TRUE, 'attendancestatus'),
  ('APPROVED', 'Approved', '', '{}'::jsonb, 'system', TRUE, 'attendancestatus'),
  ('REJECTED', 'Rejected', '', '{}'::jsonb, 'system', TRUE, 'attendancestatus'),
  ('ADJUSTED', 'Adjusted', '', '{}'::jsonb, 'system', TRUE, 'attendancestatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
