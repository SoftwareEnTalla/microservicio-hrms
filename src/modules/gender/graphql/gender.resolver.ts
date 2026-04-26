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
import { Gender } from "../entities/gender.entity";

//Definición de comandos
import {
  CreateGenderCommand,
  UpdateGenderCommand,
  DeleteGenderCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { GenderQueryService } from "../services/genderquery.service";


import { GenderResponse, GendersResponse } from "../types/gender.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateGenderDto, 
CreateOrUpdateGenderDto, 
GenderValueInput, 
GenderDto, 
CreateGenderDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Gender)
export class GenderResolver {

   //Constructor del resolver de Gender
  constructor(
    private readonly service: GenderQueryService,
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  // Mutaciones
  @Mutation(() => GenderResponse<Gender>)
  async createGender(
    @Args("input", { type: () => CreateGenderDto }) input: CreateGenderDto
  ): Promise<GenderResponse<Gender>> {
    return this.commandBus.execute(new CreateGenderCommand(input));
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Mutation(() => GenderResponse<Gender>)
  async updateGender(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateGenderDto
  ): Promise<GenderResponse<Gender>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateGenderCommand(payLoad, {
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Mutation(() => GenderResponse<Gender>)
  async createOrUpdateGender(
    @Args("data", { type: () => CreateOrUpdateGenderDto })
    data: CreateOrUpdateGenderDto
  ): Promise<GenderResponse<Gender>> {
    if (data.id) {
      const existingGender = await this.service.findById(data.id);
      if (existingGender) {
        return this.commandBus.execute(
          new UpdateGenderCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateGenderDto | UpdateGenderDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateGenderCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateGenderDto | UpdateGenderDto).createdBy ||
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteGender(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteGenderCommand(id));
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  // Queries
  @Query(() => GendersResponse<Gender>)
  async genders(
    options?: FindManyOptions<Gender>,
    paginationArgs?: PaginationArgs
  ): Promise<GendersResponse<Gender>> {
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Query(() => GendersResponse<Gender>)
  async gender(
    @Args("id", { type: () => String }) id: string
  ): Promise<GenderResponse<Gender>> {
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Query(() => GendersResponse<Gender>)
  async gendersByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => GenderValueInput }) value: GenderValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<GendersResponse<Gender>> {
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Query(() => GendersResponse<Gender>)
  async gendersWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<GendersResponse<Gender>> {
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Query(() => Number)
  async totalGenders(): Promise<number> {
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Query(() => GendersResponse<Gender>)
  async searchGenders(
    @Args("where", { type: () => GenderDto, nullable: false })
    where: Record<string, any>
  ): Promise<GendersResponse<Gender>> {
    const genders = await this.service.findAndCount(where);
    return genders;
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Query(() => GenderResponse<Gender>, { nullable: true })
  async findOneGender(
    @Args("where", { type: () => GenderDto, nullable: false })
    where: Record<string, any>
  ): Promise<GenderResponse<Gender>> {
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
      .registerClient(GenderResolver.name)

      .get(GenderResolver.name),
    })
  @Query(() => GenderResponse<Gender>)
  async findOneGenderOrFail(
    @Args("where", { type: () => GenderDto, nullable: false })
    where: Record<string, any>
  ): Promise<GenderResponse<Gender> | Error> {
    return this.service.findOneOrFail(where);
  }
}

