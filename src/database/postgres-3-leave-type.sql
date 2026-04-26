-- ════════════════════════════════════════════════════════════════════
-- leave_type_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "leave_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('VACATION', 'Vacaciones', 'Licencia anual', jsonb_build_object('description','Licencia anual'), 'system', TRUE, 'leavetype'),
  ('SICK_LEAVE', 'Baja médica', 'Licencia médica', jsonb_build_object('description','Licencia médica'), 'system', TRUE, 'leavetype'),
  ('PERSONAL', 'Personal', 'Asunto personal', jsonb_build_object('description','Asunto personal'), 'system', TRUE, 'leavetype'),
  ('MATERNITY', 'Maternidad', 'Licencia por maternidad', jsonb_build_object('description','Licencia por maternidad'), 'system', TRUE, 'leavetype'),
  ('PATERNITY', 'Paternidad', 'Licencia por paternidad', jsonb_build_object('description','Licencia por paternidad'), 'system', TRUE, 'leavetype'),
  ('UNPAID', 'No remunerada', 'Licencia sin sueldo', jsonb_build_object('description','Licencia sin sueldo'), 'system', TRUE, 'leavetype'),
  ('BEREAVEMENT', 'Duelo', 'Licencia por duelo', jsonb_build_object('description','Licencia por duelo'), 'system', TRUE, 'leavetype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
