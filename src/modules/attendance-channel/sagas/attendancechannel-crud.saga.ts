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
  AttendanceChannelCreatedEvent,
  AttendanceChannelUpdatedEvent,
  AttendanceChannelDeletedEvent,

} from '../events/exporting.event';
import {
  SagaAttendanceChannelFailedEvent
} from '../events/attendancechannel-failed.event';
import {
  CreateAttendanceChannelCommand,
  UpdateAttendanceChannelCommand,
  DeleteAttendanceChannelCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class AttendanceChannelCrudSaga {
  private readonly logger = new Logger(AttendanceChannelCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onAttendanceChannelCreated = ($events: Observable<AttendanceChannelCreatedEvent>) => {
    return $events.pipe(
      ofType(AttendanceChannelCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de AttendanceChannel: ${event.aggregateId}`);
        void this.handleAttendanceChannelCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onAttendanceChannelUpdated = ($events: Observable<AttendanceChannelUpdatedEvent>) => {
    return $events.pipe(
      ofType(AttendanceChannelUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de AttendanceChannel: ${event.aggregateId}`);
        void this.handleAttendanceChannelUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onAttendanceChannelDeleted = ($events: Observable<AttendanceChannelDeletedEvent>) => {
    return $events.pipe(
      ofType(AttendanceChannelDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de AttendanceChannel: ${event.aggregateId}`);
        void this.handleAttendanceChannelDeleted(event);
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
      .registerClient(AttendanceChannelCrudSaga.name)
      .get(AttendanceChannelCrudSaga.name),
  })
  private async handleAttendanceChannelCreated(event: AttendanceChannelCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga AttendanceChannel Created completada: ${event.aggregateId}`);
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
      .registerClient(AttendanceChannelCrudSaga.name)
      .get(AttendanceChannelCrudSaga.name),
  })
  private async handleAttendanceChannelUpdated(event: AttendanceChannelUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga AttendanceChannel Updated completada: ${event.aggregateId}`);
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
      .registerClient(AttendanceChannelCrudSaga.name)
      .get(AttendanceChannelCrudSaga.name),
  })
  private async handleAttendanceChannelDeleted(event: AttendanceChannelDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga AttendanceChannel Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaAttendanceChannelFailedEvent( error,event));
  }
}
