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
import { HrmsPermissions } from "../entities/hrms-permissions.entity";
import { CreateHrmsPermissionsDto, UpdateHrmsPermissionsDto, DeleteHrmsPermissionsDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { HrmsPermissionsCommandRepository } from "../repositories/hrmspermissionscommand.repository";
import { HrmsPermissionsQueryRepository } from "../repositories/hrmspermissionsquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { HrmsPermissionsResponse, HrmsPermissionssResponse } from "../types/hrmspermissions.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { HrmsPermissionsQueryService } from "./hrmspermissionsquery.service";
import { BaseEvent } from "../events/base.event";
import { HrmsAclResolvedEvent } from '../events/hrmsaclresolved.event';
import { HrmsPermissionGrantedEvent } from '../events/hrmspermissiongranted.event';
import { HrmsPermissionRevokedEvent } from '../events/hrmspermissionrevoked.event';

@Injectable()
export class HrmsPermissionsCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(HrmsPermissionsCommandService.name);
  //Constructo del servicio HrmsPermissionsCommandService
  constructor(
    private readonly repository: HrmsPermissionsCommandRepository,
    private readonly queryRepository: HrmsPermissionsQueryRepository,
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
      .registerClient(HrmsPermissionsQueryService.name)
      .get(HrmsPermissionsQueryService.name),
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
        await this.eventStore.appendEvent('hrms-permissions-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: HrmsPermissions | null,
    current?: HrmsPermissions | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: hrms-acl-requires-user
      // Toda ACL requiere userId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'userId') === undefined || this.dslValue(entityData, currentData, inputData, 'userId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'userId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && this.dslValue(entityData, currentData, inputData, 'userId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'userId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'userId'))).length === 0)))) {
        throw new Error('HRMS_ACL_001: ACL requiere userId');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: hrms-acl-requires-user
      // Toda ACL requiere userId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'userId') === undefined || this.dslValue(entityData, currentData, inputData, 'userId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'userId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && this.dslValue(entityData, currentData, inputData, 'userId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'userId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'userId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'userId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'userId'))).length === 0)))) {
        throw new Error('HRMS_ACL_001: ACL requiere userId');
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
      .registerClient(HrmsPermissionsCommandService.name)
      .get(HrmsPermissionsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateHrmsPermissionsDto>("createHrmsPermissions", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createHrmsPermissionsDtoInput: CreateHrmsPermissionsDto
  ): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
    try {
      logger.info("Receiving in service:", createHrmsPermissionsDtoInput);
      const candidate = HrmsPermissions.fromDto(createHrmsPermissionsDtoInput);
      await this.applyDslServiceRules("create", createHrmsPermissionsDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createHrmsPermissionsDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el hrmspermissions no existe
      if (!entity)
        throw new NotFoundException("Entidad HrmsPermissions no encontrada.");
      // Devolver hrmspermissions
      return {
        ok: true,
        message: "HrmsPermissions obtenido con éxito.",
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
      .registerClient(HrmsPermissionsCommandService.name)
      .get(HrmsPermissionsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<HrmsPermissions>("createHrmsPermissionss", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createHrmsPermissionsDtosInput: CreateHrmsPermissionsDto[]
  ): Promise<HrmsPermissionssResponse<HrmsPermissions>> {
    try {
      const entities = await this.repository.bulkCreate(
        createHrmsPermissionsDtosInput.map((entity) => HrmsPermissions.fromDto(entity))
      );

      // Respuesta si el hrmspermissions no existe
      if (!entities)
        throw new NotFoundException("Entidades HrmsPermissionss no encontradas.");
      // Devolver hrmspermissions
      return {
        ok: true,
        message: "HrmsPermissionss creados con éxito.",
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
      .registerClient(HrmsPermissionsCommandService.name)
      .get(HrmsPermissionsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateHrmsPermissionsDto>("updateHrmsPermissions", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateHrmsPermissionsDto
  ): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new HrmsPermissions(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el hrmspermissions no existe
      if (!entity)
        throw new NotFoundException("Entidades HrmsPermissionss no encontradas.");
      // Devolver hrmspermissions
      return {
        ok: true,
        message: "HrmsPermissions actualizada con éxito.",
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
      .registerClient(HrmsPermissionsCommandService.name)
      .get(HrmsPermissionsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateHrmsPermissionsDto>("updateHrmsPermissionss", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateHrmsPermissionsDto[]
  ): Promise<HrmsPermissionssResponse<HrmsPermissions>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => HrmsPermissions.fromDto(entity))
      );
      // Respuesta si el hrmspermissions no existe
      if (!entities)
        throw new NotFoundException("Entidades HrmsPermissionss no encontradas.");
      // Devolver hrmspermissions
      return {
        ok: true,
        message: "HrmsPermissionss actualizadas con éxito.",
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
      .registerClient(HrmsPermissionsCommandService.name)
      .get(HrmsPermissionsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteHrmsPermissionsDto>("deleteHrmsPermissions", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el hrmspermissions no existe
      if (!entity)
        throw new NotFoundException("Instancias de HrmsPermissions no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver hrmspermissions
      return {
        ok: true,
        message: "Instancia de HrmsPermissions eliminada con éxito.",
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
      .registerClient(HrmsPermissionsCommandService.name)
      .get(HrmsPermissionsCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteHrmsPermissionss", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

