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
  AttendanceCreatedEvent,
  AttendanceUpdatedEvent,
  AttendanceDeletedEvent,

} from '../events/exporting.event';
import {
  SagaAttendanceFailedEvent
} from '../events/attendance-failed.event';
import {
  CreateAttendanceCommand,
  UpdateAttendanceCommand,
  DeleteAttendanceCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class AttendanceCrudSaga {
  private readonly logger = new Logger(AttendanceCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onAttendanceCreated = ($events: Observable<AttendanceCreatedEvent>) => {
    return $events.pipe(
      ofType(AttendanceCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Attendance: ${event.aggregateId}`);
        void this.handleAttendanceCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onAttendanceUpdated = ($events: Observable<AttendanceUpdatedEvent>) => {
    return $events.pipe(
      ofType(AttendanceUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Attendance: ${event.aggregateId}`);
        void this.handleAttendanceUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onAttendanceDeleted = ($events: Observable<AttendanceDeletedEvent>) => {
    return $events.pipe(
      ofType(AttendanceDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Attendance: ${event.aggregateId}`);
        void this.handleAttendanceDeleted(event);
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
      .registerClient(AttendanceCrudSaga.name)
      .get(AttendanceCrudSaga.name),
  })
  private async handleAttendanceCreated(event: AttendanceCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Attendance Created completada: ${event.aggregateId}`);
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
      .registerClient(AttendanceCrudSaga.name)
      .get(AttendanceCrudSaga.name),
  })
  private async handleAttendanceUpdated(event: AttendanceUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Attendance Updated completada: ${event.aggregateId}`);
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
      .registerClient(AttendanceCrudSaga.name)
      .get(AttendanceCrudSaga.name),
  })
  private async handleAttendanceDeleted(event: AttendanceDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Attendance Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaAttendanceFailedEvent( error,event));
  }
}
