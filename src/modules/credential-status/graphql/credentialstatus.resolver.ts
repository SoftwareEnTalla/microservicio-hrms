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
import { CredentialStatus } from "../entities/credential-status.entity";

//Definición de comandos
import {
  CreateCredentialStatusCommand,
  UpdateCredentialStatusCommand,
  DeleteCredentialStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CredentialStatusQueryService } from "../services/credentialstatusquery.service";


import { CredentialStatusResponse, CredentialStatussResponse } from "../types/credentialstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCredentialStatusDto, 
CreateOrUpdateCredentialStatusDto, 
CredentialStatusValueInput, 
CredentialStatusDto, 
CreateCredentialStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CredentialStatus)
export class CredentialStatusResolver {

   //Constructor del resolver de CredentialStatus
  constructor(
    private readonly service: CredentialStatusQueryService,
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => CredentialStatusResponse<CredentialStatus>)
  async createCredentialStatus(
    @Args("input", { type: () => CreateCredentialStatusDto }) input: CreateCredentialStatusDto
  ): Promise<CredentialStatusResponse<CredentialStatus>> {
    return this.commandBus.execute(new CreateCredentialStatusCommand(input));
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Mutation(() => CredentialStatusResponse<CredentialStatus>)
  async updateCredentialStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCredentialStatusDto
  ): Promise<CredentialStatusResponse<CredentialStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCredentialStatusCommand(payLoad, {
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Mutation(() => CredentialStatusResponse<CredentialStatus>)
  async createOrUpdateCredentialStatus(
    @Args("data", { type: () => CreateOrUpdateCredentialStatusDto })
    data: CreateOrUpdateCredentialStatusDto
  ): Promise<CredentialStatusResponse<CredentialStatus>> {
    if (data.id) {
      const existingCredentialStatus = await this.service.findById(data.id);
      if (existingCredentialStatus) {
        return this.commandBus.execute(
          new UpdateCredentialStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCredentialStatusDto | UpdateCredentialStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCredentialStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCredentialStatusDto | UpdateCredentialStatusDto).createdBy ||
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCredentialStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCredentialStatusCommand(id));
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  // Queries
  @Query(() => CredentialStatussResponse<CredentialStatus>)
  async credentialstatuss(
    options?: FindManyOptions<CredentialStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<CredentialStatussResponse<CredentialStatus>> {
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Query(() => CredentialStatussResponse<CredentialStatus>)
  async credentialstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<CredentialStatusResponse<CredentialStatus>> {
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Query(() => CredentialStatussResponse<CredentialStatus>)
  async credentialstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CredentialStatusValueInput }) value: CredentialStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CredentialStatussResponse<CredentialStatus>> {
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Query(() => CredentialStatussResponse<CredentialStatus>)
  async credentialstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CredentialStatussResponse<CredentialStatus>> {
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Query(() => Number)
  async totalCredentialStatuss(): Promise<number> {
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Query(() => CredentialStatussResponse<CredentialStatus>)
  async searchCredentialStatuss(
    @Args("where", { type: () => CredentialStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<CredentialStatussResponse<CredentialStatus>> {
    const credentialstatuss = await this.service.findAndCount(where);
    return credentialstatuss;
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Query(() => CredentialStatusResponse<CredentialStatus>, { nullable: true })
  async findOneCredentialStatus(
    @Args("where", { type: () => CredentialStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<CredentialStatusResponse<CredentialStatus>> {
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
      .registerClient(CredentialStatusResolver.name)

      .get(CredentialStatusResolver.name),
    })
  @Query(() => CredentialStatusResponse<CredentialStatus>)
  async findOneCredentialStatusOrFail(
    @Args("where", { type: () => CredentialStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<CredentialStatusResponse<CredentialStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

