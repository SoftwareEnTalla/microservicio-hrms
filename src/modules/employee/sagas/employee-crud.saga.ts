/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  EmployeeCreatedEvent,
  EmployeeUpdatedEvent,
  EmployeeDeletedEvent,
  EmployeeHiredEvent,
  EmployeeTransferredEvent,
  EmployeeSuspendedEvent,
  EmployeeTerminatedEvent,
  EmployeeAssignedToOrgNodeEvent,
  EmployeeRemovedFromOrgNodeEvent,
  EmployeeTransferredOrgNodeEvent,
} from '../events/exporting.event';
import {
  SagaEmployeeFailedEvent
} from '../events/employee-failed.event';
import {
  CreateEmployeeCommand,
  UpdateEmployeeCommand,
  DeleteEmployeeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class EmployeeCrudSaga {
  private readonly logger = new Logger(EmployeeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onEmployeeCreated = ($events: Observable<EmployeeCreatedEvent>) => {
    return $events.pipe(
      ofType(EmployeeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Employee: ${event.aggregateId}`);
        void this.handleEmployeeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onEmployeeUpdated = ($events: Observable<EmployeeUpdatedEvent>) => {
    return $events.pipe(
      ofType(EmployeeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Employee: ${event.aggregateId}`);
        void this.handleEmployeeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onEmployeeDeleted = ($events: Observable<EmployeeDeletedEvent>) => {
    return $events.pipe(
      ofType(EmployeeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Employee: ${event.aggregateId}`);
        void this.handleEmployeeDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onEmployeeHired = ($events: Observable<EmployeeHiredEvent>) => {
    return $events.pipe(
      ofType(EmployeeHiredEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio EmployeeHired: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onEmployeeTransferred = ($events: Observable<EmployeeTransferredEvent>) => {
    return $events.pipe(
      ofType(EmployeeTransferredEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio EmployeeTransferred: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onEmployeeSuspended = ($events: Observable<EmployeeSuspendedEvent>) => {
    return $events.pipe(
      ofType(EmployeeSuspendedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio EmployeeSuspended: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onEmployeeTerminated = ($events: Observable<EmployeeTerminatedEvent>) => {
    return $events.pipe(
      ofType(EmployeeTerminatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio EmployeeTerminated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onEmployeeAssignedToOrgNode = ($events: Observable<EmployeeAssignedToOrgNodeEvent>) => {
    return $events.pipe(
      ofType(EmployeeAssignedToOrgNodeEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio EmployeeAssignedToOrgNode: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onEmployeeRemovedFromOrgNode = ($events: Observable<EmployeeRemovedFromOrgNodeEvent>) => {
    return $events.pipe(
      ofType(EmployeeRemovedFromOrgNodeEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio EmployeeRemovedFromOrgNode: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onEmployeeTransferredOrgNode = ($events: Observable<EmployeeTransferredOrgNodeEvent>) => {
    return $events.pipe(
      ofType(EmployeeTransferredOrgNodeEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio EmployeeTransferredOrgNode: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeCrudSaga.name)
      .get(EmployeeCrudSaga.name),
  })
  private async handleEmployeeCreated(event: EmployeeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Employee Created completada: ${event.aggregateId}`);
      // Lógica post-creación (ej: enviar notificación, ejecutar comandos adicionales)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeCrudSaga.name)
      .get(EmployeeCrudSaga.name),
  })
  private async handleEmployeeUpdated(event: EmployeeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Employee Updated completada: ${event.aggregateId}`);
      // Lógica post-actualización (ej: actualizar caché)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(EmployeeCrudSaga.name)
      .get(EmployeeCrudSaga.name),
  })
  private async handleEmployeeDeleted(event: EmployeeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Employee Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaEmployeeFailedEvent( error,event));
  }
}
