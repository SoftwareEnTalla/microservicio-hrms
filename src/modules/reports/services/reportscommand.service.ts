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
import { Reports } from "../entities/reports.entity";
import { CreateReportsDto, UpdateReportsDto, DeleteReportsDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ReportsCommandRepository } from "../repositories/reportscommand.repository";
import { ReportsQueryRepository } from "../repositories/reportsquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ReportsResponse, ReportssResponse } from "../types/reports.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ReportsQueryService } from "./reportsquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class ReportsCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ReportsCommandService.name);
  //Constructo del servicio ReportsCommandService
  constructor(
    private readonly repository: ReportsCommandRepository,
    private readonly queryRepository: ReportsQueryRepository,
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
      .registerClient(ReportsQueryService.name)
      .get(ReportsQueryService.name),
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
        await this.eventStore.appendEvent('reports-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Reports | null,
    current?: Reports | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: report-code-required
      // reportCode requerido.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'reportCode') === undefined || this.dslValue(entityData, currentData, inputData, 'reportCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'reportCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'reportCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'reportCode')) && this.dslValue(entityData, currentData, inputData, 'reportCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'reportCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'reportCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'reportCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'reportCode'))).length === 0)))) {
        throw new Error('HRMS_RPT_001: reportCode requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: report-code-required
      // reportCode requerido.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'reportCode') === undefined || this.dslValue(entityData, currentData, inputData, 'reportCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'reportCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'reportCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'reportCode')) && this.dslValue(entityData, currentData, inputData, 'reportCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'reportCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'reportCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'reportCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'reportCode'))).length === 0)))) {
        throw new Error('HRMS_RPT_001: reportCode requerido');
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
      .registerClient(ReportsCommandService.name)
      .get(ReportsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateReportsDto>("createReports", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createReportsDtoInput: CreateReportsDto
  ): Promise<ReportsResponse<Reports>> {
    try {
      logger.info("Receiving in service:", createReportsDtoInput);
      const candidate = Reports.fromDto(createReportsDtoInput);
      await this.applyDslServiceRules("create", createReportsDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createReportsDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el reports no existe
      if (!entity)
        throw new NotFoundException("Entidad Reports no encontrada.");
      // Devolver reports
      return {
        ok: true,
        message: "Reports obtenido con éxito.",
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
      .registerClient(ReportsCommandService.name)
      .get(ReportsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Reports>("createReportss", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createReportsDtosInput: CreateReportsDto[]
  ): Promise<ReportssResponse<Reports>> {
    try {
      const entities = await this.repository.bulkCreate(
        createReportsDtosInput.map((entity) => Reports.fromDto(entity))
      );

      // Respuesta si el reports no existe
      if (!entities)
        throw new NotFoundException("Entidades Reportss no encontradas.");
      // Devolver reports
      return {
        ok: true,
        message: "Reportss creados con éxito.",
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
      .registerClient(ReportsCommandService.name)
      .get(ReportsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateReportsDto>("updateReports", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateReportsDto
  ): Promise<ReportsResponse<Reports>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Reports(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el reports no existe
      if (!entity)
        throw new NotFoundException("Entidades Reportss no encontradas.");
      // Devolver reports
      return {
        ok: true,
        message: "Reports actualizada con éxito.",
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
      .registerClient(ReportsCommandService.name)
      .get(ReportsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateReportsDto>("updateReportss", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateReportsDto[]
  ): Promise<ReportssResponse<Reports>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Reports.fromDto(entity))
      );
      // Respuesta si el reports no existe
      if (!entities)
        throw new NotFoundException("Entidades Reportss no encontradas.");
      // Devolver reports
      return {
        ok: true,
        message: "Reportss actualizadas con éxito.",
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
      .registerClient(ReportsCommandService.name)
      .get(ReportsCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteReportsDto>("deleteReports", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ReportsResponse<Reports>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el reports no existe
      if (!entity)
        throw new NotFoundException("Instancias de Reports no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver reports
      return {
        ok: true,
        message: "Instancia de Reports eliminada con éxito.",
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
      .registerClient(ReportsCommandService.name)
      .get(ReportsCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteReportss", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

