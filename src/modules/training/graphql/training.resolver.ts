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
import { Training } from "../entities/training.entity";

//Definición de comandos
import {
  CreateTrainingCommand,
  UpdateTrainingCommand,
  DeleteTrainingCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { TrainingQueryService } from "../services/trainingquery.service";


import { TrainingResponse, TrainingsResponse } from "../types/training.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateTrainingDto, 
CreateOrUpdateTrainingDto, 
TrainingValueInput, 
TrainingDto, 
CreateTrainingDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Training)
export class TrainingResolver {

   //Constructor del resolver de Training
  constructor(
    private readonly service: TrainingQueryService,
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  // Mutaciones
  @Mutation(() => TrainingResponse<Training>)
  async createTraining(
    @Args("input", { type: () => CreateTrainingDto }) input: CreateTrainingDto
  ): Promise<TrainingResponse<Training>> {
    return this.commandBus.execute(new CreateTrainingCommand(input));
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Mutation(() => TrainingResponse<Training>)
  async updateTraining(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateTrainingDto
  ): Promise<TrainingResponse<Training>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateTrainingCommand(payLoad, {
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Mutation(() => TrainingResponse<Training>)
  async createOrUpdateTraining(
    @Args("data", { type: () => CreateOrUpdateTrainingDto })
    data: CreateOrUpdateTrainingDto
  ): Promise<TrainingResponse<Training>> {
    if (data.id) {
      const existingTraining = await this.service.findById(data.id);
      if (existingTraining) {
        return this.commandBus.execute(
          new UpdateTrainingCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateTrainingDto | UpdateTrainingDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateTrainingCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateTrainingDto | UpdateTrainingDto).createdBy ||
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteTraining(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteTrainingCommand(id));
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  // Queries
  @Query(() => TrainingsResponse<Training>)
  async trainings(
    options?: FindManyOptions<Training>,
    paginationArgs?: PaginationArgs
  ): Promise<TrainingsResponse<Training>> {
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Query(() => TrainingsResponse<Training>)
  async training(
    @Args("id", { type: () => String }) id: string
  ): Promise<TrainingResponse<Training>> {
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Query(() => TrainingsResponse<Training>)
  async trainingsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => TrainingValueInput }) value: TrainingValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TrainingsResponse<Training>> {
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Query(() => TrainingsResponse<Training>)
  async trainingsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TrainingsResponse<Training>> {
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Query(() => Number)
  async totalTrainings(): Promise<number> {
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Query(() => TrainingsResponse<Training>)
  async searchTrainings(
    @Args("where", { type: () => TrainingDto, nullable: false })
    where: Record<string, any>
  ): Promise<TrainingsResponse<Training>> {
    const trainings = await this.service.findAndCount(where);
    return trainings;
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Query(() => TrainingResponse<Training>, { nullable: true })
  async findOneTraining(
    @Args("where", { type: () => TrainingDto, nullable: false })
    where: Record<string, any>
  ): Promise<TrainingResponse<Training>> {
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
      .registerClient(TrainingResolver.name)

      .get(TrainingResolver.name),
    })
  @Query(() => TrainingResponse<Training>)
  async findOneTrainingOrFail(
    @Args("where", { type: () => TrainingDto, nullable: false })
    where: Record<string, any>
  ): Promise<TrainingResponse<Training> | Error> {
    return this.service.findOneOrFail(where);
  }
}

