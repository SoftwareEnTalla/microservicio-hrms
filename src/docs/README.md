# HRMS Service — Human Resource Management System

**Puerto**: 3017
**Repo**: `SoftwareEnTalla/microservicio-hrms`
**Stack**: NestJS 11 · CQRS · Event Sourcing · Kafka · Postgres · Redis · TypeORM · GraphQL

## 1. Visión general

Microservicio que gestiona el ciclo completo de RR.HH. de una organización: personas, empleados, nómina, asistencia, control de acceso físico/lógico, formación, reportes y configuración paramétrica. Integra con:
- `security-service` (rbac-acl) para autorización y federación de identidad.
- `organization-service` (puerto 3018) para la estructura jerárquica y `target headcount` ("lleva"), retroalimentando con el `actual headcount` ("tiene") mediante eventos Kafka.
- `payment-service` para ejecutar pagos de nómina aprobada (saga).
- `codetrace-service` para trazabilidad de eventos de dominio.

## 2. Módulos

| Módulo | Propósito | Agregado raíz |
|--------|-----------|---------------|
| `configuration-parameter` | Parámetros globales/empresa/centro con vigencia. | ConfigurationParameter |
| `hrms-permissions` | ACLs específicas del HRMS + integración con security rbac-acl. | HrmsPermissions |
| `person` | Datos de persona (PII). | Person |
| `person-attribute` | EAV extensible para persona. | PersonAttribute |
| `employee` | Ciclo de vida del empleado (onboarding → active → terminated). | Employee |
| `employee-attribute` | EAV extensible para empleado. | EmployeeAttribute |
| `payroll` | Ciclos de nómina con conceptos, recibos y firma. | Payroll |
| `attendance` | Fichajes, jornada, horas extra. | Attendance |
| `leave-request` | Solicitudes de vacaciones/permisos/bajas. | LeaveRequest |
| `access-control` | Credenciales y zonas físicas/lógicas. | AccessControl |
| `reports` | Catálogo, ejecuciones y schedules de reportes. | Reports |
| `training` | Cursos, sesiones, inscripciones, certificaciones. | Training |

## 3. Roles (10)

`HR_ADMINISTRATOR`, `HR_MANAGER`, `RECRUITER`, `PAYROLL_SPECIALIST`, `EMPLOYEE`, `SUPERVISOR`, `TRAINING_COORDINATOR`, `COMPLIANCE_OFFICER`, `IT_ADMIN`, `EXTERNAL_AUDITOR`.

## 4. Eventos de dominio (publicados)

- `person-created`, `person-updated`, `person-archived`
- `employee-hired`, `employee-updated`, `employee-transferred`, `employee-suspended`, `employee-terminated`
- `payroll-cycle-created/calculated/approved/paid/closed/reopened`, `payslip-issued`
- `time-entry-recorded`, `timesheet-approved`, `overtime-approved`
- `leave-requested/approved/rejected/cancelled`, `leave-balance-updated`
- `access-credential-issued/revoked/lost`, `access-event-recorded`, `access-denied-alert-raised`
- `certification-issued`, `certification-expiring-soon`, `certification-expired`
- `configuration-parameter-created/updated/deactivated`

## 5. Eventos consumidos

- desde `security-service`: `role-updated`, `permission-assigned-to-role`, `user-role-assigned` → recalcula `hrms-acl`.
- desde `organization-service`: `organization-node-created`, `organization-node-updated`, `organization-node-moved`, `target-headcount-updated`, `organization-node-deleted`.
- desde `organization-service`: respuestas a validaciones de capacidad cuando se asigna un empleado.

## 6. Integración con organization-service

La organización define la estructura (nodos, jerarquía, `lleva=targetHeadcount`). HRMS consume los nodos y, al asignar/transferir/dar de baja empleados, publica `employee-assigned-to-org-node`, `employee-transferred-org-node`, `employee-removed-from-org-node`. Organization consume esos eventos para mantener el contador `tiene` (actualHeadcount) y publicar `actual-headcount-updated`.

## 7. Flujos (sagas)

- **Onboarding**: person-created → employee-hired → employee-assigned-to-org-node → hrms-acl recalculada → access-credential-issued → course de inducción auto-enrollment.
- **Payroll**: timesheet-approved (por período completo) → payroll-cycle-calculated → payroll-approved → saga de pago → payroll-paid → payslip-issued → payroll-cycle-closed.
- **Terminación**: employee-terminated → access-credential-revoked (todas) → employee-removed-from-org-node → hrms-acl revocada → pending payroll sólo liquidación.

## 8. Endpoints principales (REST + GraphQL)

Cada módulo expone `POST|GET|PUT|DELETE /api/<module>`, con DTOs y resolvers GraphQL equivalentes. Swagger en `/api-docs`.

## 9. Pruebas

- E2E: `bash hrms-service/src/docs/e2e-test.sh` (requiere servicio arriba en :3017, Postgres en data-center).
- Unit: `npm test`.

## 10. Configuración / despliegue

- `.env`: `PORT=3017`, `DATABASE_URL=...`, `KAFKA_BROKERS=...`, `REDIS_URL=...`.
- Docker: `docker-compose up` desde la raíz del repo (carga data-center + hrms-service con perfil externo).
