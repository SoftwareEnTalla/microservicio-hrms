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
import { LastAccessOutcome } from "../entities/last-access-outcome.entity";

//Definición de comandos
import {
  CreateLastAccessOutcomeCommand,
  UpdateLastAccessOutcomeCommand,
  DeleteLastAccessOutcomeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { LastAccessOutcomeQueryService } from "../services/lastaccessoutcomequery.service";


import { LastAccessOutcomeResponse, LastAccessOutcomesResponse } from "../types/lastaccessoutcome.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateLastAccessOutcomeDto, 
CreateOrUpdateLastAccessOutcomeDto, 
LastAccessOutcomeValueInput, 
LastAccessOutcomeDto, 
CreateLastAccessOutcomeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => LastAccessOutcome)
export class LastAccessOutcomeResolver {

   //Constructor del resolver de LastAccessOutcome
  constructor(
    private readonly service: LastAccessOutcomeQueryService,
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  // Mutaciones
  @Mutation(() => LastAccessOutcomeResponse<LastAccessOutcome>)
  async createLastAccessOutcome(
    @Args("input", { type: () => CreateLastAccessOutcomeDto }) input: CreateLastAccessOutcomeDto
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
    return this.commandBus.execute(new CreateLastAccessOutcomeCommand(input));
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Mutation(() => LastAccessOutcomeResponse<LastAccessOutcome>)
  async updateLastAccessOutcome(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateLastAccessOutcomeDto
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateLastAccessOutcomeCommand(payLoad, {
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Mutation(() => LastAccessOutcomeResponse<LastAccessOutcome>)
  async createOrUpdateLastAccessOutcome(
    @Args("data", { type: () => CreateOrUpdateLastAccessOutcomeDto })
    data: CreateOrUpdateLastAccessOutcomeDto
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
    if (data.id) {
      const existingLastAccessOutcome = await this.service.findById(data.id);
      if (existingLastAccessOutcome) {
        return this.commandBus.execute(
          new UpdateLastAccessOutcomeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateLastAccessOutcomeDto | UpdateLastAccessOutcomeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateLastAccessOutcomeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateLastAccessOutcomeDto | UpdateLastAccessOutcomeDto).createdBy ||
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteLastAccessOutcome(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteLastAccessOutcomeCommand(id));
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  // Queries
  @Query(() => LastAccessOutcomesResponse<LastAccessOutcome>)
  async lastaccessoutcomes(
    options?: FindManyOptions<LastAccessOutcome>,
    paginationArgs?: PaginationArgs
  ): Promise<LastAccessOutcomesResponse<LastAccessOutcome>> {
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Query(() => LastAccessOutcomesResponse<LastAccessOutcome>)
  async lastaccessoutcome(
    @Args("id", { type: () => String }) id: string
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Query(() => LastAccessOutcomesResponse<LastAccessOutcome>)
  async lastaccessoutcomesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => LastAccessOutcomeValueInput }) value: LastAccessOutcomeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LastAccessOutcomesResponse<LastAccessOutcome>> {
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Query(() => LastAccessOutcomesResponse<LastAccessOutcome>)
  async lastaccessoutcomesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LastAccessOutcomesResponse<LastAccessOutcome>> {
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Query(() => Number)
  async totalLastAccessOutcomes(): Promise<number> {
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Query(() => LastAccessOutcomesResponse<LastAccessOutcome>)
  async searchLastAccessOutcomes(
    @Args("where", { type: () => LastAccessOutcomeDto, nullable: false })
    where: Record<string, any>
  ): Promise<LastAccessOutcomesResponse<LastAccessOutcome>> {
    const lastaccessoutcomes = await this.service.findAndCount(where);
    return lastaccessoutcomes;
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Query(() => LastAccessOutcomeResponse<LastAccessOutcome>, { nullable: true })
  async findOneLastAccessOutcome(
    @Args("where", { type: () => LastAccessOutcomeDto, nullable: false })
    where: Record<string, any>
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome>> {
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
      .registerClient(LastAccessOutcomeResolver.name)

      .get(LastAccessOutcomeResolver.name),
    })
  @Query(() => LastAccessOutcomeResponse<LastAccessOutcome>)
  async findOneLastAccessOutcomeOrFail(
    @Args("where", { type: () => LastAccessOutcomeDto, nullable: false })
    where: Record<string, any>
  ): Promise<LastAccessOutcomeResponse<LastAccessOutcome> | Error> {
    return this.service.findOneOrFail(where);
  }
}

