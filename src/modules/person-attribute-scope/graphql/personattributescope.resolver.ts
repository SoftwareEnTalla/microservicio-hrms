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
import { PersonAttributeScope } from "../entities/person-attribute-scope.entity";

//Definición de comandos
import {
  CreatePersonAttributeScopeCommand,
  UpdatePersonAttributeScopeCommand,
  DeletePersonAttributeScopeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PersonAttributeScopeQueryService } from "../services/personattributescopequery.service";


import { PersonAttributeScopeResponse, PersonAttributeScopesResponse } from "../types/personattributescope.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePersonAttributeScopeDto, 
CreateOrUpdatePersonAttributeScopeDto, 
PersonAttributeScopeValueInput, 
PersonAttributeScopeDto, 
CreatePersonAttributeScopeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PersonAttributeScope)
export class PersonAttributeScopeResolver {

   //Constructor del resolver de PersonAttributeScope
  constructor(
    private readonly service: PersonAttributeScopeQueryService,
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  // Mutaciones
  @Mutation(() => PersonAttributeScopeResponse<PersonAttributeScope>)
  async createPersonAttributeScope(
    @Args("input", { type: () => CreatePersonAttributeScopeDto }) input: CreatePersonAttributeScopeDto
  ): Promise<PersonAttributeScopeResponse<PersonAttributeScope>> {
    return this.commandBus.execute(new CreatePersonAttributeScopeCommand(input));
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Mutation(() => PersonAttributeScopeResponse<PersonAttributeScope>)
  async updatePersonAttributeScope(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePersonAttributeScopeDto
  ): Promise<PersonAttributeScopeResponse<PersonAttributeScope>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePersonAttributeScopeCommand(payLoad, {
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Mutation(() => PersonAttributeScopeResponse<PersonAttributeScope>)
  async createOrUpdatePersonAttributeScope(
    @Args("data", { type: () => CreateOrUpdatePersonAttributeScopeDto })
    data: CreateOrUpdatePersonAttributeScopeDto
  ): Promise<PersonAttributeScopeResponse<PersonAttributeScope>> {
    if (data.id) {
      const existingPersonAttributeScope = await this.service.findById(data.id);
      if (existingPersonAttributeScope) {
        return this.commandBus.execute(
          new UpdatePersonAttributeScopeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePersonAttributeScopeDto | UpdatePersonAttributeScopeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePersonAttributeScopeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePersonAttributeScopeDto | UpdatePersonAttributeScopeDto).createdBy ||
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePersonAttributeScope(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePersonAttributeScopeCommand(id));
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  // Queries
  @Query(() => PersonAttributeScopesResponse<PersonAttributeScope>)
  async personattributescopes(
    options?: FindManyOptions<PersonAttributeScope>,
    paginationArgs?: PaginationArgs
  ): Promise<PersonAttributeScopesResponse<PersonAttributeScope>> {
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Query(() => PersonAttributeScopesResponse<PersonAttributeScope>)
  async personattributescope(
    @Args("id", { type: () => String }) id: string
  ): Promise<PersonAttributeScopeResponse<PersonAttributeScope>> {
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Query(() => PersonAttributeScopesResponse<PersonAttributeScope>)
  async personattributescopesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PersonAttributeScopeValueInput }) value: PersonAttributeScopeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonAttributeScopesResponse<PersonAttributeScope>> {
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Query(() => PersonAttributeScopesResponse<PersonAttributeScope>)
  async personattributescopesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonAttributeScopesResponse<PersonAttributeScope>> {
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Query(() => Number)
  async totalPersonAttributeScopes(): Promise<number> {
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Query(() => PersonAttributeScopesResponse<PersonAttributeScope>)
  async searchPersonAttributeScopes(
    @Args("where", { type: () => PersonAttributeScopeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonAttributeScopesResponse<PersonAttributeScope>> {
    const personattributescopes = await this.service.findAndCount(where);
    return personattributescopes;
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Query(() => PersonAttributeScopeResponse<PersonAttributeScope>, { nullable: true })
  async findOnePersonAttributeScope(
    @Args("where", { type: () => PersonAttributeScopeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonAttributeScopeResponse<PersonAttributeScope>> {
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
      .registerClient(PersonAttributeScopeResolver.name)

      .get(PersonAttributeScopeResolver.name),
    })
  @Query(() => PersonAttributeScopeResponse<PersonAttributeScope>)
  async findOnePersonAttributeScopeOrFail(
    @Args("where", { type: () => PersonAttributeScopeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonAttributeScopeResponse<PersonAttributeScope> | Error> {
    return this.service.findOneOrFail(where);
  }
}

