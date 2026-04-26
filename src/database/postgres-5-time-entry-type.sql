-- ════════════════════════════════════════════════════════════════════
-- time_entry_type_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "time_entry_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('CHECK_IN', 'Entrada', 'Marcaje de entrada', jsonb_build_object('description','Marcaje de entrada'), 'system', TRUE, 'timeentrytype'),
  ('CHECK_OUT', 'Salida', 'Marcaje de salida', jsonb_build_object('description','Marcaje de salida'), 'system', TRUE, 'timeentrytype'),
  ('BREAK_START', 'Inicio de pausa', 'Inicio de descanso', jsonb_build_object('description','Inicio de descanso'), 'system', TRUE, 'timeentrytype'),
  ('BREAK_END', 'Fin de pausa', 'Fin de descanso', jsonb_build_object('description','Fin de descanso'), 'system', TRUE, 'timeentrytype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "active"           = TRUE,
  "modificationDate" = NOW();
