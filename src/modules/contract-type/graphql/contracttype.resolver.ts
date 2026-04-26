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
import { ContractType } from "../entities/contract-type.entity";

//Definición de comandos
import {
  CreateContractTypeCommand,
  UpdateContractTypeCommand,
  DeleteContractTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ContractTypeQueryService } from "../services/contracttypequery.service";


import { ContractTypeResponse, ContractTypesResponse } from "../types/contracttype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateContractTypeDto, 
CreateOrUpdateContractTypeDto, 
ContractTypeValueInput, 
ContractTypeDto, 
CreateContractTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ContractType)
export class ContractTypeResolver {

   //Constructor del resolver de ContractType
  constructor(
    private readonly service: ContractTypeQueryService,
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => ContractTypeResponse<ContractType>)
  async createContractType(
    @Args("input", { type: () => CreateContractTypeDto }) input: CreateContractTypeDto
  ): Promise<ContractTypeResponse<ContractType>> {
    return this.commandBus.execute(new CreateContractTypeCommand(input));
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Mutation(() => ContractTypeResponse<ContractType>)
  async updateContractType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateContractTypeDto
  ): Promise<ContractTypeResponse<ContractType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateContractTypeCommand(payLoad, {
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Mutation(() => ContractTypeResponse<ContractType>)
  async createOrUpdateContractType(
    @Args("data", { type: () => CreateOrUpdateContractTypeDto })
    data: CreateOrUpdateContractTypeDto
  ): Promise<ContractTypeResponse<ContractType>> {
    if (data.id) {
      const existingContractType = await this.service.findById(data.id);
      if (existingContractType) {
        return this.commandBus.execute(
          new UpdateContractTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateContractTypeDto | UpdateContractTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateContractTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateContractTypeDto | UpdateContractTypeDto).createdBy ||
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteContractType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteContractTypeCommand(id));
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  // Queries
  @Query(() => ContractTypesResponse<ContractType>)
  async contracttypes(
    options?: FindManyOptions<ContractType>,
    paginationArgs?: PaginationArgs
  ): Promise<ContractTypesResponse<ContractType>> {
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Query(() => ContractTypesResponse<ContractType>)
  async contracttype(
    @Args("id", { type: () => String }) id: string
  ): Promise<ContractTypeResponse<ContractType>> {
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Query(() => ContractTypesResponse<ContractType>)
  async contracttypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ContractTypeValueInput }) value: ContractTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ContractTypesResponse<ContractType>> {
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Query(() => ContractTypesResponse<ContractType>)
  async contracttypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ContractTypesResponse<ContractType>> {
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Query(() => Number)
  async totalContractTypes(): Promise<number> {
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Query(() => ContractTypesResponse<ContractType>)
  async searchContractTypes(
    @Args("where", { type: () => ContractTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ContractTypesResponse<ContractType>> {
    const contracttypes = await this.service.findAndCount(where);
    return contracttypes;
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Query(() => ContractTypeResponse<ContractType>, { nullable: true })
  async findOneContractType(
    @Args("where", { type: () => ContractTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ContractTypeResponse<ContractType>> {
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
      .registerClient(ContractTypeResolver.name)

      .get(ContractTypeResolver.name),
    })
  @Query(() => ContractTypeResponse<ContractType>)
  async findOneContractTypeOrFail(
    @Args("where", { type: () => ContractTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<ContractTypeResponse<ContractType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

