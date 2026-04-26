-- ====================================================================
-- attendance_channel_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "attendance_channel_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('WEB', 'Web', '', '{}'::jsonb, 'system', TRUE, 'attendancechannel'),
  ('MOBILE', 'Mobile', '', '{}'::jsonb, 'system', TRUE, 'attendancechannel'),
  ('KIOSK', 'Kiosk', '', '{}'::jsonb, 'system', TRUE, 'attendancechannel'),
  ('BIOMETRIC', 'Biometric', '', '{}'::jsonb, 'system', TRUE, 'attendancechannel'),
  ('MANUAL', 'Manual', '', '{}'::jsonb, 'system', TRUE, 'attendancechannel')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
