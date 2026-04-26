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
import { ScopeType } from "../entities/scope-type.entity";

//Definición de comandos
import {
  CreateScopeTypeCommand,
  UpdateScopeTypeCommand,
  DeleteScopeTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ScopeTypeQueryService } from "../services/scopetypequery.service";


import { ScopeTypeResponse, ScopeTypesResponse } from "../types/scopetype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateScopeTypeDto, 
CreateOrUpdateScopeTypeDto, 
ScopeTypeValueInput, 
ScopeTypeDto, 
CreateScopeTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ScopeType)
export class ScopeTypeResolver {

   //Constructor del resolver de ScopeType
  constructor(
    private readonly service: ScopeTypeQueryService,
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => ScopeTypeResponse<ScopeType>)
  async createScopeType(
    @Args("input", { type: () => CreateScopeTypeDto }) input: CreateScopeTypeDto
  ): Promise<ScopeTypeResponse<ScopeType>> {
    return this.commandBus.execute(new CreateScopeTypeCommand(input));
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Mutation(() => ScopeTypeResponse<ScopeType>)
  async updateScopeType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateScopeTypeDto
  ): Promise<ScopeTypeResponse<ScopeType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateScopeTypeCommand(payLoad, {
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Mutation(() => ScopeTypeResponse<ScopeType>)
  async createOrUpdateScopeType(
    @Args("data", { type: () => CreateOrUpdateScopeTypeDto })
    data: CreateOrUpdateScopeTypeDto
  ): Promise<ScopeTypeResponse<ScopeType>> {
    if (data.id) {
      const existingScopeType = await this.service.findById(data.id);
      if (existingScopeType) {
        return this.commandBus.execute(
          new UpdateScopeTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateScopeTypeDto | UpdateScopeTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateScopeTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateScopeTypeDto | UpdateScopeTypeDto).createdBy ||
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteScopeType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteScopeTypeCommand(id));
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  // Queries
  @Query(() => ScopeTypesResponse<ScopeType>)
  async scopetypes(
    options?: FindManyOptions<ScopeType>,
    paginationArgs?: PaginationArgs
  ): Promise<ScopeTypesResponse<ScopeType>> {
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Query(() => ScopeTypesResponse<ScopeType>)
  async scopetype(
    @Args("id", { type: () => String }) id: string
  ): Promise<ScopeTypeResponse<ScopeType>> {
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Query(() => ScopeTypesResponse<ScopeType>)
  async scopetypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ScopeTypeValueInput }) value: ScopeTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ScopeTypesResponse<ScopeType>> {
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Query(() => ScopeTypesResponse<ScopeType>)
  async scopetypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ScopeTypesResponse<ScopeType>> {
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Query(() => Number)
  async totalScopeTypes(): Promise<number> {
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Query(() => ScopeTypesResponse<ScopeType>)
  async searchScopeTypes(
    @Args("where", { type: () => ScopeTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ScopeTypesResponse<ScopeType>> {
    const scopetypes = await this.service.findAndCount(where);
    return scopetypes;
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Query(() => ScopeTypeResponse<ScopeType>, { nullable: true })
  async findOneScopeType(
    @Args("where", { type: () => ScopeTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ScopeTypeResponse<ScopeType>> {
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
      .registerClient(ScopeTypeResolver.name)

      .get(ScopeTypeResolver.name),
    })
  @Query(() => ScopeTypeResponse<ScopeType>)
  async findOneScopeTypeOrFail(
    @Args("where", { type: () => ScopeTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ScopeTypeResponse<ScopeType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

