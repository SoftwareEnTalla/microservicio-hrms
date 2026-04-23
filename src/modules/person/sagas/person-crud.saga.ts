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
  PersonCreatedEvent,
  PersonUpdatedEvent,
  PersonDeletedEvent,
  PersonArchivedEvent,
} from '../events/exporting.event';
import {
  SagaPersonFailedEvent
} from '../events/person-failed.event';
import {
  CreatePersonCommand,
  UpdatePersonCommand,
  DeletePersonCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class PersonCrudSaga {
  private readonly logger = new Logger(PersonCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPersonCreated = ($events: Observable<PersonCreatedEvent>) => {
    return $events.pipe(
      ofType(PersonCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Person: ${event.aggregateId}`);
        void this.handlePersonCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onPersonUpdated = ($events: Observable<PersonUpdatedEvent>) => {
    return $events.pipe(
      ofType(PersonUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Person: ${event.aggregateId}`);
        void this.handlePersonUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPersonDeleted = ($events: Observable<PersonDeletedEvent>) => {
    return $events.pipe(
      ofType(PersonDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Person: ${event.aggregateId}`);
        void this.handlePersonDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPersonArchived = ($events: Observable<PersonArchivedEvent>) => {
    return $events.pipe(
      ofType(PersonArchivedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PersonArchived: ${event.aggregateId}`);
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
      .registerClient(PersonCrudSaga.name)
      .get(PersonCrudSaga.name),
  })
  private async handlePersonCreated(event: PersonCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Person Created completada: ${event.aggregateId}`);
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
      .registerClient(PersonCrudSaga.name)
      .get(PersonCrudSaga.name),
  })
  private async handlePersonUpdated(event: PersonUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Person Updated completada: ${event.aggregateId}`);
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
      .registerClient(PersonCrudSaga.name)
      .get(PersonCrudSaga.name),
  })
  private async handlePersonDeleted(event: PersonDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Person Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPersonFailedEvent( error,event));
  }
}
