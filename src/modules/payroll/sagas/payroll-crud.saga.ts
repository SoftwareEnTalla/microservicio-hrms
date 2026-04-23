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
  PayrollCreatedEvent,
  PayrollUpdatedEvent,
  PayrollDeletedEvent,
  PayrollCycleCreatedEvent,
  PayrollCycleCalculatedEvent,
  PayrollApprovedEvent,
  PayrollPaidEvent,
  PayrollCycleClosedEvent,
  PayrollCycleReopenedEvent,
} from '../events/exporting.event';
import {
  SagaPayrollFailedEvent
} from '../events/payroll-failed.event';
import {
  CreatePayrollCommand,
  UpdatePayrollCommand,
  DeletePayrollCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class PayrollCrudSaga {
  private readonly logger = new Logger(PayrollCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPayrollCreated = ($events: Observable<PayrollCreatedEvent>) => {
    return $events.pipe(
      ofType(PayrollCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Payroll: ${event.aggregateId}`);
        void this.handlePayrollCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onPayrollUpdated = ($events: Observable<PayrollUpdatedEvent>) => {
    return $events.pipe(
      ofType(PayrollUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Payroll: ${event.aggregateId}`);
        void this.handlePayrollUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPayrollDeleted = ($events: Observable<PayrollDeletedEvent>) => {
    return $events.pipe(
      ofType(PayrollDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Payroll: ${event.aggregateId}`);
        void this.handlePayrollDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPayrollCycleCreated = ($events: Observable<PayrollCycleCreatedEvent>) => {
    return $events.pipe(
      ofType(PayrollCycleCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PayrollCycleCreated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPayrollCycleCalculated = ($events: Observable<PayrollCycleCalculatedEvent>) => {
    return $events.pipe(
      ofType(PayrollCycleCalculatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PayrollCycleCalculated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPayrollApproved = ($events: Observable<PayrollApprovedEvent>) => {
    return $events.pipe(
      ofType(PayrollApprovedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PayrollApproved: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPayrollPaid = ($events: Observable<PayrollPaidEvent>) => {
    return $events.pipe(
      ofType(PayrollPaidEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PayrollPaid: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPayrollCycleClosed = ($events: Observable<PayrollCycleClosedEvent>) => {
    return $events.pipe(
      ofType(PayrollCycleClosedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PayrollCycleClosed: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onPayrollCycleReopened = ($events: Observable<PayrollCycleReopenedEvent>) => {
    return $events.pipe(
      ofType(PayrollCycleReopenedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio PayrollCycleReopened: ${event.aggregateId}`);
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
      .registerClient(PayrollCrudSaga.name)
      .get(PayrollCrudSaga.name),
  })
  private async handlePayrollCreated(event: PayrollCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Payroll Created completada: ${event.aggregateId}`);
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
      .registerClient(PayrollCrudSaga.name)
      .get(PayrollCrudSaga.name),
  })
  private async handlePayrollUpdated(event: PayrollUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Payroll Updated completada: ${event.aggregateId}`);
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
      .registerClient(PayrollCrudSaga.name)
      .get(PayrollCrudSaga.name),
  })
  private async handlePayrollDeleted(event: PayrollDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Payroll Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPayrollFailedEvent( error,event));
  }
}
