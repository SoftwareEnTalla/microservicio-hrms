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
import { ConfigurationParameter } from "../entities/configuration-parameter.entity";

//Definición de comandos
import {
  CreateConfigurationParameterCommand,
  UpdateConfigurationParameterCommand,
  DeleteConfigurationParameterCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ConfigurationParameterQueryService } from "../services/configurationparameterquery.service";


import { ConfigurationParameterResponse, ConfigurationParametersResponse } from "../types/configurationparameter.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateConfigurationParameterDto, 
CreateOrUpdateConfigurationParameterDto, 
ConfigurationParameterValueInput, 
ConfigurationParameterDto, 
CreateConfigurationParameterDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ConfigurationParameter)
export class ConfigurationParameterResolver {

   //Constructor del resolver de ConfigurationParameter
  constructor(
    private readonly service: ConfigurationParameterQueryService,
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  // Mutaciones
  @Mutation(() => ConfigurationParameterResponse<ConfigurationParameter>)
  async createConfigurationParameter(
    @Args("input", { type: () => CreateConfigurationParameterDto }) input: CreateConfigurationParameterDto
  ): Promise<ConfigurationParameterResponse<ConfigurationParameter>> {
    return this.commandBus.execute(new CreateConfigurationParameterCommand(input));
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Mutation(() => ConfigurationParameterResponse<ConfigurationParameter>)
  async updateConfigurationParameter(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateConfigurationParameterDto
  ): Promise<ConfigurationParameterResponse<ConfigurationParameter>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateConfigurationParameterCommand(payLoad, {
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Mutation(() => ConfigurationParameterResponse<ConfigurationParameter>)
  async createOrUpdateConfigurationParameter(
    @Args("data", { type: () => CreateOrUpdateConfigurationParameterDto })
    data: CreateOrUpdateConfigurationParameterDto
  ): Promise<ConfigurationParameterResponse<ConfigurationParameter>> {
    if (data.id) {
      const existingConfigurationParameter = await this.service.findById(data.id);
      if (existingConfigurationParameter) {
        return this.commandBus.execute(
          new UpdateConfigurationParameterCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateConfigurationParameterDto | UpdateConfigurationParameterDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateConfigurationParameterCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateConfigurationParameterDto | UpdateConfigurationParameterDto).createdBy ||
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteConfigurationParameter(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteConfigurationParameterCommand(id));
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  // Queries
  @Query(() => ConfigurationParametersResponse<ConfigurationParameter>)
  async configurationparameters(
    options?: FindManyOptions<ConfigurationParameter>,
    paginationArgs?: PaginationArgs
  ): Promise<ConfigurationParametersResponse<ConfigurationParameter>> {
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Query(() => ConfigurationParametersResponse<ConfigurationParameter>)
  async configurationparameter(
    @Args("id", { type: () => String }) id: string
  ): Promise<ConfigurationParameterResponse<ConfigurationParameter>> {
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Query(() => ConfigurationParametersResponse<ConfigurationParameter>)
  async configurationparametersByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ConfigurationParameterValueInput }) value: ConfigurationParameterValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ConfigurationParametersResponse<ConfigurationParameter>> {
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Query(() => ConfigurationParametersResponse<ConfigurationParameter>)
  async configurationparametersWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ConfigurationParametersResponse<ConfigurationParameter>> {
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Query(() => Number)
  async totalConfigurationParameters(): Promise<number> {
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Query(() => ConfigurationParametersResponse<ConfigurationParameter>)
  async searchConfigurationParameters(
    @Args("where", { type: () => ConfigurationParameterDto, nullable: false })
    where: Record<string, any>
  ): Promise<ConfigurationParametersResponse<ConfigurationParameter>> {
    const configurationparameters = await this.service.findAndCount(where);
    return configurationparameters;
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Query(() => ConfigurationParameterResponse<ConfigurationParameter>, { nullable: true })
  async findOneConfigurationParameter(
    @Args("where", { type: () => ConfigurationParameterDto, nullable: false })
    where: Record<string, any>
  ): Promise<ConfigurationParameterResponse<ConfigurationParameter>> {
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
      .registerClient(ConfigurationParameterResolver.name)

      .get(ConfigurationParameterResolver.name),
    })
  @Query(() => ConfigurationParameterResponse<ConfigurationParameter>)
  async findOneConfigurationParameterOrFail(
    @Args("where", { type: () => ConfigurationParameterDto, nullable: false })
    where: Record<string, any>
  ): Promise<ConfigurationParameterResponse<ConfigurationParameter> | Error> {
    return this.service.findOneOrFail(where);
  }
}

