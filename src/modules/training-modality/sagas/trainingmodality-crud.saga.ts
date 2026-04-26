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
  TrainingModalityCreatedEvent,
  TrainingModalityUpdatedEvent,
  TrainingModalityDeletedEvent,

} from '../events/exporting.event';
import {
  SagaTrainingModalityFailedEvent
} from '../events/trainingmodality-failed.event';
import {
  CreateTrainingModalityCommand,
  UpdateTrainingModalityCommand,
  DeleteTrainingModalityCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class TrainingModalityCrudSaga {
  private readonly logger = new Logger(TrainingModalityCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onTrainingModalityCreated = ($events: Observable<TrainingModalityCreatedEvent>) => {
    return $events.pipe(
      ofType(TrainingModalityCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de TrainingModality: ${event.aggregateId}`);
        void this.handleTrainingModalityCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onTrainingModalityUpdated = ($events: Observable<TrainingModalityUpdatedEvent>) => {
    return $events.pipe(
      ofType(TrainingModalityUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de TrainingModality: ${event.aggregateId}`);
        void this.handleTrainingModalityUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onTrainingModalityDeleted = ($events: Observable<TrainingModalityDeletedEvent>) => {
    return $events.pipe(
      ofType(TrainingModalityDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de TrainingModality: ${event.aggregateId}`);
        void this.handleTrainingModalityDeleted(event);
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
      .registerClient(TrainingModalityCrudSaga.name)
      .get(TrainingModalityCrudSaga.name),
  })
  private async handleTrainingModalityCreated(event: TrainingModalityCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TrainingModality Created completada: ${event.aggregateId}`);
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
      .registerClient(TrainingModalityCrudSaga.name)
      .get(TrainingModalityCrudSaga.name),
  })
  private async handleTrainingModalityUpdated(event: TrainingModalityUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TrainingModality Updated completada: ${event.aggregateId}`);
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
      .registerClient(TrainingModalityCrudSaga.name)
      .get(TrainingModalityCrudSaga.name),
  })
  private async handleTrainingModalityDeleted(event: TrainingModalityDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga TrainingModality Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaTrainingModalityFailedEvent( error,event));
  }
}
