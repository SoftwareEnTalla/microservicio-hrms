-- ====================================================================
-- reports_category_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "reports_category_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('HEADCOUNT', 'Headcount', '', '{}'::jsonb, 'system', TRUE, 'reportscategory'),
  ('PAYROLL', 'Payroll', '', '{}'::jsonb, 'system', TRUE, 'reportscategory'),
  ('ATTENDANCE', 'Attendance', '', '{}'::jsonb, 'system', TRUE, 'reportscategory'),
  ('TURNOVER', 'Turnover', '', '{}'::jsonb, 'system', TRUE, 'reportscategory'),
  ('COMPLIANCE', 'Compliance', '', '{}'::jsonb, 'system', TRUE, 'reportscategory'),
  ('ACCESS', 'Access', '', '{}'::jsonb, 'system', TRUE, 'reportscategory'),
  ('CUSTOM', 'Custom', '', '{}'::jsonb, 'system', TRUE, 'reportscategory')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
