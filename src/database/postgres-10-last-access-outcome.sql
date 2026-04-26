-- ====================================================================
-- last_access_outcome_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "last_access_outcome_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('GRANTED', 'Granted', '', '{}'::jsonb, 'system', TRUE, 'lastaccessoutcome'),
  ('DENIED', 'Denied', '', '{}'::jsonb, 'system', TRUE, 'lastaccessoutcome'),
  ('LOCKED', 'Locked', '', '{}'::jsonb, 'system', TRUE, 'lastaccessoutcome'),
  ('TIMEOUT', 'Timeout', '', '{}'::jsonb, 'system', TRUE, 'lastaccessoutcome')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
