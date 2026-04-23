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
import { Hrms } from "../entities/hrms.entity";

//Definición de comandos
import {
  CreateHrmsCommand,
  UpdateHrmsCommand,
  DeleteHrmsCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { HrmsQueryService } from "../services/hrmsquery.service";


import { HrmsResponse, HrmssResponse } from "../types/hrms.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateHrmsDto, 
CreateOrUpdateHrmsDto, 
HrmsValueInput, 
HrmsDto, 
CreateHrmsDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Hrms)
export class HrmsResolver {

   //Constructor del resolver de Hrms
  constructor(
    private readonly service: HrmsQueryService,
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  // Mutaciones
  @Mutation(() => HrmsResponse<Hrms>)
  async createHrms(
    @Args("input", { type: () => CreateHrmsDto }) input: CreateHrmsDto
  ): Promise<HrmsResponse<Hrms>> {
    return this.commandBus.execute(new CreateHrmsCommand(input));
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Mutation(() => HrmsResponse<Hrms>)
  async updateHrms(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateHrmsDto
  ): Promise<HrmsResponse<Hrms>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateHrmsCommand(payLoad, {
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Mutation(() => HrmsResponse<Hrms>)
  async createOrUpdateHrms(
    @Args("data", { type: () => CreateOrUpdateHrmsDto })
    data: CreateOrUpdateHrmsDto
  ): Promise<HrmsResponse<Hrms>> {
    if (data.id) {
      const existingHrms = await this.service.findById(data.id);
      if (existingHrms) {
        return this.commandBus.execute(
          new UpdateHrmsCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateHrmsDto | UpdateHrmsDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateHrmsCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateHrmsDto | UpdateHrmsDto).createdBy ||
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteHrms(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteHrmsCommand(id));
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  // Queries
  @Query(() => HrmssResponse<Hrms>)
  async hrmss(
    options?: FindManyOptions<Hrms>,
    paginationArgs?: PaginationArgs
  ): Promise<HrmssResponse<Hrms>> {
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Query(() => HrmssResponse<Hrms>)
  async hrms(
    @Args("id", { type: () => String }) id: string
  ): Promise<HrmsResponse<Hrms>> {
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Query(() => HrmssResponse<Hrms>)
  async hrmssByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => HrmsValueInput }) value: HrmsValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HrmssResponse<Hrms>> {
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Query(() => HrmssResponse<Hrms>)
  async hrmssWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<HrmssResponse<Hrms>> {
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Query(() => Number)
  async totalHrmss(): Promise<number> {
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Query(() => HrmssResponse<Hrms>)
  async searchHrmss(
    @Args("where", { type: () => HrmsDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmssResponse<Hrms>> {
    const hrmss = await this.service.findAndCount(where);
    return hrmss;
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Query(() => HrmsResponse<Hrms>, { nullable: true })
  async findOneHrms(
    @Args("where", { type: () => HrmsDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsResponse<Hrms>> {
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
      .registerClient(HrmsResolver.name)

      .get(HrmsResolver.name),
    })
  @Query(() => HrmsResponse<Hrms>)
  async findOneHrmsOrFail(
    @Args("where", { type: () => HrmsDto, nullable: false })
    where: Record<string, any>
  ): Promise<HrmsResponse<Hrms> | Error> {
    return this.service.findOneOrFail(where);
  }
}

