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
import { AccessLevel } from "../entities/access-level.entity";

//Definición de comandos
import {
  CreateAccessLevelCommand,
  UpdateAccessLevelCommand,
  DeleteAccessLevelCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { AccessLevelQueryService } from "../services/accesslevelquery.service";


import { AccessLevelResponse, AccessLevelsResponse } from "../types/accesslevel.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateAccessLevelDto, 
CreateOrUpdateAccessLevelDto, 
AccessLevelValueInput, 
AccessLevelDto, 
CreateAccessLevelDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => AccessLevel)
export class AccessLevelResolver {

   //Constructor del resolver de AccessLevel
  constructor(
    private readonly service: AccessLevelQueryService,
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  // Mutaciones
  @Mutation(() => AccessLevelResponse<AccessLevel>)
  async createAccessLevel(
    @Args("input", { type: () => CreateAccessLevelDto }) input: CreateAccessLevelDto
  ): Promise<AccessLevelResponse<AccessLevel>> {
    return this.commandBus.execute(new CreateAccessLevelCommand(input));
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Mutation(() => AccessLevelResponse<AccessLevel>)
  async updateAccessLevel(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateAccessLevelDto
  ): Promise<AccessLevelResponse<AccessLevel>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateAccessLevelCommand(payLoad, {
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Mutation(() => AccessLevelResponse<AccessLevel>)
  async createOrUpdateAccessLevel(
    @Args("data", { type: () => CreateOrUpdateAccessLevelDto })
    data: CreateOrUpdateAccessLevelDto
  ): Promise<AccessLevelResponse<AccessLevel>> {
    if (data.id) {
      const existingAccessLevel = await this.service.findById(data.id);
      if (existingAccessLevel) {
        return this.commandBus.execute(
          new UpdateAccessLevelCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateAccessLevelDto | UpdateAccessLevelDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateAccessLevelCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateAccessLevelDto | UpdateAccessLevelDto).createdBy ||
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteAccessLevel(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteAccessLevelCommand(id));
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  // Queries
  @Query(() => AccessLevelsResponse<AccessLevel>)
  async accesslevels(
    options?: FindManyOptions<AccessLevel>,
    paginationArgs?: PaginationArgs
  ): Promise<AccessLevelsResponse<AccessLevel>> {
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Query(() => AccessLevelsResponse<AccessLevel>)
  async accesslevel(
    @Args("id", { type: () => String }) id: string
  ): Promise<AccessLevelResponse<AccessLevel>> {
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Query(() => AccessLevelsResponse<AccessLevel>)
  async accesslevelsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => AccessLevelValueInput }) value: AccessLevelValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AccessLevelsResponse<AccessLevel>> {
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Query(() => AccessLevelsResponse<AccessLevel>)
  async accesslevelsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AccessLevelsResponse<AccessLevel>> {
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Query(() => Number)
  async totalAccessLevels(): Promise<number> {
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Query(() => AccessLevelsResponse<AccessLevel>)
  async searchAccessLevels(
    @Args("where", { type: () => AccessLevelDto, nullable: false })
    where: Record<string, any>
  ): Promise<AccessLevelsResponse<AccessLevel>> {
    const accesslevels = await this.service.findAndCount(where);
    return accesslevels;
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Query(() => AccessLevelResponse<AccessLevel>, { nullable: true })
  async findOneAccessLevel(
    @Args("where", { type: () => AccessLevelDto, nullable: false })
    where: Record<string, any>
  ): Promise<AccessLevelResponse<AccessLevel>> {
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
      .registerClient(AccessLevelResolver.name)

      .get(AccessLevelResolver.name),
    })
  @Query(() => AccessLevelResponse<AccessLevel>)
  async findOneAccessLevelOrFail(
    @Args("where", { type: () => AccessLevelDto, nullable: false })
    where: Record<string, any>
  ): Promise<AccessLevelResponse<AccessLevel> | Error> {
    return this.service.findOneOrFail(where);
  }
}

