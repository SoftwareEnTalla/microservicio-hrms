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
import { AttendanceChannel } from "../entities/attendance-channel.entity";

//Definición de comandos
import {
  CreateAttendanceChannelCommand,
  UpdateAttendanceChannelCommand,
  DeleteAttendanceChannelCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { AttendanceChannelQueryService } from "../services/attendancechannelquery.service";


import { AttendanceChannelResponse, AttendanceChannelsResponse } from "../types/attendancechannel.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateAttendanceChannelDto, 
CreateOrUpdateAttendanceChannelDto, 
AttendanceChannelValueInput, 
AttendanceChannelDto, 
CreateAttendanceChannelDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => AttendanceChannel)
export class AttendanceChannelResolver {

   //Constructor del resolver de AttendanceChannel
  constructor(
    private readonly service: AttendanceChannelQueryService,
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  // Mutaciones
  @Mutation(() => AttendanceChannelResponse<AttendanceChannel>)
  async createAttendanceChannel(
    @Args("input", { type: () => CreateAttendanceChannelDto }) input: CreateAttendanceChannelDto
  ): Promise<AttendanceChannelResponse<AttendanceChannel>> {
    return this.commandBus.execute(new CreateAttendanceChannelCommand(input));
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Mutation(() => AttendanceChannelResponse<AttendanceChannel>)
  async updateAttendanceChannel(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateAttendanceChannelDto
  ): Promise<AttendanceChannelResponse<AttendanceChannel>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateAttendanceChannelCommand(payLoad, {
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Mutation(() => AttendanceChannelResponse<AttendanceChannel>)
  async createOrUpdateAttendanceChannel(
    @Args("data", { type: () => CreateOrUpdateAttendanceChannelDto })
    data: CreateOrUpdateAttendanceChannelDto
  ): Promise<AttendanceChannelResponse<AttendanceChannel>> {
    if (data.id) {
      const existingAttendanceChannel = await this.service.findById(data.id);
      if (existingAttendanceChannel) {
        return this.commandBus.execute(
          new UpdateAttendanceChannelCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateAttendanceChannelDto | UpdateAttendanceChannelDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateAttendanceChannelCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateAttendanceChannelDto | UpdateAttendanceChannelDto).createdBy ||
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteAttendanceChannel(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteAttendanceChannelCommand(id));
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  // Queries
  @Query(() => AttendanceChannelsResponse<AttendanceChannel>)
  async attendancechannels(
    options?: FindManyOptions<AttendanceChannel>,
    paginationArgs?: PaginationArgs
  ): Promise<AttendanceChannelsResponse<AttendanceChannel>> {
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Query(() => AttendanceChannelsResponse<AttendanceChannel>)
  async attendancechannel(
    @Args("id", { type: () => String }) id: string
  ): Promise<AttendanceChannelResponse<AttendanceChannel>> {
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Query(() => AttendanceChannelsResponse<AttendanceChannel>)
  async attendancechannelsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => AttendanceChannelValueInput }) value: AttendanceChannelValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AttendanceChannelsResponse<AttendanceChannel>> {
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Query(() => AttendanceChannelsResponse<AttendanceChannel>)
  async attendancechannelsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<AttendanceChannelsResponse<AttendanceChannel>> {
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Query(() => Number)
  async totalAttendanceChannels(): Promise<number> {
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Query(() => AttendanceChannelsResponse<AttendanceChannel>)
  async searchAttendanceChannels(
    @Args("where", { type: () => AttendanceChannelDto, nullable: false })
    where: Record<string, any>
  ): Promise<AttendanceChannelsResponse<AttendanceChannel>> {
    const attendancechannels = await this.service.findAndCount(where);
    return attendancechannels;
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Query(() => AttendanceChannelResponse<AttendanceChannel>, { nullable: true })
  async findOneAttendanceChannel(
    @Args("where", { type: () => AttendanceChannelDto, nullable: false })
    where: Record<string, any>
  ): Promise<AttendanceChannelResponse<AttendanceChannel>> {
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
      .registerClient(AttendanceChannelResolver.name)

      .get(AttendanceChannelResolver.name),
    })
  @Query(() => AttendanceChannelResponse<AttendanceChannel>)
  async findOneAttendanceChannelOrFail(
    @Args("where", { type: () => AttendanceChannelDto, nullable: false })
    where: Record<string, any>
  ): Promise<AttendanceChannelResponse<AttendanceChannel> | Error> {
    return this.service.findOneOrFail(where);
  }
}

