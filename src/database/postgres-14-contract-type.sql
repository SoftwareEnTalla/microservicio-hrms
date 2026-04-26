-- ====================================================================
-- contract_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "contract_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('INDEFINITE', 'Indefinite', '', '{}'::jsonb, 'system', TRUE, 'contracttype'),
  ('FIXED_TERM', 'Fixed Term', '', '{}'::jsonb, 'system', TRUE, 'contracttype'),
  ('INTERN', 'Intern', '', '{}'::jsonb, 'system', TRUE, 'contracttype'),
  ('CONTRACTOR', 'Contractor', '', '{}'::jsonb, 'system', TRUE, 'contracttype'),
  ('TEMPORARY', 'Temporary', '', '{}'::jsonb, 'system', TRUE, 'contracttype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
