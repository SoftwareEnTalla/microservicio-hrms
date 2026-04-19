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
import { LeaveRequest } from "../entities/leave-request.entity";

//Definición de comandos
import {
  CreateLeaveRequestCommand,
  UpdateLeaveRequestCommand,
  DeleteLeaveRequestCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { LeaveRequestQueryService } from "../services/leaverequestquery.service";


import { LeaveRequestResponse, LeaveRequestsResponse } from "../types/leaverequest.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateLeaveRequestDto, 
CreateOrUpdateLeaveRequestDto, 
LeaveRequestValueInput, 
LeaveRequestDto, 
CreateLeaveRequestDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => LeaveRequest)
export class LeaveRequestResolver {

   //Constructor del resolver de LeaveRequest
  constructor(
    private readonly service: LeaveRequestQueryService,
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  // Mutaciones
  @Mutation(() => LeaveRequestResponse<LeaveRequest>)
  async createLeaveRequest(
    @Args("input", { type: () => CreateLeaveRequestDto }) input: CreateLeaveRequestDto
  ): Promise<LeaveRequestResponse<LeaveRequest>> {
    return this.commandBus.execute(new CreateLeaveRequestCommand(input));
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Mutation(() => LeaveRequestResponse<LeaveRequest>)
  async updateLeaveRequest(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateLeaveRequestDto
  ): Promise<LeaveRequestResponse<LeaveRequest>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateLeaveRequestCommand(payLoad, {
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Mutation(() => LeaveRequestResponse<LeaveRequest>)
  async createOrUpdateLeaveRequest(
    @Args("data", { type: () => CreateOrUpdateLeaveRequestDto })
    data: CreateOrUpdateLeaveRequestDto
  ): Promise<LeaveRequestResponse<LeaveRequest>> {
    if (data.id) {
      const existingLeaveRequest = await this.service.findById(data.id);
      if (existingLeaveRequest) {
        return this.commandBus.execute(
          new UpdateLeaveRequestCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateLeaveRequestDto | UpdateLeaveRequestDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateLeaveRequestCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateLeaveRequestDto | UpdateLeaveRequestDto).createdBy ||
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteLeaveRequest(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteLeaveRequestCommand(id));
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  // Queries
  @Query(() => LeaveRequestsResponse<LeaveRequest>)
  async leaverequests(
    options?: FindManyOptions<LeaveRequest>,
    paginationArgs?: PaginationArgs
  ): Promise<LeaveRequestsResponse<LeaveRequest>> {
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Query(() => LeaveRequestsResponse<LeaveRequest>)
  async leaverequest(
    @Args("id", { type: () => String }) id: string
  ): Promise<LeaveRequestResponse<LeaveRequest>> {
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Query(() => LeaveRequestsResponse<LeaveRequest>)
  async leaverequestsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => LeaveRequestValueInput }) value: LeaveRequestValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LeaveRequestsResponse<LeaveRequest>> {
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Query(() => LeaveRequestsResponse<LeaveRequest>)
  async leaverequestsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LeaveRequestsResponse<LeaveRequest>> {
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Query(() => Number)
  async totalLeaveRequests(): Promise<number> {
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Query(() => LeaveRequestsResponse<LeaveRequest>)
  async searchLeaveRequests(
    @Args("where", { type: () => LeaveRequestDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveRequestsResponse<LeaveRequest>> {
    const leaverequests = await this.service.findAndCount(where);
    return leaverequests;
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Query(() => LeaveRequestResponse<LeaveRequest>, { nullable: true })
  async findOneLeaveRequest(
    @Args("where", { type: () => LeaveRequestDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveRequestResponse<LeaveRequest>> {
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
      .registerClient(LeaveRequestResolver.name)

      .get(LeaveRequestResolver.name),
    })
  @Query(() => LeaveRequestResponse<LeaveRequest>)
  async findOneLeaveRequestOrFail(
    @Args("where", { type: () => LeaveRequestDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveRequestResponse<LeaveRequest> | Error> {
    return this.service.findOneOrFail(where);
  }
}

