-- ════════════════════════════════════════════════════════════════════
-- access_credential_type_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "access_credential_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('RFID_CARD', 'Tarjeta RFID', 'Tarjeta RFID', jsonb_build_object('description','Tarjeta RFID'), 'system', TRUE, 'accesscredentialtype'),
  ('QR', 'Código QR', 'Código QR personal', jsonb_build_object('description','Código QR personal'), 'system', TRUE, 'accesscredentialtype'),
  ('PIN', 'PIN', 'PIN numérico', jsonb_build_object('description','PIN numérico'), 'system', TRUE, 'accesscredentialtype'),
  ('BIOMETRIC', 'Biométrica', 'Huella o reconocimiento facial', jsonb_build_object('description','Huella o reconocimiento facial'), 'system', TRUE, 'accesscredentialtype'),
  ('MOBILE_APP', 'App móvil', 'Credencial via app móvil', jsonb_build_object('description','Credencial via app móvil'), 'system', TRUE, 'accesscredentialtype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
