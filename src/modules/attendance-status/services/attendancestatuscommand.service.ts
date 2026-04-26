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
import { AttendanceStatus } from "../entities/attendance-status.entity";
import { CreateAttendanceStatusDto, UpdateAttendanceStatusDto, DeleteAttendanceStatusDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { AttendanceStatusCommandRepository } from "../repositories/attendancestatuscommand.repository";
import { AttendanceStatusQueryRepository } from "../repositories/attendancestatusquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { AttendanceStatusResponse, AttendanceStatussResponse } from "../types/attendancestatus.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { AttendanceStatusQueryService } from "./attendancestatusquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class AttendanceStatusCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(AttendanceStatusCommandService.name);
  //Constructo del servicio AttendanceStatusCommandService
  constructor(
    private readonly repository: AttendanceStatusCommandRepository,
    private readonly queryRepository: AttendanceStatusQueryRepository,
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
      .registerClient(AttendanceStatusQueryService.name)
      .get(AttendanceStatusQueryService.name),
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
        await this.eventStore.appendEvent('attendance-status-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: AttendanceStatus | null,
    current?: AttendanceStatus | null,
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
      .registerClient(AttendanceStatusCommandService.name)
      .get(AttendanceStatusCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateAttendanceStatusDto>("createAttendanceStatus", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createAttendanceStatusDtoInput: CreateAttendanceStatusDto
  ): Promise<AttendanceStatusResponse<AttendanceStatus>> {
    try {
      logger.info("Receiving in service:", createAttendanceStatusDtoInput);
      const candidate = AttendanceStatus.fromDto(createAttendanceStatusDtoInput);
      await this.applyDslServiceRules("create", createAttendanceStatusDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createAttendanceStatusDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el attendancestatus no existe
      if (!entity)
        throw new NotFoundException("Entidad AttendanceStatus no encontrada.");
      // Devolver attendancestatus
      return {
        ok: true,
        message: "AttendanceStatus obtenido con éxito.",
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
      .registerClient(AttendanceStatusCommandService.name)
      .get(AttendanceStatusCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<AttendanceStatus>("createAttendanceStatuss", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createAttendanceStatusDtosInput: CreateAttendanceStatusDto[]
  ): Promise<AttendanceStatussResponse<AttendanceStatus>> {
    try {
      const entities = await this.repository.bulkCreate(
        createAttendanceStatusDtosInput.map((entity) => AttendanceStatus.fromDto(entity))
      );

      // Respuesta si el attendancestatus no existe
      if (!entities)
        throw new NotFoundException("Entidades AttendanceStatuss no encontradas.");
      // Devolver attendancestatus
      return {
        ok: true,
        message: "AttendanceStatuss creados con éxito.",
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
      .registerClient(AttendanceStatusCommandService.name)
      .get(AttendanceStatusCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateAttendanceStatusDto>("updateAttendanceStatus", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateAttendanceStatusDto
  ): Promise<AttendanceStatusResponse<AttendanceStatus>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new AttendanceStatus(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el attendancestatus no existe
      if (!entity)
        throw new NotFoundException("Entidades AttendanceStatuss no encontradas.");
      // Devolver attendancestatus
      return {
        ok: true,
        message: "AttendanceStatus actualizada con éxito.",
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
      .registerClient(AttendanceStatusCommandService.name)
      .get(AttendanceStatusCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateAttendanceStatusDto>("updateAttendanceStatuss", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateAttendanceStatusDto[]
  ): Promise<AttendanceStatussResponse<AttendanceStatus>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => AttendanceStatus.fromDto(entity))
      );
      // Respuesta si el attendancestatus no existe
      if (!entities)
        throw new NotFoundException("Entidades AttendanceStatuss no encontradas.");
      // Devolver attendancestatus
      return {
        ok: true,
        message: "AttendanceStatuss actualizadas con éxito.",
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
      .registerClient(AttendanceStatusCommandService.name)
      .get(AttendanceStatusCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteAttendanceStatusDto>("deleteAttendanceStatus", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<AttendanceStatusResponse<AttendanceStatus>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el attendancestatus no existe
      if (!entity)
        throw new NotFoundException("Instancias de AttendanceStatus no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver attendancestatus
      return {
        ok: true,
        message: "Instancia de AttendanceStatus eliminada con éxito.",
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
      .registerClient(AttendanceStatusCommandService.name)
      .get(AttendanceStatusCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteAttendanceStatuss", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

