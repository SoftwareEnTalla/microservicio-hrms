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


import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
  UseGuards,
} from "@nestjs/common";
import { TimeEntryTypeQueryService } from "../services/timeentrytypequery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { TimeEntryTypeResponse, TimeEntryTypesResponse } from "../types/timeentrytype.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { TimeEntryType } from "../entities/time-entry-type.entity";
import { TimeEntryTypeAuthGuard } from "../guards/timeentrytypeauthguard.guard";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { OrderBy, valueOfOrderBy } from "src/common/types/common.types";
import { Helper } from "src/common/helpers/helpers";
import { TimeEntryTypeDto } from "../dtos/all-dto";

import { logger } from '@core/logs/logger';

/**
 * Parseo tolerante del query param 'where':
 *  - Si llega como ?where={JSON}, lo parsea a objeto.
 *  - Si llega como query params planos (?isActive=true) descarta claves
 *    reservadas de paginación y devuelve el resto como where plano.
 *  - Nunca devuelve un objeto envuelto en { where: ... } (evita double-wrap).
 */
function parseWhereParam(all: Record<string, any> = {}): Record<string, any> {
  if (!all || typeof all !== "object") return {};
  const raw = (all as any).where;
  if (typeof raw === "string" && raw.trim().startsWith("{")) {
    try { return JSON.parse(raw); } catch { /* fallthrough */ }
  }
  if (raw && typeof raw === "object") return raw as Record<string, any>;
  const reserved = new Set(["where","page","size","sort","order","search","initDate","endDate","options"]);
  const rest: Record<string, any> = {};
  for (const k of Object.keys(all)) if (!reserved.has(k)) rest[k] = (all as any)[k];
  return rest;
}

@ApiTags("TimeEntryType Query")
@UseGuards(TimeEntryTypeAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("timeentrytypes/query")
export class TimeEntryTypeQueryController {
  #logger = new Logger(TimeEntryTypeQueryController.name);

  constructor(private readonly service: TimeEntryTypeQueryService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all timeentrytype with optional pagination" })
  @ApiResponse({ status: 200, type: TimeEntryTypesResponse })
  @ApiQuery({ name: "options", required: false, type: TimeEntryTypeDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<TimeEntryType>    
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
    try {
     
      const timeentrytypes = await this.service.findAll(options);
      logger.info("Retrieving all timeentrytype");
      return timeentrytypes;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find timeentrytype by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter timeentrytype', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: TimeEntryTypesResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
    try {
      const entities = await this.service.findAndCount(
        { [field]: value },
        paginationArgs
      );

      if (!entities) {
        throw new NotFoundException(
          "TimeEntryType no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }


  @Get("pagination")
  @ApiOperation({ summary: "Find timeentrytypes with pagination" })
  @ApiResponse({ status: 200, type: TimeEntryTypesResponse<TimeEntryType> })
  @ApiQuery({ name: "options", required: false, type: TimeEntryTypeDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<TimeEntryType>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
    try {
     const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades TimeEntryTypes no encontradas.");
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all timeentrytypes" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count timeentrytypes with conditions" })
  @ApiResponse({ status: 200, type: TimeEntryTypesResponse<TimeEntryType> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async findAndCount(
    @Query() all: Record<string, any> = {},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
    try {
      // Parseo tolerante de ?where=JSON o query params planos
      const where: Record<string, any> = parseWhereParam(all);
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        valueOfOrderBy(order || OrderBy.asc), // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findAndCount(where, paginationArgs);

      if (!entities) {
        throw new NotFoundException(
          "Entidades TimeEntryTypes no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one timeentrytype with conditions" })
  @ApiResponse({ status: 200, type: TimeEntryTypeResponse<TimeEntryType> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async findOne(
    @Query() all: Record<string, any> = {}
  ): Promise<TimeEntryTypeResponse<TimeEntryType>> {
    try {
      const where: Record<string, any> = parseWhereParam(all);
      const entity = await this.service.findOne(where);

      if (!entity) {
        throw new NotFoundException("Entidad TimeEntryType no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one timeentrytype or return error" })
  @ApiResponse({ status: 200, type: TimeEntryTypeResponse<TimeEntryType> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async findOneOrFail(
    @Query() all: Record<string, any> = {}
  ): Promise<TimeEntryTypeResponse<TimeEntryType> | Error> {
    try {
      const where: Record<string, any> = parseWhereParam(all);
      const entity = await this.service.findOne(where);

      if (!entity) {
        return new NotFoundException("Entidad TimeEntryType no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  // NOTA: @Get(":id") se declara al FINAL para que los endpoints estáticos
  // (/count, /search, /pagination, /find-one, /find-one-or-fail, /field/:field)
  // sean registrados antes y no sean capturados por el parámetro dinámico :id.
  @Get(":id")
  @ApiOperation({ summary: "Get timeentrytype by ID" })
  @ApiResponse({ status: 200, type: TimeEntryTypeResponse<TimeEntryType> })
  @ApiResponse({ status: 404, description: "TimeEntryType not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the timeentrytype to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: LoggerClient.getInstance()
      .registerClient(TimeEntryTypeQueryService.name)
      .get(TimeEntryTypeQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<TimeEntryTypeResponse<TimeEntryType>> {
    try {
      const timeentrytype = await this.service.findOne({ where: { id } });
      if (!timeentrytype) {
        throw new NotFoundException(
          "TimeEntryType no encontrado para el id solicitado"
        );
      }
      return timeentrytype;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}


