-- ====================================================================
-- payroll_frequency_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "payroll_frequency_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('MONTHLY', 'Monthly', '', '{}'::jsonb, 'system', TRUE, 'payrollfrequency'),
  ('BIWEEKLY', 'Biweekly', '', '{}'::jsonb, 'system', TRUE, 'payrollfrequency'),
  ('WEEKLY', 'Weekly', '', '{}'::jsonb, 'system', TRUE, 'payrollfrequency'),
  ('CUSTOM', 'Custom', '', '{}'::jsonb, 'system', TRUE, 'payrollfrequency')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
