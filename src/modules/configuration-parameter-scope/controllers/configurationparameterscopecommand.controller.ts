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
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ConfigurationParameterScopeCommandService } from "../services/configurationparameterscopecommand.service";
import { ConfigurationParameterScopeAuthGuard } from "../guards/configurationparameterscopeauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { ConfigurationParameterScope } from "../entities/configuration-parameter-scope.entity";
import { ConfigurationParameterScopeResponse, ConfigurationParameterScopesResponse } from "../types/configurationparameterscope.types";
import { CreateConfigurationParameterScopeDto, UpdateConfigurationParameterScopeDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { ConfigurationParameterScopeCreatedEvent } from "../events/configurationparameterscopecreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("ConfigurationParameterScope Command")
@UseGuards(ConfigurationParameterScopeAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("configurationparameterscopes/command")
export class ConfigurationParameterScopeCommandController {

  #logger = new Logger(ConfigurationParameterScopeCommandController.name);

  //Constructor del controlador: ConfigurationParameterScopeCommandController
  constructor(
  private readonly service: ConfigurationParameterScopeCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new configurationparameterscope" })
  @ApiBody({ type: CreateConfigurationParameterScopeDto })
  @ApiResponse({ status: 201, type: ConfigurationParameterScopeResponse<ConfigurationParameterScope> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ConfigurationParameterScopeCommandController.name)
      .get(ConfigurationParameterScopeCommandController.name),
  })
  async create(
    @Body() createConfigurationParameterScopeDtoInput: CreateConfigurationParameterScopeDto
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
    try {
      logger.info("Receiving in controller:", createConfigurationParameterScopeDtoInput);
      const entity = await this.service.create(createConfigurationParameterScopeDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response configurationparameterscope entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("ConfigurationParameterScope entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id configurationparameterscope is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple configurationparameterscopes" })
  @ApiBody({ type: [CreateConfigurationParameterScopeDto] })
  @ApiResponse({ status: 201, type: ConfigurationParameterScopesResponse<ConfigurationParameterScope> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ConfigurationParameterScopeCommandController.name)
      .get(ConfigurationParameterScopeCommandController.name),
  })
  async bulkCreate(
    @Body() createConfigurationParameterScopeDtosInput: CreateConfigurationParameterScopeDto[]
  ): Promise<ConfigurationParameterScopesResponse<ConfigurationParameterScope>> {
    try {
      const entities = await this.service.bulkCreate(createConfigurationParameterScopeDtosInput);

      if (!entities) {
        throw new NotFoundException("ConfigurationParameterScope entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an configurationparameterscope" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateConfigurationParameterScopeDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: ConfigurationParameterScopeResponse<ConfigurationParameterScope> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia ConfigurationParameterScope a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ConfigurationParameterScopeCommandController.name)
      .get(ConfigurationParameterScopeCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs (auto-asigna id de la URL si el body no lo trae)
      if (partialEntity?.id && id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de ConfigurationParameterScope a actualizar."
        );
      }
      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de ConfigurationParameterScope no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple configurationparameterscopes" })
  @ApiBody({ type: [UpdateConfigurationParameterScopeDto] })
  @ApiResponse({ status: 200, type: ConfigurationParameterScopesResponse<ConfigurationParameterScope> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ConfigurationParameterScopeCommandController.name)
      .get(ConfigurationParameterScopeCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateConfigurationParameterScopeDto[]
  ): Promise<ConfigurationParameterScopesResponse<ConfigurationParameterScope>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("ConfigurationParameterScope entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an configurationparameterscope" })   
  @ApiResponse({ status: 200, type: ConfigurationParameterScopeResponse<ConfigurationParameterScope>,description:
    "Instancia de ConfigurationParameterScope eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia ConfigurationParameterScope a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ConfigurationParameterScopeCommandController.name)
      .get(ConfigurationParameterScopeCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("ConfigurationParameterScope entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple configurationparameterscopes" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(ConfigurationParameterScopeCommandController.name)
      .get(ConfigurationParameterScopeCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

