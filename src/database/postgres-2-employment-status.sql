-- ════════════════════════════════════════════════════════════════════
-- employment_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "employment_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('ONBOARDING', 'Onboarding', 'En proceso de incorporación', jsonb_build_object('description','En proceso de incorporación'), 'system', TRUE, 'employmentstatus'),
  ('ACTIVE', 'Activo', 'Empleado activo', jsonb_build_object('description','Empleado activo'), 'system', TRUE, 'employmentstatus'),
  ('ON_LEAVE', 'De licencia', 'Empleado de licencia temporal', jsonb_build_object('description','Empleado de licencia temporal'), 'system', TRUE, 'employmentstatus'),
  ('SUSPENDED', 'Suspendido', 'Empleado suspendido', jsonb_build_object('description','Empleado suspendido'), 'system', TRUE, 'employmentstatus'),
  ('TERMINATED', 'Baja', 'Empleado dado de baja', jsonb_build_object('description','Empleado dado de baja'), 'system', TRUE, 'employmentstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
