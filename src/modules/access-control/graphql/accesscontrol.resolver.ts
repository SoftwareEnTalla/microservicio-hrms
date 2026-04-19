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
import { AccessControl } from "../entities/access-control.entity";

//Definición de comandos
import {
  CreateAccessControlCommand,
  UpdateAccessControlCommand,
  DeleteAccessControlCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { AccessControlQueryService } from "../services/accesscontrolquery.service";


import { AccessControlResponse, AccessControlsResponse } from "../types/accesscontrol.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateAccessControlDto, 
CreateOrUpdateAccessControlDto, 
AccessControlValueInput, 
AccessControlDto, 
CreateAccessControlDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => AccessControl)
export class AccessControlResolver {

   //Constructor del resolver de AccessControl
  constructor(
    private readonly service: AccessControlQueryService,
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  // Mutaciones
  @Mutation(() => AccessControlResponse<AccessControl>)
  async createAccessControl(
    @Args("input", { type: () => CreateAccessControlDto }) input: CreateAccessControlDto
  ): Promise<AccessControlResponse<AccessControl>> {
    return this.commandBus.execute(new CreateAccessControlCommand(input));
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Mutation(() => AccessControlResponse<AccessControl>)
  async updateAccessControl(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateAccessControlDto
  ): Promise<AccessControlResponse<AccessControl>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateAccessControlCommand(payLoad, {
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Mutation(() => AccessControlResponse<AccessControl>)
  async createOrUpdateAccessControl(
    @Args("data", { type: () => CreateOrUpdateAccessControlDto })
    data: CreateOrUpdateAccessControlDto
  ): Promise<AccessControlResponse<AccessControl>> {
    if (data.id) {
      const existingAccessControl = await this.service.findById(data.id);
      if (existingAccessControl) {
        return this.commandBus.execute(
          new UpdateAccessControlCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateAccessControlDto | UpdateAccessControlDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateAccessControlCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateAccessControlDto | UpdateAccessControlDto).createdBy ||
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteAccessControl(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteAccessControlCommand(id));
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  // Queries
  @Query(() => AccessControlsResponse<AccessControl>)
  async accesscontrols(
    options?: FindManyOptions<AccessControl>,
    paginationArgs?: PaginationArgs
  ): Promise<AccessControlsResponse<AccessControl>> {
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Query(() => AccessControlsResponse<AccessControl>)
  async accesscontrol(
    @Args("id", { type: () => String }) id: string
  ): Promise<AccessControlResponse<AccessControl>> {
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Query(() => AccessControlsResponse<AccessControl>)
  async accesscontrolsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => AccessControlValueInput }) value: AccessControlValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AccessControlsResponse<AccessControl>> {
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Query(() => AccessControlsResponse<AccessControl>)
  async accesscontrolsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AccessControlsResponse<AccessControl>> {
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Query(() => Number)
  async totalAccessControls(): Promise<number> {
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Query(() => AccessControlsResponse<AccessControl>)
  async searchAccessControls(
    @Args("where", { type: () => AccessControlDto, nullable: false })
    where: Record<string, any>
  ): Promise<AccessControlsResponse<AccessControl>> {
    const accesscontrols = await this.service.findAndCount(where);
    return accesscontrols;
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Query(() => AccessControlResponse<AccessControl>, { nullable: true })
  async findOneAccessControl(
    @Args("where", { type: () => AccessControlDto, nullable: false })
    where: Record<string, any>
  ): Promise<AccessControlResponse<AccessControl>> {
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
      .registerClient(AccessControlResolver.name)

      .get(AccessControlResolver.name),
    })
  @Query(() => AccessControlResponse<AccessControl>)
  async findOneAccessControlOrFail(
    @Args("where", { type: () => AccessControlDto, nullable: false })
    where: Record<string, any>
  ): Promise<AccessControlResponse<AccessControl> | Error> {
    return this.service.findOneOrFail(where);
  }
}

