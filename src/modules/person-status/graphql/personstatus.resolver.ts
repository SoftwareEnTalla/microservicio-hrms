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
import { PersonStatus } from "../entities/person-status.entity";

//Definición de comandos
import {
  CreatePersonStatusCommand,
  UpdatePersonStatusCommand,
  DeletePersonStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PersonStatusQueryService } from "../services/personstatusquery.service";


import { PersonStatusResponse, PersonStatussResponse } from "../types/personstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePersonStatusDto, 
CreateOrUpdatePersonStatusDto, 
PersonStatusValueInput, 
PersonStatusDto, 
CreatePersonStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PersonStatus)
export class PersonStatusResolver {

   //Constructor del resolver de PersonStatus
  constructor(
    private readonly service: PersonStatusQueryService,
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => PersonStatusResponse<PersonStatus>)
  async createPersonStatus(
    @Args("input", { type: () => CreatePersonStatusDto }) input: CreatePersonStatusDto
  ): Promise<PersonStatusResponse<PersonStatus>> {
    return this.commandBus.execute(new CreatePersonStatusCommand(input));
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Mutation(() => PersonStatusResponse<PersonStatus>)
  async updatePersonStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePersonStatusDto
  ): Promise<PersonStatusResponse<PersonStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePersonStatusCommand(payLoad, {
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Mutation(() => PersonStatusResponse<PersonStatus>)
  async createOrUpdatePersonStatus(
    @Args("data", { type: () => CreateOrUpdatePersonStatusDto })
    data: CreateOrUpdatePersonStatusDto
  ): Promise<PersonStatusResponse<PersonStatus>> {
    if (data.id) {
      const existingPersonStatus = await this.service.findById(data.id);
      if (existingPersonStatus) {
        return this.commandBus.execute(
          new UpdatePersonStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePersonStatusDto | UpdatePersonStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePersonStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePersonStatusDto | UpdatePersonStatusDto).createdBy ||
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePersonStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePersonStatusCommand(id));
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  // Queries
  @Query(() => PersonStatussResponse<PersonStatus>)
  async personstatuss(
    options?: FindManyOptions<PersonStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<PersonStatussResponse<PersonStatus>> {
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Query(() => PersonStatussResponse<PersonStatus>)
  async personstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<PersonStatusResponse<PersonStatus>> {
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Query(() => PersonStatussResponse<PersonStatus>)
  async personstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PersonStatusValueInput }) value: PersonStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonStatussResponse<PersonStatus>> {
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Query(() => PersonStatussResponse<PersonStatus>)
  async personstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonStatussResponse<PersonStatus>> {
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Query(() => Number)
  async totalPersonStatuss(): Promise<number> {
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Query(() => PersonStatussResponse<PersonStatus>)
  async searchPersonStatuss(
    @Args("where", { type: () => PersonStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonStatussResponse<PersonStatus>> {
    const personstatuss = await this.service.findAndCount(where);
    return personstatuss;
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Query(() => PersonStatusResponse<PersonStatus>, { nullable: true })
  async findOnePersonStatus(
    @Args("where", { type: () => PersonStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonStatusResponse<PersonStatus>> {
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
      .registerClient(PersonStatusResolver.name)

      .get(PersonStatusResolver.name),
    })
  @Query(() => PersonStatusResponse<PersonStatus>)
  async findOnePersonStatusOrFail(
    @Args("where", { type: () => PersonStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonStatusResponse<PersonStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

