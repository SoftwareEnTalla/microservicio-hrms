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
import { AccessControl } from "../entities/access-control.entity";
import { CreateAccessControlDto, UpdateAccessControlDto, DeleteAccessControlDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { AccessControlCommandRepository } from "../repositories/accesscontrolcommand.repository";
import { AccessControlQueryRepository } from "../repositories/accesscontrolquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { AccessControlResponse, AccessControlsResponse } from "../types/accesscontrol.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { AccessControlQueryService } from "./accesscontrolquery.service";
import { BaseEvent } from "../events/base.event";
import { AccessCredentialIssuedEvent } from '../events/accesscredentialissued.event';
import { AccessCredentialRevokedEvent } from '../events/accesscredentialrevoked.event';
import { AccessCredentialLostEvent } from '../events/accesscredentiallost.event';
import { AccessCredentialExpiredEvent } from '../events/accesscredentialexpired.event';
import { AccessCredentialTimeoutEvent } from '../events/accesscredentialtimeout.event';
import { AccessCredentialLockedEvent } from '../events/accesscredentiallocked.event';
import { AccessEventRecordedEvent } from '../events/accesseventrecorded.event';
import { AccessDeniedAlertRaisedEvent } from '../events/accessdeniedalertraised.event';

@Injectable()
export class AccessControlCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(AccessControlCommandService.name);
  //Constructo del servicio AccessControlCommandService
  constructor(
    private readonly repository: AccessControlCommandRepository,
    private readonly queryRepository: AccessControlQueryRepository,
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
      .registerClient(AccessControlQueryService.name)
      .get(AccessControlQueryService.name),
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
        await this.eventStore.appendEvent('access-control-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: AccessControl | null,
    current?: AccessControl | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: access-requires-employee
      // La credencial requiere empleado.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'employeeId') === undefined || this.dslValue(entityData, currentData, inputData, 'employeeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'employeeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && this.dslValue(entityData, currentData, inputData, 'employeeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'employeeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'employeeId'))).length === 0)))) {
        throw new Error('HRMS_AC_001: employeeId requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: access-requires-employee
      // La credencial requiere empleado.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'employeeId') === undefined || this.dslValue(entityData, currentData, inputData, 'employeeId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'employeeId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && this.dslValue(entityData, currentData, inputData, 'employeeId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'employeeId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'employeeId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'employeeId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'employeeId'))).length === 0)))) {
        throw new Error('HRMS_AC_001: employeeId requerido');
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
      .registerClient(AccessControlCommandService.name)
      .get(AccessControlCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateAccessControlDto>("createAccessControl", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createAccessControlDtoInput: CreateAccessControlDto
  ): Promise<AccessControlResponse<AccessControl>> {
    try {
      logger.info("Receiving in service:", createAccessControlDtoInput);
      const candidate = AccessControl.fromDto(createAccessControlDtoInput);
      await this.applyDslServiceRules("create", createAccessControlDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createAccessControlDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el accesscontrol no existe
      if (!entity)
        throw new NotFoundException("Entidad AccessControl no encontrada.");
      // Devolver accesscontrol
      return {
        ok: true,
        message: "AccessControl obtenido con éxito.",
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
      .registerClient(AccessControlCommandService.name)
      .get(AccessControlCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<AccessControl>("createAccessControls", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createAccessControlDtosInput: CreateAccessControlDto[]
  ): Promise<AccessControlsResponse<AccessControl>> {
    try {
      const entities = await this.repository.bulkCreate(
        createAccessControlDtosInput.map((entity) => AccessControl.fromDto(entity))
      );

      // Respuesta si el accesscontrol no existe
      if (!entities)
        throw new NotFoundException("Entidades AccessControls no encontradas.");
      // Devolver accesscontrol
      return {
        ok: true,
        message: "AccessControls creados con éxito.",
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
      .registerClient(AccessControlCommandService.name)
      .get(AccessControlCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateAccessControlDto>("updateAccessControl", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateAccessControlDto
  ): Promise<AccessControlResponse<AccessControl>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new AccessControl(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el accesscontrol no existe
      if (!entity)
        throw new NotFoundException("Entidades AccessControls no encontradas.");
      // Devolver accesscontrol
      return {
        ok: true,
        message: "AccessControl actualizada con éxito.",
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
      .registerClient(AccessControlCommandService.name)
      .get(AccessControlCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateAccessControlDto>("updateAccessControls", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateAccessControlDto[]
  ): Promise<AccessControlsResponse<AccessControl>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => AccessControl.fromDto(entity))
      );
      // Respuesta si el accesscontrol no existe
      if (!entities)
        throw new NotFoundException("Entidades AccessControls no encontradas.");
      // Devolver accesscontrol
      return {
        ok: true,
        message: "AccessControls actualizadas con éxito.",
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
      .registerClient(AccessControlCommandService.name)
      .get(AccessControlCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteAccessControlDto>("deleteAccessControl", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<AccessControlResponse<AccessControl>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el accesscontrol no existe
      if (!entity)
        throw new NotFoundException("Instancias de AccessControl no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver accesscontrol
      return {
        ok: true,
        message: "Instancia de AccessControl eliminada con éxito.",
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
      .registerClient(AccessControlCommandService.name)
      .get(AccessControlCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteAccessControls", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

