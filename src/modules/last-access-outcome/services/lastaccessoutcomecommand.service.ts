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
import { LastAccessOutcome } from "../entities/last-access-outcome.entity";
import { CreateLastAccessOutcomeDto, UpdateLastAccessOutcomeDto, DeleteLastAccessOutcomeDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { LastAccessOutcomeCommandRepository } from "../repositories/lastaccessoutcomecommand.repository";
import { LastAccessOutcomeQueryRepository } from "../repositories/lastaccessoutcomequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { LastAccessOutcomeResponse, LastAccessOutcomesResponse } from "../types/lastaccessoutcome.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { LastAccessOutcomeQueryService } from "./lastaccessoutcomequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class LastAccessOutcomeCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(LastAccessOutcomeCommandService.name);
  //Constructo del servicio LastAccessOutcomeCommandService
  constructor(
    private readonly repository: LastAccessOutcomeCommandRepository,
    private readonly queryRepository: LastAccessOutcomeQueryRepository,
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
      .registerClient(LastAccessOutcomeQueryService.name)
      .get(LastAccessOutcomeQueryService.name),
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
        await this.eventStore.appendEvent('last-access-outcome-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: LastAccessOutcome | null,
    current?: LastAccessOutcome | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
// No se definieron business-rules target=service.
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
      .registerClient(LastAccessOutcomeCommandService.name)
      .get(LastAccessOutcomeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateLastAccessOutcomeDto>("createLastAccessOutcome", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createLastAccessOutcomeDtoInput: CreateLastAccessOutcomeDto
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
    try {
      logger.info("Receiving in service:", createLastAccessOutcomeDtoInput);
      const candidate = LastAccessOutcome.fromDto(createLastAccessOutcomeDtoInput);
      await this.applyDslServiceRules("create", createLastAccessOutcomeDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createLastAccessOutcomeDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el lastaccessoutcome no existe
      if (!entity)
        throw new NotFoundException("Entidad LastAccessOutcome no encontrada.");
      // Devolver lastaccessoutcome
      return {
        ok: true,
        message: "LastAccessOutcome obtenido con éxito.",
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
      .registerClient(LastAccessOutcomeCommandService.name)
      .get(LastAccessOutcomeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<LastAccessOutcome>("createLastAccessOutcomes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createLastAccessOutcomeDtosInput: CreateLastAccessOutcomeDto[]
  ): Promise<LastAccessOutcomesResponse<LastAccessOutcome>> {
    try {
      const entities = await this.repository.bulkCreate(
        createLastAccessOutcomeDtosInput.map((entity) => LastAccessOutcome.fromDto(entity))
      );

      // Respuesta si el lastaccessoutcome no existe
      if (!entities)
        throw new NotFoundException("Entidades LastAccessOutcomes no encontradas.");
      // Devolver lastaccessoutcome
      return {
        ok: true,
        message: "LastAccessOutcomes creados con éxito.",
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
      .registerClient(LastAccessOutcomeCommandService.name)
      .get(LastAccessOutcomeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateLastAccessOutcomeDto>("updateLastAccessOutcome", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateLastAccessOutcomeDto
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new LastAccessOutcome(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el lastaccessoutcome no existe
      if (!entity)
        throw new NotFoundException("Entidades LastAccessOutcomes no encontradas.");
      // Devolver lastaccessoutcome
      return {
        ok: true,
        message: "LastAccessOutcome actualizada con éxito.",
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
      .registerClient(LastAccessOutcomeCommandService.name)
      .get(LastAccessOutcomeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateLastAccessOutcomeDto>("updateLastAccessOutcomes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateLastAccessOutcomeDto[]
  ): Promise<LastAccessOutcomesResponse<LastAccessOutcome>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => LastAccessOutcome.fromDto(entity))
      );
      // Respuesta si el lastaccessoutcome no existe
      if (!entities)
        throw new NotFoundException("Entidades LastAccessOutcomes no encontradas.");
      // Devolver lastaccessoutcome
      return {
        ok: true,
        message: "LastAccessOutcomes actualizadas con éxito.",
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
      .registerClient(LastAccessOutcomeCommandService.name)
      .get(LastAccessOutcomeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteLastAccessOutcomeDto>("deleteLastAccessOutcome", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el lastaccessoutcome no existe
      if (!entity)
        throw new NotFoundException("Instancias de LastAccessOutcome no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver lastaccessoutcome
      return {
        ok: true,
        message: "Instancia de LastAccessOutcome eliminada con éxito.",
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
      .registerClient(LastAccessOutcomeCommandService.name)
      .get(LastAccessOutcomeCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteLastAccessOutcomes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

