# HRMS Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3017
> **Base URL**: `http://localhost:3017/api`
> **Swagger UI**: `http://localhost:3017/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: HRMS (Human Resources Management System)

El microservicio **hrms** administra: personas (`Person`), empleados (`Employee`), asistencia, nómina, permisos, vacaciones, entrenamiento, control de acceso, atributos y parámetros de configuración. Actúa como **productor de eventos** que mueve contadores e inventarios en otros BCs (especialmente `organization-service`).

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Persona (raíz biográfica) | person |
| UH-2 | Empleado (ciclo hire→terminate, transfer, suspend) | employee |
| UH-3 | Asignación a nodo organizacional | employee (+ assign/remove/transfer events) |
| UH-4 | Asistencia (time entry + timesheet + overtime) | attendance |
| UH-5 | Nómina (cycle create/calc/approve/pay/close/reopen) | payroll |
| UH-6 | Control de acceso interno (roles/permisos) | access-control + hrms-permissions |
| UH-7 | Leave requests (vacaciones/licencias) | leave-request |
| UH-8 | Training (capacitaciones) | training |
| UH-9 | Parámetros de configuración | configuration-parameter |
| UH-10 | Atributos dinámicos | employee-attribute, person-attribute |
| UH-11 | Reportes analíticos | reports |
| UH-12 | Trazabilidad sync catalog | catalog-sync-log |
| UH-13 | Integración catalog-service | catalog-client |

---

## 2. Modelo DSL

Los modelos están en `models/hrms/`.

| Modelo XML | Versión | AggregateRoot | ModuleType |
|------------|---------|:---:|---|
| `person.xml` | 1.0.0 | ✓ | aggregate-root |
| `employee.xml` | 1.0.0 | ✓ | aggregate-root |
| `attendance.xml` | 1.0.0 | ✗ | entity |
| `payroll.xml` | 1.0.0 | ✗ | entity |
| `access-control.xml` | 1.0.0 | ✗ | entity |
| `leave-request.xml` | 1.0.0 | ✗ | entity |
| `training.xml` | 1.0.0 | ✗ | entity |
| `configuration-parameter.xml` | 1.0.0 | ✗ | entity |
| `employee-attribute.xml` | 1.0.0 | ✗ | entity |
| `person-attribute.xml` | 1.0.0 | ✗ | entity |
| `hrms-permissions.xml` | 1.0.0 | ✗ | entity |
| `reports.xml` | 1.0.0 | ✗ | entity |
| `catalog-sync-log.xml` | 1.0.0 | ✗ | entity |

---

## 3. Arquitectura

### 3.1 Patrones

| Patrón | Descripción |
|--------|-------------|
| **CQRS** | Command/query separados. |
| **Event Sourcing** | Eventos + EventStore + Kafka. |
| **Event-Driven** | Eventos `employee-*` consumidos por organization, payroll-reports, etc. |
| **Saga Pattern** | Saga CRUD por módulo + sagas específicas por proceso (payroll, attendance). |
| **DDD** | Aggregates *Person*, *Employee*; entidades asociadas. |
| **Catalog-fallback** | Breaker + cache. |

### 3.2 Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                HRMS MICROSERVICE  (3017)                   │
├────────────────────────────────────────────────────────────┤
│  REST Command / REST Query / GraphQL                       │
│   CommandBus / QueryBus / Resolvers                        │
│   Service ↔ Repository → PostgreSQL (hrms-service)         │
│  KafkaEventPublisher ─ EventStore ─ KafkaEventSubscriber   │
│   CatalogClient (breaker + cache)                          │
└────────────────────────────────────────────────────────────┘
```

### 3.3 Estructura de carpetas por módulo

```
src/modules/<module>/
├── commands/ controllers/ decorators/ dtos/ entities/
├── events/ graphql/ guards/ interceptors/ modules/
├── queries/ repositories/ sagas/ services/ shared/ types/
```

---

## 4. Módulos del Microservicio

| Módulo | Entidad | Campos clave |
|--------|---------|--------------|
| person | `Person` | personCode, givenName, familyName, email, documentId, status |
| employee | `Employee` | employeeCode, personId, organizationNodeId, role, hireDate, status |
| attendance | `TimeEntry` / `Timesheet` | employeeId, periodStart/End, hoursRegular, hoursOvertime, status |
| payroll | `PayrollCycle` / `PayrollItem` | code, periodStart/End, status, grossAmount, netAmount |
| access-control | `AccessControl` | employeeId, accessCode, grantedAt, status |
| leave-request | `LeaveRequest` | employeeId, kind, from, to, status |
| training | `Training` | employeeId, code, status, completedAt |
| configuration-parameter | `ConfigurationParameter` | key, value, type |
| employee-attribute | `EmployeeAttribute` | employeeId, code, valueType, value |
| person-attribute | `PersonAttribute` | personId, code, valueType, value |
| hrms-permissions | `HrmsPermission` | code, description, module |
| reports | `HrmsReport` | code, kind, generatedAt, parameters |
| catalog-sync-log | `CatalogSyncLog` | categoryCode, triggeredBy, outcome |
| catalog-client | — | `CatalogClientService`, `CatalogSyncService` |

---

## 5. Eventos Publicados

### 5.1 Eventos CRUD

Cada módulo expone `Created/Updated/Deleted` bajo `hrms.<entidad>-created|updated|deleted` (v1.0.0, replayable).

### 5.2 Eventos de dominio

| Módulo | Evento | Tópico Kafka | Replayable |
|--------|--------|--------------|:---:|
| employee | `EmployeeHiredEvent` | `hrms.employee-hired` | ✓ |
| employee | `EmployeeUpdatedEvent` | `hrms.employee-updated` | ✓ |
| employee | `EmployeeTransferredEvent` | `hrms.employee-transferred` | ✓ |
| employee | `EmployeeSuspendedEvent` | `hrms.employee-suspended` | ✓ |
| employee | `EmployeeTerminatedEvent` | `hrms.employee-terminated` | ✓ |
| employee | `EmployeeAssignedToOrgNodeEvent` | `hrms.employee-assigned-to-org-node` | ✓ |
| employee | `EmployeeRemovedFromOrgNodeEvent` | `hrms.employee-removed-from-org-node` | ✓ |
| employee | `EmployeeTransferredOrgNodeEvent` | `hrms.employee-transferred-org-node` | ✓ |
| attendance | `TimeEntryRecordedEvent` | `hrms.time-entry-recorded` | ✓ |
| attendance | `TimesheetCalculatedEvent` | `hrms.timesheet-calculated` | ✓ |
| attendance | `TimesheetApprovedEvent` | `hrms.timesheet-approved` | ✓ |
| attendance | `OvertimeApprovedEvent` | `hrms.overtime-approved` | ✓ |
| payroll | `PayrollCycleCreatedEvent` | `hrms.payroll-cycle-created` | ✓ |
| payroll | `PayrollCalculatedEvent` | `hrms.payroll-calculated` | ✓ |
| payroll | `PayrollApprovedEvent` | `hrms.payroll-approved` | ✓ |
| payroll | `PayrollPaidEvent` | `hrms.payroll-paid` | ✓ |
| payroll | `PayrollCycleClosedEvent` | `hrms.payroll-cycle-closed` | ✓ |
| payroll | `PayrollCycleReopenedEvent` | `hrms.payroll-cycle-reopened` | ✓ |
| person | `PersonCreatedEvent` | `hrms.person-created` | ✓ |
| person | `PersonUpdatedEvent` | `hrms.person-updated` | ✓ |
| person | `PersonArchivedEvent` | `hrms.person-archived` | ✓ |

Eventos de saga failed publican `hrms.*-failed` (replayable: false).

### Estructura de un evento publicado

```json
{
  "aggregateId": "uuid",
  "timestamp": "2026-04-21T10:00:00.000Z",
  "payload": {
    "instance": { /* entidad */ },
    "metadata": {
      "initiatedBy":"user-id","correlationId":"uuid",
      "eventName":"EmployeeHiredEvent","eventVersion":"1.0.0",
      "sourceService":"hrms-service","retryCount":0,
      "idempotencyKey":"uuid"
    }
  }
}
```

---

## 6. Eventos Consumidos

| Módulo | Evento | Origen | Acción |
|--------|--------|--------|--------|
| catalog-client | `catalog.catalog-item-upserted` | catalog-service | Invalida caché + syncCategory |
| catalog-client | `catalog.catalog-item-deprecated` | catalog-service | Invalida caché + syncCategory |

`KAFKA_TRUSTED_PRODUCERS` filtra productores confiables.

---

## 7. API REST — Guía Completa Swagger

### 7.1 Command CRUD (todos los módulos)

| Método | Ruta | Body |
|--------|------|------|
| POST | `/api/<entities>/command` | `CreateXxxDto` |
| POST | `/api/<entities>/command/bulk` | `CreateXxxDto[]` |
| PUT | `/api/<entities>/command/:id` | `UpdateXxxDto` |
| PUT | `/api/<entities>/command/bulk` | `UpdateXxxDto[]` |
| DELETE | `/api/<entities>/command/:id` | — |
| DELETE | `/api/<entities>/command/bulk` | — |

### 7.2 Query CRUD

Mismo set canónico (list, :id, field/:field, pagination, count, search, find-one, find-one-or-fail).

### 7.3 Prefijos por módulo

| Módulo | Command | Query |
|--------|---------|-------|
| person | `/api/persons/command` | `/api/persons/query` |
| employee | `/api/employees/command` | `/api/employees/query` |
| attendance | `/api/attendances/command` | `/api/attendances/query` |
| payroll | `/api/payrolls/command` | `/api/payrolls/query` |
| access-control | `/api/accesscontrols/command` | `/api/accesscontrols/query` |
| leave-request | `/api/leaverequests/command` | `/api/leaverequests/query` |
| training | `/api/trainings/command` | `/api/trainings/query` |
| configuration-parameter | `/api/configurationparameters/command` | `/api/configurationparameters/query` |
| employee-attribute | `/api/employeeattributes/command` | `/api/employeeattributes/query` |
| person-attribute | `/api/personattributes/command` | `/api/personattributes/query` |
| hrms-permissions | `/api/hrmspermissions/command` | `/api/hrmspermissions/query` |
| reports | `/api/reports/command` | `/api/reports/query` |
| catalog-sync-log | `/api/catalogsynclogs/command` | `/api/catalogsynclogs/query` |
| catalog-client | `/api/catalog-sync` | — |

### 7.4 DTOs principales

```json
// CreatePersonDto
{ "personCode":"P-001","givenName":"John","familyName":"Doe",
  "email":"john@acme.com","documentId":"DNI-123","status":"ACTIVE" }

// CreateEmployeeDto
{ "employeeCode":"E-001","personId":"UUID","organizationNodeId":"UUID",
  "role":"MANAGER","hireDate":"2026-01-15","status":"ACTIVE" }
```

---

## 8. Guía para Desarrolladores

Mismo patrón canónico: dual publish + registro en `event-registry.ts` + saga `@Saga()` con `ofType`.

---

## 9. Test E2E con curl

```bash
cd hrms-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash hrms-service/src/docs/e2e-test.sh
```

| Paso | Descripción | Cobertura |
|------|-------------|-----------|
| 0 | Pre-flight health | Infra |
| 1 | Crear person → `hrms.person-created` | `person` |
| 2 | Crear employee (hire) → `employee-hired` | `employee` |
| 3 | Assign to org-node → `employee-assigned-to-org-node` | Kafka produce |
| 4 | Transfer org-node → `employee-transferred-org-node` | Kafka produce |
| 5 | Suspend employee → `employee-suspended` | Kafka produce |
| 6 | Crear time-entry → `time-entry-recorded` | `attendance` |
| 7 | Timesheet calc + approve | Kafka produce |
| 8 | Crear payroll-cycle + calculate + approve + pay + close + reopen | `payroll` |
| 9 | Leave-request (crear + aprobar) | `leave-request` |
| 10 | Training (crear + completar) | `training` |
| 11 | Access-control (grant + revoke) | `access-control` |
| 12 | Configuration-parameter / person-attribute / employee-attribute / hrms-permissions / reports | CRUD sueltos |
| 13 | Terminate employee → `employee-terminated` | Kafka produce |
| 14 | Catalog-sync health + status + run | `catalog-client` |
| 15 | `kcat -L` verifica topics `hrms.*` | Kafka probe |
| 16 | Limpieza | Todos |

---

## 10. Análisis de Sagas y Eventos (E2E)

### 10.1 Inventario de sagas

- `PersonCrudSaga`, `EmployeeCrudSaga`, `AttendanceCrudSaga`, `PayrollCrudSaga`, `AccessControlCrudSaga`, `LeaveRequestCrudSaga`, `TrainingCrudSaga`, `ConfigurationParameterCrudSaga`, `EmployeeAttributeCrudSaga`, `PersonAttributeCrudSaga`, `HrmsPermissionsCrudSaga`, `ReportsCrudSaga`, `CatalogSyncLogCrudSaga`.

### 10.2 Totales

- **Eventos registrados**: ≈60 (CRUD de 13 módulos + 21 eventos de dominio + saga-failed).
- **Topics Kafka**: main + retry + DLQ por cada evento.

### 10.3 Dual publish

Obligatorio para activar sagas `@Saga()` in-process.

---

## 11. Variables de Entorno

| Variable | Uso |
|----------|-----|
| `APP_NAME` / `STAGE` / `PORT` | 3017 |
| `DB_HOST/PORT/USERNAME/PASSWORD/NAME` | PostgreSQL (hrms-service) |
| `JWT_SECRET` / `API_KEY` / `SA_EMAIL` / `SA_PWD` | Auth |
| `KAFKA_ENABLED` / `KAFKA_BROKERS` / `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | Kafka |
| `EVENT_SOURCING_ENABLED` / `EVENT_STORE_ENABLED` | Event sourcing |
| `REDIS_HOST/PORT/TTL` | Redis cache |
| `CATALOG_BASE_URL` / `CATALOG_SYNC_INTERVAL_MS` | CatalogClient |
| `CATALOG_BREAKER_ERROR_THRESHOLD` / `CATALOG_BREAKER_RESET_MS` | Breaker |
| `SWAGGER_USER` / `SWAGGER_PWD` | Swagger basic auth |
| `LOG_API_BASE_URL` / `LOG_KAFKA_TOPIC` / `LOG_EXECUTION_TIME` | Codetrace |

---

## 12. Build & Run

```bash
cd hrms-service
npm install && npm run build
node dist/main.js
# o docker-compose up hrms-service
```

---

## 13. Integración con catalog-service

Documentación canónica de `CatalogClientModule`: [docs/README-catalog-integration.md](../../../docs/README-catalog-integration.md).
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
