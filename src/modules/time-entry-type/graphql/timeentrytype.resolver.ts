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
import { TimeEntryType } from "../entities/time-entry-type.entity";

//Definición de comandos
import {
  CreateTimeEntryTypeCommand,
  UpdateTimeEntryTypeCommand,
  DeleteTimeEntryTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { TimeEntryTypeQueryService } from "../services/timeentrytypequery.service";


import { TimeEntryTypeResponse, TimeEntryTypesResponse } from "../types/timeentrytype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateTimeEntryTypeDto, 
CreateOrUpdateTimeEntryTypeDto, 
TimeEntryTypeValueInput, 
TimeEntryTypeDto, 
CreateTimeEntryTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => TimeEntryType)
export class TimeEntryTypeResolver {

   //Constructor del resolver de TimeEntryType
  constructor(
    private readonly service: TimeEntryTypeQueryService,
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => TimeEntryTypeResponse<TimeEntryType>)
  async createTimeEntryType(
    @Args("input", { type: () => CreateTimeEntryTypeDto }) input: CreateTimeEntryTypeDto
  ): Promise<TimeEntryTypeResponse<TimeEntryType>> {
    return this.commandBus.execute(new CreateTimeEntryTypeCommand(input));
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Mutation(() => TimeEntryTypeResponse<TimeEntryType>)
  async updateTimeEntryType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateTimeEntryTypeDto
  ): Promise<TimeEntryTypeResponse<TimeEntryType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateTimeEntryTypeCommand(payLoad, {
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Mutation(() => TimeEntryTypeResponse<TimeEntryType>)
  async createOrUpdateTimeEntryType(
    @Args("data", { type: () => CreateOrUpdateTimeEntryTypeDto })
    data: CreateOrUpdateTimeEntryTypeDto
  ): Promise<TimeEntryTypeResponse<TimeEntryType>> {
    if (data.id) {
      const existingTimeEntryType = await this.service.findById(data.id);
      if (existingTimeEntryType) {
        return this.commandBus.execute(
          new UpdateTimeEntryTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateTimeEntryTypeDto | UpdateTimeEntryTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateTimeEntryTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateTimeEntryTypeDto | UpdateTimeEntryTypeDto).createdBy ||
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteTimeEntryType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteTimeEntryTypeCommand(id));
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  // Queries
  @Query(() => TimeEntryTypesResponse<TimeEntryType>)
  async timeentrytypes(
    options?: FindManyOptions<TimeEntryType>,
    paginationArgs?: PaginationArgs
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Query(() => TimeEntryTypesResponse<TimeEntryType>)
  async timeentrytype(
    @Args("id", { type: () => String }) id: string
  ): Promise<TimeEntryTypeResponse<TimeEntryType>> {
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Query(() => TimeEntryTypesResponse<TimeEntryType>)
  async timeentrytypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => TimeEntryTypeValueInput }) value: TimeEntryTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Query(() => TimeEntryTypesResponse<TimeEntryType>)
  async timeentrytypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Query(() => Number)
  async totalTimeEntryTypes(): Promise<number> {
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Query(() => TimeEntryTypesResponse<TimeEntryType>)
  async searchTimeEntryTypes(
    @Args("where", { type: () => TimeEntryTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<TimeEntryTypesResponse<TimeEntryType>> {
    const timeentrytypes = await this.service.findAndCount(where);
    return timeentrytypes;
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Query(() => TimeEntryTypeResponse<TimeEntryType>, { nullable: true })
  async findOneTimeEntryType(
    @Args("where", { type: () => TimeEntryTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<TimeEntryTypeResponse<TimeEntryType>> {
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
      .registerClient(TimeEntryTypeResolver.name)

      .get(TimeEntryTypeResolver.name),
    })
  @Query(() => TimeEntryTypeResponse<TimeEntryType>)
  async findOneTimeEntryTypeOrFail(
    @Args("where", { type: () => TimeEntryTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<TimeEntryTypeResponse<TimeEntryType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

