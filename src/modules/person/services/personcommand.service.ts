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
import { Person } from "../entities/person.entity";
import { CreatePersonDto, UpdatePersonDto, DeletePersonDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PersonCommandRepository } from "../repositories/personcommand.repository";
import { PersonQueryRepository } from "../repositories/personquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PersonResponse, PersonsResponse } from "../types/person.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PersonQueryService } from "./personquery.service";
import { BaseEvent } from "../events/base.event";
import { PersonArchivedEvent } from '../events/personarchived.event';

@Injectable()
export class PersonCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PersonCommandService.name);
  //Constructo del servicio PersonCommandService
  constructor(
    private readonly repository: PersonCommandRepository,
    private readonly queryRepository: PersonQueryRepository,
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
      .registerClient(PersonQueryService.name)
      .get(PersonQueryService.name),
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
        await this.eventStore.appendEvent('person-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Person | null,
    current?: Person | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: person-names-required
      // Nombre y apellido son obligatorios.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'firstName') === undefined || this.dslValue(entityData, currentData, inputData, 'firstName') === null || (typeof this.dslValue(entityData, currentData, inputData, 'firstName') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'firstName')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'firstName')) && this.dslValue(entityData, currentData, inputData, 'firstName').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'firstName') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'firstName')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'firstName')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'firstName'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'lastName') === undefined || this.dslValue(entityData, currentData, inputData, 'lastName') === null || (typeof this.dslValue(entityData, currentData, inputData, 'lastName') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'lastName')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'lastName')) && this.dslValue(entityData, currentData, inputData, 'lastName').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'lastName') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'lastName')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'lastName')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'lastName'))).length === 0)))) {
        throw new Error('HRMS_PERSON_001: Persona requiere firstName y lastName');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: person-names-required
      // Nombre y apellido son obligatorios.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'firstName') === undefined || this.dslValue(entityData, currentData, inputData, 'firstName') === null || (typeof this.dslValue(entityData, currentData, inputData, 'firstName') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'firstName')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'firstName')) && this.dslValue(entityData, currentData, inputData, 'firstName').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'firstName') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'firstName')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'firstName')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'firstName'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'lastName') === undefined || this.dslValue(entityData, currentData, inputData, 'lastName') === null || (typeof this.dslValue(entityData, currentData, inputData, 'lastName') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'lastName')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'lastName')) && this.dslValue(entityData, currentData, inputData, 'lastName').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'lastName') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'lastName')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'lastName')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'lastName'))).length === 0)))) {
        throw new Error('HRMS_PERSON_001: Persona requiere firstName y lastName');
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
      .registerClient(PersonCommandService.name)
      .get(PersonCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePersonDto>("createPerson", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPersonDtoInput: CreatePersonDto
  ): Promise<PersonResponse<Person>> {
    try {
      logger.info("Receiving in service:", createPersonDtoInput);
      const candidate = Person.fromDto(createPersonDtoInput);
      await this.applyDslServiceRules("create", createPersonDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPersonDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el person no existe
      if (!entity)
        throw new NotFoundException("Entidad Person no encontrada.");
      // Devolver person
      return {
        ok: true,
        message: "Person obtenido con éxito.",
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
      .registerClient(PersonCommandService.name)
      .get(PersonCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Person>("createPersons", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPersonDtosInput: CreatePersonDto[]
  ): Promise<PersonsResponse<Person>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPersonDtosInput.map((entity) => Person.fromDto(entity))
      );

      // Respuesta si el person no existe
      if (!entities)
        throw new NotFoundException("Entidades Persons no encontradas.");
      // Devolver person
      return {
        ok: true,
        message: "Persons creados con éxito.",
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
      .registerClient(PersonCommandService.name)
      .get(PersonCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePersonDto>("updatePerson", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePersonDto
  ): Promise<PersonResponse<Person>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Person(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el person no existe
      if (!entity)
        throw new NotFoundException("Entidades Persons no encontradas.");
      // Devolver person
      return {
        ok: true,
        message: "Person actualizada con éxito.",
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
      .registerClient(PersonCommandService.name)
      .get(PersonCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePersonDto>("updatePersons", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePersonDto[]
  ): Promise<PersonsResponse<Person>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Person.fromDto(entity))
      );
      // Respuesta si el person no existe
      if (!entities)
        throw new NotFoundException("Entidades Persons no encontradas.");
      // Devolver person
      return {
        ok: true,
        message: "Persons actualizadas con éxito.",
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
      .registerClient(PersonCommandService.name)
      .get(PersonCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePersonDto>("deletePerson", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PersonResponse<Person>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el person no existe
      if (!entity)
        throw new NotFoundException("Instancias de Person no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver person
      return {
        ok: true,
        message: "Instancia de Person eliminada con éxito.",
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
      .registerClient(PersonCommandService.name)
      .get(PersonCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePersons", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

