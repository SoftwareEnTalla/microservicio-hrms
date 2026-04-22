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
import { PersonAttribute } from "../entities/person-attribute.entity";

//Definición de comandos
import {
  CreatePersonAttributeCommand,
  UpdatePersonAttributeCommand,
  DeletePersonAttributeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PersonAttributeQueryService } from "../services/personattributequery.service";


import { PersonAttributeResponse, PersonAttributesResponse } from "../types/personattribute.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePersonAttributeDto, 
CreateOrUpdatePersonAttributeDto, 
PersonAttributeValueInput, 
PersonAttributeDto, 
CreatePersonAttributeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PersonAttribute)
export class PersonAttributeResolver {

   //Constructor del resolver de PersonAttribute
  constructor(
    private readonly service: PersonAttributeQueryService,
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  // Mutaciones
  @Mutation(() => PersonAttributeResponse<PersonAttribute>)
  async createPersonAttribute(
    @Args("input", { type: () => CreatePersonAttributeDto }) input: CreatePersonAttributeDto
  ): Promise<PersonAttributeResponse<PersonAttribute>> {
    return this.commandBus.execute(new CreatePersonAttributeCommand(input));
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Mutation(() => PersonAttributeResponse<PersonAttribute>)
  async updatePersonAttribute(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePersonAttributeDto
  ): Promise<PersonAttributeResponse<PersonAttribute>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePersonAttributeCommand(payLoad, {
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Mutation(() => PersonAttributeResponse<PersonAttribute>)
  async createOrUpdatePersonAttribute(
    @Args("data", { type: () => CreateOrUpdatePersonAttributeDto })
    data: CreateOrUpdatePersonAttributeDto
  ): Promise<PersonAttributeResponse<PersonAttribute>> {
    if (data.id) {
      const existingPersonAttribute = await this.service.findById(data.id);
      if (existingPersonAttribute) {
        return this.commandBus.execute(
          new UpdatePersonAttributeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePersonAttributeDto | UpdatePersonAttributeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePersonAttributeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePersonAttributeDto | UpdatePersonAttributeDto).createdBy ||
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePersonAttribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePersonAttributeCommand(id));
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  // Queries
  @Query(() => PersonAttributesResponse<PersonAttribute>)
  async personattributes(
    options?: FindManyOptions<PersonAttribute>,
    paginationArgs?: PaginationArgs
  ): Promise<PersonAttributesResponse<PersonAttribute>> {
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Query(() => PersonAttributesResponse<PersonAttribute>)
  async personattribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<PersonAttributeResponse<PersonAttribute>> {
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Query(() => PersonAttributesResponse<PersonAttribute>)
  async personattributesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PersonAttributeValueInput }) value: PersonAttributeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonAttributesResponse<PersonAttribute>> {
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Query(() => PersonAttributesResponse<PersonAttribute>)
  async personattributesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonAttributesResponse<PersonAttribute>> {
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Query(() => Number)
  async totalPersonAttributes(): Promise<number> {
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Query(() => PersonAttributesResponse<PersonAttribute>)
  async searchPersonAttributes(
    @Args("where", { type: () => PersonAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonAttributesResponse<PersonAttribute>> {
    const personattributes = await this.service.findAndCount(where);
    return personattributes;
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Query(() => PersonAttributeResponse<PersonAttribute>, { nullable: true })
  async findOnePersonAttribute(
    @Args("where", { type: () => PersonAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonAttributeResponse<PersonAttribute>> {
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
      .registerClient(PersonAttributeResolver.name)

      .get(PersonAttributeResolver.name),
    })
  @Query(() => PersonAttributeResponse<PersonAttribute>)
  async findOnePersonAttributeOrFail(
    @Args("where", { type: () => PersonAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonAttributeResponse<PersonAttribute> | Error> {
    return this.service.findOneOrFail(where);
  }
}

