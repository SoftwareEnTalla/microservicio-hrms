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
import { ConfigurationParameterScope } from "../entities/configuration-parameter-scope.entity";

//Definición de comandos
import {
  CreateConfigurationParameterScopeCommand,
  UpdateConfigurationParameterScopeCommand,
  DeleteConfigurationParameterScopeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ConfigurationParameterScopeQueryService } from "../services/configurationparameterscopequery.service";


import { ConfigurationParameterScopeResponse, ConfigurationParameterScopesResponse } from "../types/configurationparameterscope.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateConfigurationParameterScopeDto, 
CreateOrUpdateConfigurationParameterScopeDto, 
ConfigurationParameterScopeValueInput, 
ConfigurationParameterScopeDto, 
CreateConfigurationParameterScopeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ConfigurationParameterScope)
export class ConfigurationParameterScopeResolver {

   //Constructor del resolver de ConfigurationParameterScope
  constructor(
    private readonly service: ConfigurationParameterScopeQueryService,
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  // Mutaciones
  @Mutation(() => ConfigurationParameterScopeResponse<ConfigurationParameterScope>)
  async createConfigurationParameterScope(
    @Args("input", { type: () => CreateConfigurationParameterScopeDto }) input: CreateConfigurationParameterScopeDto
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
    return this.commandBus.execute(new CreateConfigurationParameterScopeCommand(input));
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Mutation(() => ConfigurationParameterScopeResponse<ConfigurationParameterScope>)
  async updateConfigurationParameterScope(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateConfigurationParameterScopeDto
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateConfigurationParameterScopeCommand(payLoad, {
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Mutation(() => ConfigurationParameterScopeResponse<ConfigurationParameterScope>)
  async createOrUpdateConfigurationParameterScope(
    @Args("data", { type: () => CreateOrUpdateConfigurationParameterScopeDto })
    data: CreateOrUpdateConfigurationParameterScopeDto
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
    if (data.id) {
      const existingConfigurationParameterScope = await this.service.findById(data.id);
      if (existingConfigurationParameterScope) {
        return this.commandBus.execute(
          new UpdateConfigurationParameterScopeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateConfigurationParameterScopeDto | UpdateConfigurationParameterScopeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateConfigurationParameterScopeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateConfigurationParameterScopeDto | UpdateConfigurationParameterScopeDto).createdBy ||
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteConfigurationParameterScope(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteConfigurationParameterScopeCommand(id));
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  // Queries
  @Query(() => ConfigurationParameterScopesResponse<ConfigurationParameterScope>)
  async configurationparameterscopes(
    options?: FindManyOptions<ConfigurationParameterScope>,
    paginationArgs?: PaginationArgs
  ): Promise<ConfigurationParameterScopesResponse<ConfigurationParameterScope>> {
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Query(() => ConfigurationParameterScopesResponse<ConfigurationParameterScope>)
  async configurationparameterscope(
    @Args("id", { type: () => String }) id: string
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Query(() => ConfigurationParameterScopesResponse<ConfigurationParameterScope>)
  async configurationparameterscopesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ConfigurationParameterScopeValueInput }) value: ConfigurationParameterScopeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ConfigurationParameterScopesResponse<ConfigurationParameterScope>> {
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Query(() => ConfigurationParameterScopesResponse<ConfigurationParameterScope>)
  async configurationparameterscopesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ConfigurationParameterScopesResponse<ConfigurationParameterScope>> {
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Query(() => Number)
  async totalConfigurationParameterScopes(): Promise<number> {
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Query(() => ConfigurationParameterScopesResponse<ConfigurationParameterScope>)
  async searchConfigurationParameterScopes(
    @Args("where", { type: () => ConfigurationParameterScopeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ConfigurationParameterScopesResponse<ConfigurationParameterScope>> {
    const configurationparameterscopes = await this.service.findAndCount(where);
    return configurationparameterscopes;
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Query(() => ConfigurationParameterScopeResponse<ConfigurationParameterScope>, { nullable: true })
  async findOneConfigurationParameterScope(
    @Args("where", { type: () => ConfigurationParameterScopeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope>> {
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
      .registerClient(ConfigurationParameterScopeResolver.name)

      .get(ConfigurationParameterScopeResolver.name),
    })
  @Query(() => ConfigurationParameterScopeResponse<ConfigurationParameterScope>)
  async findOneConfigurationParameterScopeOrFail(
    @Args("where", { type: () => ConfigurationParameterScopeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ConfigurationParameterScopeResponse<ConfigurationParameterScope> | Error> {
    return this.service.findOneOrFail(where);
  }
}

