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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { LeaveRequestStatus } from "../entities/leave-request-status.entity";

//Definición de comandos
import {
  CreateLeaveRequestStatusCommand,
  UpdateLeaveRequestStatusCommand,
  DeleteLeaveRequestStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { LeaveRequestStatusQueryService } from "../services/leaverequeststatusquery.service";


import { LeaveRequestStatusResponse, LeaveRequestStatussResponse } from "../types/leaverequeststatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateLeaveRequestStatusDto, 
CreateOrUpdateLeaveRequestStatusDto, 
LeaveRequestStatusValueInput, 
LeaveRequestStatusDto, 
CreateLeaveRequestStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => LeaveRequestStatus)
export class LeaveRequestStatusResolver {

   //Constructor del resolver de LeaveRequestStatus
  constructor(
    private readonly service: LeaveRequestStatusQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => LeaveRequestStatusResponse<LeaveRequestStatus>)
  async createLeaveRequestStatus(
    @Args("input", { type: () => CreateLeaveRequestStatusDto }) input: CreateLeaveRequestStatusDto
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    return this.commandBus.execute(new CreateLeaveRequestStatusCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Mutation(() => LeaveRequestStatusResponse<LeaveRequestStatus>)
  async updateLeaveRequestStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateLeaveRequestStatusDto
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateLeaveRequestStatusCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Mutation(() => LeaveRequestStatusResponse<LeaveRequestStatus>)
  async createOrUpdateLeaveRequestStatus(
    @Args("data", { type: () => CreateOrUpdateLeaveRequestStatusDto })
    data: CreateOrUpdateLeaveRequestStatusDto
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    if (data.id) {
      const existingLeaveRequestStatus = await this.service.findById(data.id);
      if (existingLeaveRequestStatus) {
        return this.commandBus.execute(
          new UpdateLeaveRequestStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateLeaveRequestStatusDto | UpdateLeaveRequestStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateLeaveRequestStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateLeaveRequestStatusDto | UpdateLeaveRequestStatusDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteLeaveRequestStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteLeaveRequestStatusCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  // Queries
  @Query(() => LeaveRequestStatussResponse<LeaveRequestStatus>)
  async leaverequeststatuss(
    options?: FindManyOptions<LeaveRequestStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<LeaveRequestStatussResponse<LeaveRequestStatus>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Query(() => LeaveRequestStatussResponse<LeaveRequestStatus>)
  async leaverequeststatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Query(() => LeaveRequestStatussResponse<LeaveRequestStatus>)
  async leaverequeststatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => LeaveRequestStatusValueInput }) value: LeaveRequestStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LeaveRequestStatussResponse<LeaveRequestStatus>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Query(() => LeaveRequestStatussResponse<LeaveRequestStatus>)
  async leaverequeststatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LeaveRequestStatussResponse<LeaveRequestStatus>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Query(() => Number)
  async totalLeaveRequestStatuss(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Query(() => LeaveRequestStatussResponse<LeaveRequestStatus>)
  async searchLeaveRequestStatuss(
    @Args("where", { type: () => LeaveRequestStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveRequestStatussResponse<LeaveRequestStatus>> {
    const leaverequeststatuss = await this.service.findAndCount(where);
    return leaverequeststatuss;
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Query(() => LeaveRequestStatusResponse<LeaveRequestStatus>, { nullable: true })
  async findOneLeaveRequestStatus(
    @Args("where", { type: () => LeaveRequestStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(LeaveRequestStatusResolver.name)

      .get(LeaveRequestStatusResolver.name),
    })
  @Query(() => LeaveRequestStatusResponse<LeaveRequestStatus>)
  async findOneLeaveRequestStatusOrFail(
    @Args("where", { type: () => LeaveRequestStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveRequestStatusResponse<LeaveRequestStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

