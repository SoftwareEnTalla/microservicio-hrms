-- ════════════════════════════════════════════════════════════════════
-- leave_request_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "leave_request_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('PENDING', 'Pendiente', 'Pendiente de aprobación', jsonb_build_object('description','Pendiente de aprobación'), 'system', TRUE, 'leaverequeststatus'),
  ('APPROVED', 'Aprobada', 'Aprobada por el responsable', jsonb_build_object('description','Aprobada por el responsable'), 'system', TRUE, 'leaverequeststatus'),
  ('REJECTED', 'Rechazada', 'Rechazada', jsonb_build_object('description','Rechazada'), 'system', TRUE, 'leaverequeststatus'),
  ('CANCELLED', 'Cancelada', 'Cancelada por el solicitante', jsonb_build_object('description','Cancelada por el solicitante'), 'system', TRUE, 'leaverequeststatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
