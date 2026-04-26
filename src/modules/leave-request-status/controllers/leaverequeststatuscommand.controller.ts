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
import { LeaveRequestStatusCommandService } from "../services/leaverequeststatuscommand.service";
import { LeaveRequestStatusAuthGuard } from "../guards/leaverequeststatusauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { LeaveRequestStatus } from "../entities/leave-request-status.entity";
import { LeaveRequestStatusResponse, LeaveRequestStatussResponse } from "../types/leaverequeststatus.types";
import { CreateLeaveRequestStatusDto, UpdateLeaveRequestStatusDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { LeaveRequestStatusCreatedEvent } from "../events/leaverequeststatuscreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("LeaveRequestStatus Command")
@UseGuards(LeaveRequestStatusAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("leaverequeststatuss/command")
export class LeaveRequestStatusCommandController {

  #logger = new Logger(LeaveRequestStatusCommandController.name);

  //Constructor del controlador: LeaveRequestStatusCommandController
  constructor(
  private readonly service: LeaveRequestStatusCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new leaverequeststatus" })
  @ApiBody({ type: CreateLeaveRequestStatusDto })
  @ApiResponse({ status: 201, type: LeaveRequestStatusResponse<LeaveRequestStatus> })
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
      .registerClient(LeaveRequestStatusCommandController.name)
      .get(LeaveRequestStatusCommandController.name),
  })
  async create(
    @Body() createLeaveRequestStatusDtoInput: CreateLeaveRequestStatusDto
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    try {
      logger.info("Receiving in controller:", createLeaveRequestStatusDtoInput);
      const entity = await this.service.create(createLeaveRequestStatusDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response leaverequeststatus entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("LeaveRequestStatus entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id leaverequeststatus is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple leaverequeststatuss" })
  @ApiBody({ type: [CreateLeaveRequestStatusDto] })
  @ApiResponse({ status: 201, type: LeaveRequestStatussResponse<LeaveRequestStatus> })
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
      .registerClient(LeaveRequestStatusCommandController.name)
      .get(LeaveRequestStatusCommandController.name),
  })
  async bulkCreate(
    @Body() createLeaveRequestStatusDtosInput: CreateLeaveRequestStatusDto[]
  ): Promise<LeaveRequestStatussResponse<LeaveRequestStatus>> {
    try {
      const entities = await this.service.bulkCreate(createLeaveRequestStatusDtosInput);

      if (!entities) {
        throw new NotFoundException("LeaveRequestStatus entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an leaverequeststatus" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateLeaveRequestStatusDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: LeaveRequestStatusResponse<LeaveRequestStatus> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia LeaveRequestStatus a actualizar.",
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
      .registerClient(LeaveRequestStatusCommandController.name)
      .get(LeaveRequestStatusCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs (auto-asigna id de la URL si el body no lo trae)
      if (partialEntity?.id && id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de LeaveRequestStatus a actualizar."
        );
      }
      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de LeaveRequestStatus no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple leaverequeststatuss" })
  @ApiBody({ type: [UpdateLeaveRequestStatusDto] })
  @ApiResponse({ status: 200, type: LeaveRequestStatussResponse<LeaveRequestStatus> })
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
      .registerClient(LeaveRequestStatusCommandController.name)
      .get(LeaveRequestStatusCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateLeaveRequestStatusDto[]
  ): Promise<LeaveRequestStatussResponse<LeaveRequestStatus>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("LeaveRequestStatus entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an leaverequeststatus" })   
  @ApiResponse({ status: 200, type: LeaveRequestStatusResponse<LeaveRequestStatus>,description:
    "Instancia de LeaveRequestStatus eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia LeaveRequestStatus a eliminar.",
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
      .registerClient(LeaveRequestStatusCommandController.name)
      .get(LeaveRequestStatusCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("LeaveRequestStatus entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple leaverequeststatuss" })
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
      .registerClient(LeaveRequestStatusCommandController.name)
      .get(LeaveRequestStatusCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

