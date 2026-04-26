# HRMS Microservice

**Creation Date**: 2026-04-22

**Author**: Ing. Persy Morell Guerra e Ing. Dailyn García Dominguez (SoftwarEnTalla CEO)

## Microservice Structure

```plaintext
.
|____common
| |____database
| |____dto
| | |____args
| | |____inputs
| |____helpers
| |____logger
| |____types
|____config
|____core
| |____adapters
| |____configs
| |____loaders
| |____logs
| |____services
| |____tda
|____database
|____docs
|____errors
|____filters
|____i18n
|____interfaces
|____migrations
|____modules
| |____access-control
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____attendance
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____catalog-client
| |____catalog-sync-log
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____configuration-parameter
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____employee
| |____employee-attribute
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____hrms
| |____hrms-permissions
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____leave-request
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____payroll
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____person
| |____person-attribute
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____reports
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
| |____training
| | |____aggregates
| | |____commands
| | | |____handlers
| | |____config
| | |____controllers
| | |____decorators
| | |____dtos
| | |____entities
| | |____events
| | |____graphql
| | |____guards
| | |____interceptors
| | |____modules
| | |____queries
| | | |____handlers
| | |____repositories
| | |____sagas
| | |____services
| | |____shared
| | | |____adapters
| | | |____decorators
| | | |____event-store
| | | |____messaging
| | |____types
|____utils
```

<!-- nomencladores-propios:start -->

## Nomencladores propios

Este microservicio mantiene localmente los siguientes nomencladores (regla §4.9.6 de `docs/help.md` — entidad XML independiente con CRUD CQRS, FK desde agregados padres, seed SQL local idempotente).

| Nomenclador | Modelo DSL | Seed SQL |
|---|---|---|
| `employment-status` | [../models/hrms/employment-status.xml](../models/hrms/employment-status.xml) | [./src/database/postgres-2-employment-status.sql](./src/database/postgres-2-employment-status.sql) |
| `leave-type` | [../models/hrms/leave-type.xml](../models/hrms/leave-type.xml) | [./src/database/postgres-3-leave-type.sql](./src/database/postgres-3-leave-type.sql) |
| `leave-request-status` | [../models/hrms/leave-request-status.xml](../models/hrms/leave-request-status.xml) | [./src/database/postgres-4-leave-request-status.sql](./src/database/postgres-4-leave-request-status.sql) |
| `time-entry-type` | [../models/hrms/time-entry-type.xml](../models/hrms/time-entry-type.xml) | [./src/database/postgres-5-time-entry-type.sql](./src/database/postgres-5-time-entry-type.sql) |
| `access-credential-type` | [../models/hrms/access-credential-type.xml](../models/hrms/access-credential-type.xml) | [./src/database/postgres-6-access-credential-type.sql](./src/database/postgres-6-access-credential-type.sql) |
| `credential-status` | [../models/hrms/credential-status.xml](../models/hrms/credential-status.xml) | [./src/database/postgres-7-credential-status.sql](./src/database/postgres-7-credential-status.sql) |
| `payroll-cycle-status` | [../models/hrms/payroll-cycle-status.xml](../models/hrms/payroll-cycle-status.xml) | [./src/database/postgres-8-payroll-cycle-status.sql](./src/database/postgres-8-payroll-cycle-status.sql) |

Estos nomencladores se siembran automáticamente en cada arranque (`init-order.txt`). Si más adelante un segundo microservicio empieza a consumir alguno, se promueve a `catalog-service` según la regla.

<!-- nomencladores-propios:end -->
