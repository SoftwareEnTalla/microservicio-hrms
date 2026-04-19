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
  ReportsCreatedEvent,
  ReportsUpdatedEvent,
  ReportsDeletedEvent,

} from '../events/exporting.event';
import {
  SagaReportsFailedEvent
} from '../events/reports-failed.event';
import {
  CreateReportsCommand,
  UpdateReportsCommand,
  DeleteReportsCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ReportsCrudSaga {
  private readonly logger = new Logger(ReportsCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onReportsCreated = ($events: Observable<ReportsCreatedEvent>) => {
    return $events.pipe(
      ofType(ReportsCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Reports: ${event.aggregateId}`);
        void this.handleReportsCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onReportsUpdated = ($events: Observable<ReportsUpdatedEvent>) => {
    return $events.pipe(
      ofType(ReportsUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Reports: ${event.aggregateId}`);
        void this.handleReportsUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onReportsDeleted = ($events: Observable<ReportsDeletedEvent>) => {
    return $events.pipe(
      ofType(ReportsDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Reports: ${event.aggregateId}`);
        void this.handleReportsDeleted(event);
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
      .registerClient(ReportsCrudSaga.name)
      .get(ReportsCrudSaga.name),
  })
  private async handleReportsCreated(event: ReportsCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Reports Created completada: ${event.aggregateId}`);
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
      .registerClient(ReportsCrudSaga.name)
      .get(ReportsCrudSaga.name),
  })
  private async handleReportsUpdated(event: ReportsUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Reports Updated completada: ${event.aggregateId}`);
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
      .registerClient(ReportsCrudSaga.name)
      .get(ReportsCrudSaga.name),
  })
  private async handleReportsDeleted(event: ReportsDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Reports Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaReportsFailedEvent( error,event));
  }
}
