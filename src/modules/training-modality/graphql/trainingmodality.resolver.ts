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
import { TrainingModality } from "../entities/training-modality.entity";

//Definición de comandos
import {
  CreateTrainingModalityCommand,
  UpdateTrainingModalityCommand,
  DeleteTrainingModalityCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { TrainingModalityQueryService } from "../services/trainingmodalityquery.service";


import { TrainingModalityResponse, TrainingModalitysResponse } from "../types/trainingmodality.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateTrainingModalityDto, 
CreateOrUpdateTrainingModalityDto, 
TrainingModalityValueInput, 
TrainingModalityDto, 
CreateTrainingModalityDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => TrainingModality)
export class TrainingModalityResolver {

   //Constructor del resolver de TrainingModality
  constructor(
    private readonly service: TrainingModalityQueryService,
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  // Mutaciones
  @Mutation(() => TrainingModalityResponse<TrainingModality>)
  async createTrainingModality(
    @Args("input", { type: () => CreateTrainingModalityDto }) input: CreateTrainingModalityDto
  ): Promise<TrainingModalityResponse<TrainingModality>> {
    return this.commandBus.execute(new CreateTrainingModalityCommand(input));
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Mutation(() => TrainingModalityResponse<TrainingModality>)
  async updateTrainingModality(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateTrainingModalityDto
  ): Promise<TrainingModalityResponse<TrainingModality>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateTrainingModalityCommand(payLoad, {
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Mutation(() => TrainingModalityResponse<TrainingModality>)
  async createOrUpdateTrainingModality(
    @Args("data", { type: () => CreateOrUpdateTrainingModalityDto })
    data: CreateOrUpdateTrainingModalityDto
  ): Promise<TrainingModalityResponse<TrainingModality>> {
    if (data.id) {
      const existingTrainingModality = await this.service.findById(data.id);
      if (existingTrainingModality) {
        return this.commandBus.execute(
          new UpdateTrainingModalityCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateTrainingModalityDto | UpdateTrainingModalityDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateTrainingModalityCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateTrainingModalityDto | UpdateTrainingModalityDto).createdBy ||
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteTrainingModality(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteTrainingModalityCommand(id));
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  // Queries
  @Query(() => TrainingModalitysResponse<TrainingModality>)
  async trainingmodalitys(
    options?: FindManyOptions<TrainingModality>,
    paginationArgs?: PaginationArgs
  ): Promise<TrainingModalitysResponse<TrainingModality>> {
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Query(() => TrainingModalitysResponse<TrainingModality>)
  async trainingmodality(
    @Args("id", { type: () => String }) id: string
  ): Promise<TrainingModalityResponse<TrainingModality>> {
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Query(() => TrainingModalitysResponse<TrainingModality>)
  async trainingmodalitysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => TrainingModalityValueInput }) value: TrainingModalityValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TrainingModalitysResponse<TrainingModality>> {
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Query(() => TrainingModalitysResponse<TrainingModality>)
  async trainingmodalitysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TrainingModalitysResponse<TrainingModality>> {
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Query(() => Number)
  async totalTrainingModalitys(): Promise<number> {
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Query(() => TrainingModalitysResponse<TrainingModality>)
  async searchTrainingModalitys(
    @Args("where", { type: () => TrainingModalityDto, nullable: false })
    where: Record<string, any>
  ): Promise<TrainingModalitysResponse<TrainingModality>> {
    const trainingmodalitys = await this.service.findAndCount(where);
    return trainingmodalitys;
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Query(() => TrainingModalityResponse<TrainingModality>, { nullable: true })
  async findOneTrainingModality(
    @Args("where", { type: () => TrainingModalityDto, nullable: false })
    where: Record<string, any>
  ): Promise<TrainingModalityResponse<TrainingModality>> {
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
      .registerClient(TrainingModalityResolver.name)

      .get(TrainingModalityResolver.name),
    })
  @Query(() => TrainingModalityResponse<TrainingModality>)
  async findOneTrainingModalityOrFail(
    @Args("where", { type: () => TrainingModalityDto, nullable: false })
    where: Record<string, any>
  ): Promise<TrainingModalityResponse<TrainingModality> | Error> {
    return this.service.findOneOrFail(where);
  }
}

