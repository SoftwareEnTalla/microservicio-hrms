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
import { AttendanceStatus } from "../entities/attendance-status.entity";

//Definición de comandos
import {
  CreateAttendanceStatusCommand,
  UpdateAttendanceStatusCommand,
  DeleteAttendanceStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { AttendanceStatusQueryService } from "../services/attendancestatusquery.service";


import { AttendanceStatusResponse, AttendanceStatussResponse } from "../types/attendancestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateAttendanceStatusDto, 
CreateOrUpdateAttendanceStatusDto, 
AttendanceStatusValueInput, 
AttendanceStatusDto, 
CreateAttendanceStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => AttendanceStatus)
export class AttendanceStatusResolver {

   //Constructor del resolver de AttendanceStatus
  constructor(
    private readonly service: AttendanceStatusQueryService,
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => AttendanceStatusResponse<AttendanceStatus>)
  async createAttendanceStatus(
    @Args("input", { type: () => CreateAttendanceStatusDto }) input: CreateAttendanceStatusDto
  ): Promise<AttendanceStatusResponse<AttendanceStatus>> {
    return this.commandBus.execute(new CreateAttendanceStatusCommand(input));
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Mutation(() => AttendanceStatusResponse<AttendanceStatus>)
  async updateAttendanceStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateAttendanceStatusDto
  ): Promise<AttendanceStatusResponse<AttendanceStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateAttendanceStatusCommand(payLoad, {
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Mutation(() => AttendanceStatusResponse<AttendanceStatus>)
  async createOrUpdateAttendanceStatus(
    @Args("data", { type: () => CreateOrUpdateAttendanceStatusDto })
    data: CreateOrUpdateAttendanceStatusDto
  ): Promise<AttendanceStatusResponse<AttendanceStatus>> {
    if (data.id) {
      const existingAttendanceStatus = await this.service.findById(data.id);
      if (existingAttendanceStatus) {
        return this.commandBus.execute(
          new UpdateAttendanceStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateAttendanceStatusDto | UpdateAttendanceStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateAttendanceStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateAttendanceStatusDto | UpdateAttendanceStatusDto).createdBy ||
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteAttendanceStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteAttendanceStatusCommand(id));
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  // Queries
  @Query(() => AttendanceStatussResponse<AttendanceStatus>)
  async attendancestatuss(
    options?: FindManyOptions<AttendanceStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<AttendanceStatussResponse<AttendanceStatus>> {
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Query(() => AttendanceStatussResponse<AttendanceStatus>)
  async attendancestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<AttendanceStatusResponse<AttendanceStatus>> {
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Query(() => AttendanceStatussResponse<AttendanceStatus>)
  async attendancestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => AttendanceStatusValueInput }) value: AttendanceStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AttendanceStatussResponse<AttendanceStatus>> {
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Query(() => AttendanceStatussResponse<AttendanceStatus>)
  async attendancestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AttendanceStatussResponse<AttendanceStatus>> {
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Query(() => Number)
  async totalAttendanceStatuss(): Promise<number> {
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Query(() => AttendanceStatussResponse<AttendanceStatus>)
  async searchAttendanceStatuss(
    @Args("where", { type: () => AttendanceStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<AttendanceStatussResponse<AttendanceStatus>> {
    const attendancestatuss = await this.service.findAndCount(where);
    return attendancestatuss;
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Query(() => AttendanceStatusResponse<AttendanceStatus>, { nullable: true })
  async findOneAttendanceStatus(
    @Args("where", { type: () => AttendanceStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<AttendanceStatusResponse<AttendanceStatus>> {
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
      .registerClient(AttendanceStatusResolver.name)

      .get(AttendanceStatusResolver.name),
    })
  @Query(() => AttendanceStatusResponse<AttendanceStatus>)
  async findOneAttendanceStatusOrFail(
    @Args("where", { type: () => AttendanceStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<AttendanceStatusResponse<AttendanceStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

