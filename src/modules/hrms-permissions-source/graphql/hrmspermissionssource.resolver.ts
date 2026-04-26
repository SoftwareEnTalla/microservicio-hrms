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
import { HrmsPermissionsSource } from "../entities/hrms-permissions-source.entity";

//Definición de comandos
import {
  CreateHrmsPermissionsSourceCommand,
  UpdateHrmsPermissionsSourceCommand,
  DeleteHrmsPermissionsSourceCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { HrmsPermissionsSourceQueryService } from "../services/hrmspermissionssourcequery.service";


import { HrmsPermissionsSourceResponse, HrmsPermissionsSourcesResponse } from "../types/hrmspermissionssource.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateHrmsPermissionsSourceDto, 
CreateOrUpdateHrmsPermissionsSourceDto, 
HrmsPermissionsSourceValueInput, 
HrmsPermissionsSourceDto, 
CreateHrmsPermissionsSourceDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => HrmsPermissionsSource)
export class HrmsPermissionsSourceResolver {

   //Constructor del resolver de HrmsPermissionsSource
  constructor(
    private readonly service: HrmsPermissionsSourceQueryService,
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  // Mutaciones
  @Mutation(() => HrmsPermissionsSourceResponse<HrmsPermissionsSource>)
  async createHrmsPermissionsSource(
    @Args("input", { type: () => CreateHrmsPermissionsSourceDto }) input: CreateHrmsPermissionsSourceDto
  ): Promise<HrmsPermissionsSourceResponse<HrmsPermissionsSource>> {
    return this.commandBus.execute(new CreateHrmsPermissionsSourceCommand(input));
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Mutation(() => HrmsPermissionsSourceResponse<HrmsPermissionsSource>)
  async updateHrmsPermissionsSource(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateHrmsPermissionsSourceDto
  ): Promise<HrmsPermissionsSourceResponse<HrmsPermissionsSource>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateHrmsPermissionsSourceCommand(payLoad, {
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Mutation(() => HrmsPermissionsSourceResponse<HrmsPermissionsSource>)
  async createOrUpdateHrmsPermissionsSource(
    @Args("data", { type: () => CreateOrUpdateHrmsPermissionsSourceDto })
    data: CreateOrUpdateHrmsPermissionsSourceDto
  ): Promise<HrmsPermissionsSourceResponse<HrmsPermissionsSource>> {
    if (data.id) {
      const existingHrmsPermissionsSource = await this.service.findById(data.id);
      if (existingHrmsPermissionsSource) {
        return this.commandBus.execute(
          new UpdateHrmsPermissionsSourceCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateHrmsPermissionsSourceDto | UpdateHrmsPermissionsSourceDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateHrmsPermissionsSourceCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateHrmsPermissionsSourceDto | UpdateHrmsPermissionsSourceDto).createdBy ||
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteHrmsPermissionsSource(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteHrmsPermissionsSourceCommand(id));
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  // Queries
  @Query(() => HrmsPermissionsSourcesResponse<HrmsPermissionsSource>)
  async hrmspermissionssources(
    options?: FindManyOptions<HrmsPermissionsSource>,
    paginationArgs?: PaginationArgs
  ): Promise<HrmsPermissionsSourcesResponse<HrmsPermissionsSource>> {
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Query(() => HrmsPermissionsSourcesResponse<HrmsPermissionsSource>)
  async hrmspermissionssource(
    @Args("id", { type: () => String }) id: string
  ): Promise<HrmsPermissionsSourceResponse<HrmsPermissionsSource>> {
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Query(() => HrmsPermissionsSourcesResponse<HrmsPermissionsSource>)
  async hrmspermissionssourcesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => HrmsPermissionsSourceValueInput }) value: HrmsPermissionsSourceValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HrmsPermissionsSourcesResponse<HrmsPermissionsSource>> {
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Query(() => HrmsPermissionsSourcesResponse<HrmsPermissionsSource>)
  async hrmspermissionssourcesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HrmsPermissionsSourcesResponse<HrmsPermissionsSource>> {
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Query(() => Number)
  async totalHrmsPermissionsSources(): Promise<number> {
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Query(() => HrmsPermissionsSourcesResponse<HrmsPermissionsSource>)
  async searchHrmsPermissionsSources(
    @Args("where", { type: () => HrmsPermissionsSourceDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsPermissionsSourcesResponse<HrmsPermissionsSource>> {
    const hrmspermissionssources = await this.service.findAndCount(where);
    return hrmspermissionssources;
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Query(() => HrmsPermissionsSourceResponse<HrmsPermissionsSource>, { nullable: true })
  async findOneHrmsPermissionsSource(
    @Args("where", { type: () => HrmsPermissionsSourceDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsPermissionsSourceResponse<HrmsPermissionsSource>> {
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
      .registerClient(HrmsPermissionsSourceResolver.name)

      .get(HrmsPermissionsSourceResolver.name),
    })
  @Query(() => HrmsPermissionsSourceResponse<HrmsPermissionsSource>)
  async findOneHrmsPermissionsSourceOrFail(
    @Args("where", { type: () => HrmsPermissionsSourceDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsPermissionsSourceResponse<HrmsPermissionsSource> | Error> {
    return this.service.findOneOrFail(where);
  }
}

