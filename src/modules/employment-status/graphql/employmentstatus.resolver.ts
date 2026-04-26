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
import { EmploymentStatus } from "../entities/employment-status.entity";

//Definición de comandos
import {
  CreateEmploymentStatusCommand,
  UpdateEmploymentStatusCommand,
  DeleteEmploymentStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { EmploymentStatusQueryService } from "../services/employmentstatusquery.service";


import { EmploymentStatusResponse, EmploymentStatussResponse } from "../types/employmentstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateEmploymentStatusDto, 
CreateOrUpdateEmploymentStatusDto, 
EmploymentStatusValueInput, 
EmploymentStatusDto, 
CreateEmploymentStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => EmploymentStatus)
export class EmploymentStatusResolver {

   //Constructor del resolver de EmploymentStatus
  constructor(
    private readonly service: EmploymentStatusQueryService,
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => EmploymentStatusResponse<EmploymentStatus>)
  async createEmploymentStatus(
    @Args("input", { type: () => CreateEmploymentStatusDto }) input: CreateEmploymentStatusDto
  ): Promise<EmploymentStatusResponse<EmploymentStatus>> {
    return this.commandBus.execute(new CreateEmploymentStatusCommand(input));
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Mutation(() => EmploymentStatusResponse<EmploymentStatus>)
  async updateEmploymentStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateEmploymentStatusDto
  ): Promise<EmploymentStatusResponse<EmploymentStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateEmploymentStatusCommand(payLoad, {
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Mutation(() => EmploymentStatusResponse<EmploymentStatus>)
  async createOrUpdateEmploymentStatus(
    @Args("data", { type: () => CreateOrUpdateEmploymentStatusDto })
    data: CreateOrUpdateEmploymentStatusDto
  ): Promise<EmploymentStatusResponse<EmploymentStatus>> {
    if (data.id) {
      const existingEmploymentStatus = await this.service.findById(data.id);
      if (existingEmploymentStatus) {
        return this.commandBus.execute(
          new UpdateEmploymentStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateEmploymentStatusDto | UpdateEmploymentStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateEmploymentStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateEmploymentStatusDto | UpdateEmploymentStatusDto).createdBy ||
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteEmploymentStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteEmploymentStatusCommand(id));
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  // Queries
  @Query(() => EmploymentStatussResponse<EmploymentStatus>)
  async employmentstatuss(
    options?: FindManyOptions<EmploymentStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<EmploymentStatussResponse<EmploymentStatus>> {
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Query(() => EmploymentStatussResponse<EmploymentStatus>)
  async employmentstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<EmploymentStatusResponse<EmploymentStatus>> {
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Query(() => EmploymentStatussResponse<EmploymentStatus>)
  async employmentstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => EmploymentStatusValueInput }) value: EmploymentStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<EmploymentStatussResponse<EmploymentStatus>> {
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Query(() => EmploymentStatussResponse<EmploymentStatus>)
  async employmentstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<EmploymentStatussResponse<EmploymentStatus>> {
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Query(() => Number)
  async totalEmploymentStatuss(): Promise<number> {
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Query(() => EmploymentStatussResponse<EmploymentStatus>)
  async searchEmploymentStatuss(
    @Args("where", { type: () => EmploymentStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmploymentStatussResponse<EmploymentStatus>> {
    const employmentstatuss = await this.service.findAndCount(where);
    return employmentstatuss;
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Query(() => EmploymentStatusResponse<EmploymentStatus>, { nullable: true })
  async findOneEmploymentStatus(
    @Args("where", { type: () => EmploymentStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmploymentStatusResponse<EmploymentStatus>> {
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
      .registerClient(EmploymentStatusResolver.name)

      .get(EmploymentStatusResolver.name),
    })
  @Query(() => EmploymentStatusResponse<EmploymentStatus>)
  async findOneEmploymentStatusOrFail(
    @Args("where", { type: () => EmploymentStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmploymentStatusResponse<EmploymentStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

