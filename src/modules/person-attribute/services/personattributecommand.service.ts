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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { PersonAttribute } from "../entities/person-attribute.entity";
import { CreatePersonAttributeDto, UpdatePersonAttributeDto, DeletePersonAttributeDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PersonAttributeCommandRepository } from "../repositories/personattributecommand.repository";
import { PersonAttributeQueryRepository } from "../repositories/personattributequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PersonAttributeResponse, PersonAttributesResponse } from "../types/personattribute.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PersonAttributeQueryService } from "./personattributequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class PersonAttributeCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PersonAttributeCommandService.name);
  //Constructo del servicio PersonAttributeCommandService
  constructor(
    private readonly repository: PersonAttributeCommandRepository,
    private readonly queryRepository: PersonAttributeQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(PersonAttributeQueryService.name)
      .get(PersonAttributeQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('person-attribute-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: PersonAttribute | null,
    current?: PersonAttribute | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: person-attr-key-required
      // El atributo requiere clave.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'attributeKey') === undefined || this.dslValue(entityData, currentData, inputData, 'attributeKey') === null || (typeof this.dslValue(entityData, currentData, inputData, 'attributeKey') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'attributeKey')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'attributeKey')) && this.dslValue(entityData, currentData, inputData, 'attributeKey').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'attributeKey') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'attributeKey')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'attributeKey')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'attributeKey'))).length === 0)))) {
        throw new Error('HRMS_PA_001: attributeKey requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: person-attr-key-required
      // El atributo requiere clave.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'attributeKey') === undefined || this.dslValue(entityData, currentData, inputData, 'attributeKey') === null || (typeof this.dslValue(entityData, currentData, inputData, 'attributeKey') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'attributeKey')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'attributeKey')) && this.dslValue(entityData, currentData, inputData, 'attributeKey').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'attributeKey') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'attributeKey')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'attributeKey')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'attributeKey'))).length === 0)))) {
        throw new Error('HRMS_PA_001: attributeKey requerido');
      }

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(PersonAttributeCommandService.name)
      .get(PersonAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePersonAttributeDto>("createPersonAttribute", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPersonAttributeDtoInput: CreatePersonAttributeDto
  ): Promise<PersonAttributeResponse<PersonAttribute>> {
    try {
      logger.info("Receiving in service:", createPersonAttributeDtoInput);
      const candidate = PersonAttribute.fromDto(createPersonAttributeDtoInput);
      await this.applyDslServiceRules("create", createPersonAttributeDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPersonAttributeDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el personattribute no existe
      if (!entity)
        throw new NotFoundException("Entidad PersonAttribute no encontrada.");
      // Devolver personattribute
      return {
        ok: true,
        message: "PersonAttribute obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(PersonAttributeCommandService.name)
      .get(PersonAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<PersonAttribute>("createPersonAttributes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPersonAttributeDtosInput: CreatePersonAttributeDto[]
  ): Promise<PersonAttributesResponse<PersonAttribute>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPersonAttributeDtosInput.map((entity) => PersonAttribute.fromDto(entity))
      );

      // Respuesta si el personattribute no existe
      if (!entities)
        throw new NotFoundException("Entidades PersonAttributes no encontradas.");
      // Devolver personattribute
      return {
        ok: true,
        message: "PersonAttributes creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(PersonAttributeCommandService.name)
      .get(PersonAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePersonAttributeDto>("updatePersonAttribute", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePersonAttributeDto
  ): Promise<PersonAttributeResponse<PersonAttribute>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new PersonAttribute(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el personattribute no existe
      if (!entity)
        throw new NotFoundException("Entidades PersonAttributes no encontradas.");
      // Devolver personattribute
      return {
        ok: true,
        message: "PersonAttribute actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(PersonAttributeCommandService.name)
      .get(PersonAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePersonAttributeDto>("updatePersonAttributes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePersonAttributeDto[]
  ): Promise<PersonAttributesResponse<PersonAttribute>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => PersonAttribute.fromDto(entity))
      );
      // Respuesta si el personattribute no existe
      if (!entities)
        throw new NotFoundException("Entidades PersonAttributes no encontradas.");
      // Devolver personattribute
      return {
        ok: true,
        message: "PersonAttributes actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(PersonAttributeCommandService.name)
      .get(PersonAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePersonAttributeDto>("deletePersonAttribute", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PersonAttributeResponse<PersonAttribute>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el personattribute no existe
      if (!entity)
        throw new NotFoundException("Instancias de PersonAttribute no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver personattribute
      return {
        ok: true,
        message: "Instancia de PersonAttribute eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(PersonAttributeCommandService.name)
      .get(PersonAttributeCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePersonAttributes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

