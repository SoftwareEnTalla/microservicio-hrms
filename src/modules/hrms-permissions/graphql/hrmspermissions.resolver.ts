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
import { HrmsPermissions } from "../entities/hrms-permissions.entity";

//Definición de comandos
import {
  CreateHrmsPermissionsCommand,
  UpdateHrmsPermissionsCommand,
  DeleteHrmsPermissionsCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { HrmsPermissionsQueryService } from "../services/hrmspermissionsquery.service";


import { HrmsPermissionsResponse, HrmsPermissionssResponse } from "../types/hrmspermissions.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateHrmsPermissionsDto, 
CreateOrUpdateHrmsPermissionsDto, 
HrmsPermissionsValueInput, 
HrmsPermissionsDto, 
CreateHrmsPermissionsDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => HrmsPermissions)
export class HrmsPermissionsResolver {

   //Constructor del resolver de HrmsPermissions
  constructor(
    private readonly service: HrmsPermissionsQueryService,
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  // Mutaciones
  @Mutation(() => HrmsPermissionsResponse<HrmsPermissions>)
  async createHrmsPermissions(
    @Args("input", { type: () => CreateHrmsPermissionsDto }) input: CreateHrmsPermissionsDto
  ): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
    return this.commandBus.execute(new CreateHrmsPermissionsCommand(input));
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Mutation(() => HrmsPermissionsResponse<HrmsPermissions>)
  async updateHrmsPermissions(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateHrmsPermissionsDto
  ): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateHrmsPermissionsCommand(payLoad, {
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Mutation(() => HrmsPermissionsResponse<HrmsPermissions>)
  async createOrUpdateHrmsPermissions(
    @Args("data", { type: () => CreateOrUpdateHrmsPermissionsDto })
    data: CreateOrUpdateHrmsPermissionsDto
  ): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
    if (data.id) {
      const existingHrmsPermissions = await this.service.findById(data.id);
      if (existingHrmsPermissions) {
        return this.commandBus.execute(
          new UpdateHrmsPermissionsCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateHrmsPermissionsDto | UpdateHrmsPermissionsDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateHrmsPermissionsCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateHrmsPermissionsDto | UpdateHrmsPermissionsDto).createdBy ||
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteHrmsPermissions(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteHrmsPermissionsCommand(id));
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  // Queries
  @Query(() => HrmsPermissionssResponse<HrmsPermissions>)
  async hrmspermissionss(
    options?: FindManyOptions<HrmsPermissions>,
    paginationArgs?: PaginationArgs
  ): Promise<HrmsPermissionssResponse<HrmsPermissions>> {
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Query(() => HrmsPermissionssResponse<HrmsPermissions>)
  async hrmspermissions(
    @Args("id", { type: () => String }) id: string
  ): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Query(() => HrmsPermissionssResponse<HrmsPermissions>)
  async hrmspermissionssByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => HrmsPermissionsValueInput }) value: HrmsPermissionsValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HrmsPermissionssResponse<HrmsPermissions>> {
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Query(() => HrmsPermissionssResponse<HrmsPermissions>)
  async hrmspermissionssWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HrmsPermissionssResponse<HrmsPermissions>> {
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Query(() => Number)
  async totalHrmsPermissionss(): Promise<number> {
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Query(() => HrmsPermissionssResponse<HrmsPermissions>)
  async searchHrmsPermissionss(
    @Args("where", { type: () => HrmsPermissionsDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsPermissionssResponse<HrmsPermissions>> {
    const hrmspermissionss = await this.service.findAndCount(where);
    return hrmspermissionss;
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Query(() => HrmsPermissionsResponse<HrmsPermissions>, { nullable: true })
  async findOneHrmsPermissions(
    @Args("where", { type: () => HrmsPermissionsDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsPermissionsResponse<HrmsPermissions>> {
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
      .registerClient(HrmsPermissionsResolver.name)

      .get(HrmsPermissionsResolver.name),
    })
  @Query(() => HrmsPermissionsResponse<HrmsPermissions>)
  async findOneHrmsPermissionsOrFail(
    @Args("where", { type: () => HrmsPermissionsDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsPermissionsResponse<HrmsPermissions> | Error> {
    return this.service.findOneOrFail(where);
  }
}

