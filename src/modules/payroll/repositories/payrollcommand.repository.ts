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
import { Injectable, NotFoundException, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { Payroll } from '../entities/payroll.entity';
import { PayrollQueryRepository } from './payrollquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {PayrollRepository} from './payroll.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { PayrollCreatedEvent } from '../events/payrollcreated.event';
import { PayrollUpdatedEvent } from '../events/payrollupdated.event';
import { PayrollDeletedEvent } from '../events/payrolldeleted.event';
import { PayrollCycleCreatedEvent } from "../events/payrollcyclecreated.event";
import { PayrollCycleCalculatedEvent } from "../events/payrollcyclecalculated.event";
import { PayrollApprovedEvent } from "../events/payrollapproved.event";
import { PayrollPaidEvent } from "../events/payrollpaid.event";
import { PayrollCycleClosedEvent } from "../events/payrollcycleclosed.event";
import { PayrollCycleReopenedEvent } from "../events/payrollcyclereopened.event";

//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(PayrollCreatedEvent, PayrollUpdatedEvent, PayrollDeletedEvent, PayrollCycleCreatedEvent, PayrollCycleCalculatedEvent, PayrollApprovedEvent, PayrollPaidEvent, PayrollCycleClosedEvent, PayrollCycleReopenedEvent)
@Injectable()
export class PayrollCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: PayrollCommandRepository
  constructor(
    @InjectRepository(Payroll)
    private readonly repository: Repository<Payroll>,
    private readonly payrollRepository: PayrollQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventBus: EventBus,
    @Optional() @Inject('EVENT_SOURCING_CONFIG') 
    private readonly eventSourcingConfig: EventSourcingConfigOptions = EventSourcingHelper.getDefaultConfig()
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(Payroll.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${Payroll.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  // Helper para determinar si usar Event Sourcing
  private shouldPublishEvent(): boolean {
    return EventSourcingHelper.shouldPublishEvents(this.eventSourcingConfig);
  }

  private shouldUseProjections(): boolean {
    return EventSourcingHelper.shouldUseProjections(this.eventSourcingConfig);
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle Payroll event on repository:', event);
    switch (event.constructor.name) {
      case 'PayrollCreatedEvent':
        return await this.onPayrollCreated(event);
      case 'PayrollUpdatedEvent':
        return await this.onPayrollUpdated(event);
      case 'PayrollDeletedEvent':
        return await this.onPayrollDeleted(event);
      case 'PayrollCycleCreatedEvent':
        return await this.onPayrollCycleCreated(event);
      case 'PayrollCycleCalculatedEvent':
        return await this.onPayrollCycleCalculated(event);
      case 'PayrollApprovedEvent':
        return await this.onPayrollApproved(event);
      case 'PayrollPaidEvent':
        return await this.onPayrollPaid(event);
      case 'PayrollCycleClosedEvent':
        return await this.onPayrollCycleClosed(event);
      case 'PayrollCycleReopenedEvent':
        return await this.onPayrollCycleReopened(event);
    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payroll>('createPayroll', args[0], args[1]),
    ttl: 60,
  })
  private async onPayrollCreated(event: PayrollCreatedEvent) {
    logger.info('Ready to handle onPayrollCreated event on repository:', event);
    const entity = new Payroll();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'payroll';
    }
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payroll>('updatePayroll', args[0], args[1]),
    ttl: 60,
  })
  private async onPayrollUpdated(event: PayrollUpdatedEvent) {
    logger.info('Ready to handle onPayrollUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payroll>('deletePayroll', args[0], args[1]),
    ttl: 60,
  })
  private async onPayrollDeleted(event: PayrollDeletedEvent) {
    logger.info('Ready to handle onPayrollDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }

  private async onPayrollCycleCreated(event: PayrollCycleCreatedEvent) {
    logger.info('Ready to handle onPayrollCycleCreated event on repository:', event);
    const payloadInstance = (event as any).payload?.instance;
    if (payloadInstance) {
      const projectedEntity = this.repository.create({
        ...(payloadInstance as any),
        id: event.aggregateId,
        type: 'payroll'
      } as Partial<Payroll>);
      return await this.repository.save(projectedEntity as Payroll);
    }
    return true;
  }

  private async onPayrollCycleCalculated(event: PayrollCycleCalculatedEvent) {
    logger.info('Ready to handle onPayrollCycleCalculated event on repository:', event);
    const payloadInstance = (event as any).payload?.instance;
    if (payloadInstance) {
      const projectedEntity = this.repository.create({
        ...(payloadInstance as any),
        id: event.aggregateId,
        type: 'payroll'
      } as Partial<Payroll>);
      return await this.repository.save(projectedEntity as Payroll);
    }
    return true;
  }

  private async onPayrollApproved(event: PayrollApprovedEvent) {
    logger.info('Ready to handle onPayrollApproved event on repository:', event);
    const payloadInstance = (event as any).payload?.instance;
    if (payloadInstance) {
      const projectedEntity = this.repository.create({
        ...(payloadInstance as any),
        id: event.aggregateId,
        type: 'payroll'
      } as Partial<Payroll>);
      return await this.repository.save(projectedEntity as Payroll);
    }
    return true;
  }

  private async onPayrollPaid(event: PayrollPaidEvent) {
    logger.info('Ready to handle onPayrollPaid event on repository:', event);
    const payloadInstance = (event as any).payload?.instance;
    if (payloadInstance) {
      const projectedEntity = this.repository.create({
        ...(payloadInstance as any),
        id: event.aggregateId,
        type: 'payroll'
      } as Partial<Payroll>);
      return await this.repository.save(projectedEntity as Payroll);
    }
    return true;
  }

  private async onPayrollCycleClosed(event: PayrollCycleClosedEvent) {
    logger.info('Ready to handle onPayrollCycleClosed event on repository:', event);
    const payloadInstance = (event as any).payload?.instance;
    if (payloadInstance) {
      const projectedEntity = this.repository.create({
        ...(payloadInstance as any),
        id: event.aggregateId,
        type: 'payroll'
      } as Partial<Payroll>);
      return await this.repository.save(projectedEntity as Payroll);
    }
    return true;
  }

  private async onPayrollCycleReopened(event: PayrollCycleReopenedEvent) {
    logger.info('Ready to handle onPayrollCycleReopened event on repository:', event);
    const payloadInstance = (event as any).payload?.instance;
    if (payloadInstance) {
      const projectedEntity = this.repository.create({
        ...(payloadInstance as any),
        id: event.aggregateId,
        type: 'payroll'
      } as Partial<Payroll>);
      return await this.repository.save(projectedEntity as Payroll);
    }
    return true;
  }


  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payroll>('createPayroll',args[0], args[1]), ttl: 60 })
  async create(entity: Payroll): Promise<Payroll> {
    logger.info('Ready to create Payroll on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'payroll';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of Payroll was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const event = new PayrollCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payroll[]>('createPayrolls',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: Payroll[]): Promise<Payroll[]> {
    logger.info('Ready to create Payroll on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'payroll';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of Payroll was created on repository:', result);
    
    // Publicar eventos al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const events = result.map((el) => new PayrollCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      }));
      events.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(events);
    }
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payroll>('updatePayroll',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<Payroll>
  ): Promise<Payroll | null> {
    logger.info('Ready to update Payroll on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update Payroll on repository was successfully :', partialEntity);
    let instance=await this.payrollRepository.findById(id);
    logger.info('Updated instance of Payroll with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event PayrollUpdatedEvent on repository:', instance);
      const event = new PayrollUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<Payroll[]>('updatePayrolls',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<Payroll>[]): Promise<Payroll[]> {
    const updatedEntities: Payroll[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const updateEvent = new PayrollUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              });
            this.eventBus.publish(updateEvent);
            this.eventPublisher.publish(updateEvent);
          }
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deletePayroll',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.payrollRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire PayrollDeletedEvent on repository:', result);
       const event = new PayrollDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      });
       this.eventBus.publish(event);
       this.eventPublisher.publish(event);
     }
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(PayrollRepository.name)
      .get(PayrollRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deletePayrolls',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire PayrollDeletedEvent on repository:', result);
      const deleteEvents = await Promise.all(ids.map(async (id) => {
          const entity = await this.payrollRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new PayrollDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
      deleteEvents.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(deleteEvents);
    }
    return result;
  }
}


