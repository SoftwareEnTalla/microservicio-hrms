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
  TrainingCreatedEvent,
  TrainingUpdatedEvent,
  TrainingDeletedEvent,

} from '../events/exporting.event';
import {
  SagaTrainingFailedEvent
} from '../events/training-failed.event';
import {
  CreateTrainingCommand,
  UpdateTrainingCommand,
  DeleteTrainingCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class TrainingCrudSaga {
  private readonly logger = new Logger(TrainingCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onTrainingCreated = ($events: Observable<TrainingCreatedEvent>) => {
    return $events.pipe(
      ofType(TrainingCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Training: ${event.aggregateId}`);
        void this.handleTrainingCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onTrainingUpdated = ($events: Observable<TrainingUpdatedEvent>) => {
    return $events.pipe(
      ofType(TrainingUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Training: ${event.aggregateId}`);
        void this.handleTrainingUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onTrainingDeleted = ($events: Observable<TrainingDeletedEvent>) => {
    return $events.pipe(
      ofType(TrainingDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Training: ${event.aggregateId}`);
        void this.handleTrainingDeleted(event);
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
      .registerClient(TrainingCrudSaga.name)
      .get(TrainingCrudSaga.name),
  })
  private async handleTrainingCreated(event: TrainingCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Training Created completada: ${event.aggregateId}`);
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
      .registerClient(TrainingCrudSaga.name)
      .get(TrainingCrudSaga.name),
  })
  private async handleTrainingUpdated(event: TrainingUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Training Updated completada: ${event.aggregateId}`);
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
      .registerClient(TrainingCrudSaga.name)
      .get(TrainingCrudSaga.name),
  })
  private async handleTrainingDeleted(event: TrainingDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Training Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaTrainingFailedEvent( error,event));
  }
}
