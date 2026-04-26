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
import { PayrollFrequency } from "../entities/payroll-frequency.entity";

//Definición de comandos
import {
  CreatePayrollFrequencyCommand,
  UpdatePayrollFrequencyCommand,
  DeletePayrollFrequencyCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PayrollFrequencyQueryService } from "../services/payrollfrequencyquery.service";


import { PayrollFrequencyResponse, PayrollFrequencysResponse } from "../types/payrollfrequency.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePayrollFrequencyDto, 
CreateOrUpdatePayrollFrequencyDto, 
PayrollFrequencyValueInput, 
PayrollFrequencyDto, 
CreatePayrollFrequencyDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PayrollFrequency)
export class PayrollFrequencyResolver {

   //Constructor del resolver de PayrollFrequency
  constructor(
    private readonly service: PayrollFrequencyQueryService,
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  // Mutaciones
  @Mutation(() => PayrollFrequencyResponse<PayrollFrequency>)
  async createPayrollFrequency(
    @Args("input", { type: () => CreatePayrollFrequencyDto }) input: CreatePayrollFrequencyDto
  ): Promise<PayrollFrequencyResponse<PayrollFrequency>> {
    return this.commandBus.execute(new CreatePayrollFrequencyCommand(input));
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Mutation(() => PayrollFrequencyResponse<PayrollFrequency>)
  async updatePayrollFrequency(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePayrollFrequencyDto
  ): Promise<PayrollFrequencyResponse<PayrollFrequency>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePayrollFrequencyCommand(payLoad, {
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Mutation(() => PayrollFrequencyResponse<PayrollFrequency>)
  async createOrUpdatePayrollFrequency(
    @Args("data", { type: () => CreateOrUpdatePayrollFrequencyDto })
    data: CreateOrUpdatePayrollFrequencyDto
  ): Promise<PayrollFrequencyResponse<PayrollFrequency>> {
    if (data.id) {
      const existingPayrollFrequency = await this.service.findById(data.id);
      if (existingPayrollFrequency) {
        return this.commandBus.execute(
          new UpdatePayrollFrequencyCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePayrollFrequencyDto | UpdatePayrollFrequencyDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePayrollFrequencyCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePayrollFrequencyDto | UpdatePayrollFrequencyDto).createdBy ||
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePayrollFrequency(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePayrollFrequencyCommand(id));
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  // Queries
  @Query(() => PayrollFrequencysResponse<PayrollFrequency>)
  async payrollfrequencys(
    options?: FindManyOptions<PayrollFrequency>,
    paginationArgs?: PaginationArgs
  ): Promise<PayrollFrequencysResponse<PayrollFrequency>> {
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Query(() => PayrollFrequencysResponse<PayrollFrequency>)
  async payrollfrequency(
    @Args("id", { type: () => String }) id: string
  ): Promise<PayrollFrequencyResponse<PayrollFrequency>> {
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Query(() => PayrollFrequencysResponse<PayrollFrequency>)
  async payrollfrequencysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PayrollFrequencyValueInput }) value: PayrollFrequencyValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PayrollFrequencysResponse<PayrollFrequency>> {
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Query(() => PayrollFrequencysResponse<PayrollFrequency>)
  async payrollfrequencysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PayrollFrequencysResponse<PayrollFrequency>> {
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Query(() => Number)
  async totalPayrollFrequencys(): Promise<number> {
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Query(() => PayrollFrequencysResponse<PayrollFrequency>)
  async searchPayrollFrequencys(
    @Args("where", { type: () => PayrollFrequencyDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollFrequencysResponse<PayrollFrequency>> {
    const payrollfrequencys = await this.service.findAndCount(where);
    return payrollfrequencys;
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Query(() => PayrollFrequencyResponse<PayrollFrequency>, { nullable: true })
  async findOnePayrollFrequency(
    @Args("where", { type: () => PayrollFrequencyDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollFrequencyResponse<PayrollFrequency>> {
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
      .registerClient(PayrollFrequencyResolver.name)

      .get(PayrollFrequencyResolver.name),
    })
  @Query(() => PayrollFrequencyResponse<PayrollFrequency>)
  async findOnePayrollFrequencyOrFail(
    @Args("where", { type: () => PayrollFrequencyDto, nullable: false })
    where: Record<string, any>
  ): Promise<PayrollFrequencyResponse<PayrollFrequency> | Error> {
    return this.service.findOneOrFail(where);
  }
}

