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
  AccessControlCreatedEvent,
  AccessControlUpdatedEvent,
  AccessControlDeletedEvent,

} from '../events/exporting.event';
import {
  SagaAccessControlFailedEvent
} from '../events/accesscontrol-failed.event';
import {
  CreateAccessControlCommand,
  UpdateAccessControlCommand,
  DeleteAccessControlCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class AccessControlCrudSaga {
  private readonly logger = new Logger(AccessControlCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onAccessControlCreated = ($events: Observable<AccessControlCreatedEvent>) => {
    return $events.pipe(
      ofType(AccessControlCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de AccessControl: ${event.aggregateId}`);
        void this.handleAccessControlCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onAccessControlUpdated = ($events: Observable<AccessControlUpdatedEvent>) => {
    return $events.pipe(
      ofType(AccessControlUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de AccessControl: ${event.aggregateId}`);
        void this.handleAccessControlUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onAccessControlDeleted = ($events: Observable<AccessControlDeletedEvent>) => {
    return $events.pipe(
      ofType(AccessControlDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de AccessControl: ${event.aggregateId}`);
        void this.handleAccessControlDeleted(event);
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
      .registerClient(AccessControlCrudSaga.name)
      .get(AccessControlCrudSaga.name),
  })
  private async handleAccessControlCreated(event: AccessControlCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga AccessControl Created completada: ${event.aggregateId}`);
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
      .registerClient(AccessControlCrudSaga.name)
      .get(AccessControlCrudSaga.name),
  })
  private async handleAccessControlUpdated(event: AccessControlUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga AccessControl Updated completada: ${event.aggregateId}`);
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
      .registerClient(AccessControlCrudSaga.name)
      .get(AccessControlCrudSaga.name),
  })
  private async handleAccessControlDeleted(event: AccessControlDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga AccessControl Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaAccessControlFailedEvent( error,event));
  }
}
