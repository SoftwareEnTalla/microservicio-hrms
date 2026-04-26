-- ====================================================================
-- training_modality_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "training_modality_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('IN_PERSON', 'In Person', '', '{}'::jsonb, 'system', TRUE, 'trainingmodality'),
  ('VIRTUAL', 'Virtual', '', '{}'::jsonb, 'system', TRUE, 'trainingmodality'),
  ('HYBRID', 'Hybrid', '', '{}'::jsonb, 'system', TRUE, 'trainingmodality'),
  ('SELF_PACED', 'Self Paced', '', '{}'::jsonb, 'system', TRUE, 'trainingmodality')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
