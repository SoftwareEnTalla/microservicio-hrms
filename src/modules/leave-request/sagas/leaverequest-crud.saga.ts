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
  LeaveRequestCreatedEvent,
  LeaveRequestUpdatedEvent,
  LeaveRequestDeletedEvent,

} from '../events/exporting.event';
import {
  SagaLeaveRequestFailedEvent
} from '../events/leaverequest-failed.event';
import {
  CreateLeaveRequestCommand,
  UpdateLeaveRequestCommand,
  DeleteLeaveRequestCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class LeaveRequestCrudSaga {
  private readonly logger = new Logger(LeaveRequestCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onLeaveRequestCreated = ($events: Observable<LeaveRequestCreatedEvent>) => {
    return $events.pipe(
      ofType(LeaveRequestCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de LeaveRequest: ${event.aggregateId}`);
        void this.handleLeaveRequestCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onLeaveRequestUpdated = ($events: Observable<LeaveRequestUpdatedEvent>) => {
    return $events.pipe(
      ofType(LeaveRequestUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de LeaveRequest: ${event.aggregateId}`);
        void this.handleLeaveRequestUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onLeaveRequestDeleted = ($events: Observable<LeaveRequestDeletedEvent>) => {
    return $events.pipe(
      ofType(LeaveRequestDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de LeaveRequest: ${event.aggregateId}`);
        void this.handleLeaveRequestDeleted(event);
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
      .registerClient(LeaveRequestCrudSaga.name)
      .get(LeaveRequestCrudSaga.name),
  })
  private async handleLeaveRequestCreated(event: LeaveRequestCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga LeaveRequest Created completada: ${event.aggregateId}`);
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
      .registerClient(LeaveRequestCrudSaga.name)
      .get(LeaveRequestCrudSaga.name),
  })
  private async handleLeaveRequestUpdated(event: LeaveRequestUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga LeaveRequest Updated completada: ${event.aggregateId}`);
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
      .registerClient(LeaveRequestCrudSaga.name)
      .get(LeaveRequestCrudSaga.name),
  })
  private async handleLeaveRequestDeleted(event: LeaveRequestDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga LeaveRequest Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaLeaveRequestFailedEvent( error,event));
  }
}
