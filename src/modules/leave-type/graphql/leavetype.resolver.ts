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
import { LeaveType } from "../entities/leave-type.entity";

//Definición de comandos
import {
  CreateLeaveTypeCommand,
  UpdateLeaveTypeCommand,
  DeleteLeaveTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { LeaveTypeQueryService } from "../services/leavetypequery.service";


import { LeaveTypeResponse, LeaveTypesResponse } from "../types/leavetype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateLeaveTypeDto, 
CreateOrUpdateLeaveTypeDto, 
LeaveTypeValueInput, 
LeaveTypeDto, 
CreateLeaveTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => LeaveType)
export class LeaveTypeResolver {

   //Constructor del resolver de LeaveType
  constructor(
    private readonly service: LeaveTypeQueryService,
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => LeaveTypeResponse<LeaveType>)
  async createLeaveType(
    @Args("input", { type: () => CreateLeaveTypeDto }) input: CreateLeaveTypeDto
  ): Promise<LeaveTypeResponse<LeaveType>> {
    return this.commandBus.execute(new CreateLeaveTypeCommand(input));
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Mutation(() => LeaveTypeResponse<LeaveType>)
  async updateLeaveType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateLeaveTypeDto
  ): Promise<LeaveTypeResponse<LeaveType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateLeaveTypeCommand(payLoad, {
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Mutation(() => LeaveTypeResponse<LeaveType>)
  async createOrUpdateLeaveType(
    @Args("data", { type: () => CreateOrUpdateLeaveTypeDto })
    data: CreateOrUpdateLeaveTypeDto
  ): Promise<LeaveTypeResponse<LeaveType>> {
    if (data.id) {
      const existingLeaveType = await this.service.findById(data.id);
      if (existingLeaveType) {
        return this.commandBus.execute(
          new UpdateLeaveTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateLeaveTypeDto | UpdateLeaveTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateLeaveTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateLeaveTypeDto | UpdateLeaveTypeDto).createdBy ||
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteLeaveType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteLeaveTypeCommand(id));
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  // Queries
  @Query(() => LeaveTypesResponse<LeaveType>)
  async leavetypes(
    options?: FindManyOptions<LeaveType>,
    paginationArgs?: PaginationArgs
  ): Promise<LeaveTypesResponse<LeaveType>> {
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Query(() => LeaveTypesResponse<LeaveType>)
  async leavetype(
    @Args("id", { type: () => String }) id: string
  ): Promise<LeaveTypeResponse<LeaveType>> {
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Query(() => LeaveTypesResponse<LeaveType>)
  async leavetypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => LeaveTypeValueInput }) value: LeaveTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LeaveTypesResponse<LeaveType>> {
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Query(() => LeaveTypesResponse<LeaveType>)
  async leavetypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LeaveTypesResponse<LeaveType>> {
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Query(() => Number)
  async totalLeaveTypes(): Promise<number> {
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Query(() => LeaveTypesResponse<LeaveType>)
  async searchLeaveTypes(
    @Args("where", { type: () => LeaveTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveTypesResponse<LeaveType>> {
    const leavetypes = await this.service.findAndCount(where);
    return leavetypes;
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Query(() => LeaveTypeResponse<LeaveType>, { nullable: true })
  async findOneLeaveType(
    @Args("where", { type: () => LeaveTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveTypeResponse<LeaveType>> {
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
      .registerClient(LeaveTypeResolver.name)

      .get(LeaveTypeResolver.name),
    })
  @Query(() => LeaveTypeResponse<LeaveType>)
  async findOneLeaveTypeOrFail(
    @Args("where", { type: () => LeaveTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<LeaveTypeResponse<LeaveType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

