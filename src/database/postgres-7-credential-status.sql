-- ════════════════════════════════════════════════════════════════════
-- credential_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "credential_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('ACTIVE', 'Activa', 'Credencial válida', jsonb_build_object('description','Credencial válida'), 'system', TRUE, 'credentialstatus'),
  ('LOST', 'Perdida', 'Reportada como perdida', jsonb_build_object('description','Reportada como perdida'), 'system', TRUE, 'credentialstatus'),
  ('REVOKED', 'Revocada', 'Revocada por seguridad', jsonb_build_object('description','Revocada por seguridad'), 'system', TRUE, 'credentialstatus'),
  ('EXPIRED', 'Expirada', 'Caducada por fecha', jsonb_build_object('description','Caducada por fecha'), 'system', TRUE, 'credentialstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
