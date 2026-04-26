-- ════════════════════════════════════════════════════════════════════
-- payroll_cycle_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "payroll_cycle_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('DRAFT', 'Borrador', 'Ciclo en preparación', jsonb_build_object('description','Ciclo en preparación'), 'system', TRUE, 'payrollcyclestatus'),
  ('CALCULATED', 'Calculada', 'Cálculo finalizado', jsonb_build_object('description','Cálculo finalizado'), 'system', TRUE, 'payrollcyclestatus'),
  ('APPROVED', 'Aprobada', 'Aprobada por finanzas', jsonb_build_object('description','Aprobada por finanzas'), 'system', TRUE, 'payrollcyclestatus'),
  ('PAID', 'Pagada', 'Pagada a empleados', jsonb_build_object('description','Pagada a empleados'), 'system', TRUE, 'payrollcyclestatus'),
  ('CLOSED', 'Cerrada', 'Cerrada contablemente', jsonb_build_object('description','Cerrada contablemente'), 'system', TRUE, 'payrollcyclestatus'),
  ('REOPENED', 'Reabierta', 'Reabierta para corrección', jsonb_build_object('description','Reabierta para corrección'), 'system', TRUE, 'payrollcyclestatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
