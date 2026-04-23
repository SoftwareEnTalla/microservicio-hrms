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
import { EmployeeAttribute } from "../entities/employee-attribute.entity";

//Definición de comandos
import {
  CreateEmployeeAttributeCommand,
  UpdateEmployeeAttributeCommand,
  DeleteEmployeeAttributeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { EmployeeAttributeQueryService } from "../services/employeeattributequery.service";


import { EmployeeAttributeResponse, EmployeeAttributesResponse } from "../types/employeeattribute.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateEmployeeAttributeDto, 
CreateOrUpdateEmployeeAttributeDto, 
EmployeeAttributeValueInput, 
EmployeeAttributeDto, 
CreateEmployeeAttributeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => EmployeeAttribute)
export class EmployeeAttributeResolver {

   //Constructor del resolver de EmployeeAttribute
  constructor(
    private readonly service: EmployeeAttributeQueryService,
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  // Mutaciones
  @Mutation(() => EmployeeAttributeResponse<EmployeeAttribute>)
  async createEmployeeAttribute(
    @Args("input", { type: () => CreateEmployeeAttributeDto }) input: CreateEmployeeAttributeDto
  ): Promise<EmployeeAttributeResponse<EmployeeAttribute>> {
    return this.commandBus.execute(new CreateEmployeeAttributeCommand(input));
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Mutation(() => EmployeeAttributeResponse<EmployeeAttribute>)
  async updateEmployeeAttribute(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateEmployeeAttributeDto
  ): Promise<EmployeeAttributeResponse<EmployeeAttribute>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateEmployeeAttributeCommand(payLoad, {
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Mutation(() => EmployeeAttributeResponse<EmployeeAttribute>)
  async createOrUpdateEmployeeAttribute(
    @Args("data", { type: () => CreateOrUpdateEmployeeAttributeDto })
    data: CreateOrUpdateEmployeeAttributeDto
  ): Promise<EmployeeAttributeResponse<EmployeeAttribute>> {
    if (data.id) {
      const existingEmployeeAttribute = await this.service.findById(data.id);
      if (existingEmployeeAttribute) {
        return this.commandBus.execute(
          new UpdateEmployeeAttributeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateEmployeeAttributeDto | UpdateEmployeeAttributeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateEmployeeAttributeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateEmployeeAttributeDto | UpdateEmployeeAttributeDto).createdBy ||
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteEmployeeAttribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteEmployeeAttributeCommand(id));
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  // Queries
  @Query(() => EmployeeAttributesResponse<EmployeeAttribute>)
  async employeeattributes(
    options?: FindManyOptions<EmployeeAttribute>,
    paginationArgs?: PaginationArgs
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Query(() => EmployeeAttributesResponse<EmployeeAttribute>)
  async employeeattribute(
    @Args("id", { type: () => String }) id: string
  ): Promise<EmployeeAttributeResponse<EmployeeAttribute>> {
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Query(() => EmployeeAttributesResponse<EmployeeAttribute>)
  async employeeattributesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => EmployeeAttributeValueInput }) value: EmployeeAttributeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Query(() => EmployeeAttributesResponse<EmployeeAttribute>)
  async employeeattributesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Query(() => Number)
  async totalEmployeeAttributes(): Promise<number> {
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Query(() => EmployeeAttributesResponse<EmployeeAttribute>)
  async searchEmployeeAttributes(
    @Args("where", { type: () => EmployeeAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmployeeAttributesResponse<EmployeeAttribute>> {
    const employeeattributes = await this.service.findAndCount(where);
    return employeeattributes;
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Query(() => EmployeeAttributeResponse<EmployeeAttribute>, { nullable: true })
  async findOneEmployeeAttribute(
    @Args("where", { type: () => EmployeeAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmployeeAttributeResponse<EmployeeAttribute>> {
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
      .registerClient(EmployeeAttributeResolver.name)

      .get(EmployeeAttributeResolver.name),
    })
  @Query(() => EmployeeAttributeResponse<EmployeeAttribute>)
  async findOneEmployeeAttributeOrFail(
    @Args("where", { type: () => EmployeeAttributeDto, nullable: false })
    where: Record<string, any>
  ): Promise<EmployeeAttributeResponse<EmployeeAttribute> | Error> {
    return this.service.findOneOrFail(where);
  }
}

